"""
Baseline pipeline driver with tracing and validation scaffolding.

Usage (dry run with sample payload):
  python driver.py --pipeline pipeline.video_ingest_to_index --dry-run

Provide a JSON payload file to validate real inputs:
  python driver.py --pipeline pipeline.semantic_search --payload payload.json --dry-run
"""

import argparse
import json
import time
import uuid
from dataclasses import asdict, dataclass, field
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

import yaml
from jsonpath_ng import parse as jsonpath_parse
from jsonschema import Draft7Validator

CONFIG_PATH = Path("config/pipeline_config.yaml")
TRACE_DIR = Path("traces")


@dataclass
class TraceEvent:
    trace_id: str
    pipeline_id: str
    step_id: str
    status: str
    started_at: str
    ended_at: Optional[str]
    latency_ms: Optional[float]
    inputs: Dict[str, Any] = field(default_factory=dict)
    outputs: Dict[str, Any] = field(default_factory=dict)
    error: Optional[str] = None
    notes: List[str] = field(default_factory=list)


class TraceLogger:
    def __init__(self, pipeline_id: str, trace_dir: Path = TRACE_DIR) -> None:
        self.trace_id = f"{datetime.utcnow().strftime('%Y%m%dT%H%M%SZ')}-{uuid.uuid4().hex[:8]}"
        self.pipeline_id = pipeline_id
        self.trace_dir = trace_dir
        self.events: List[TraceEvent] = []

    @property
    def path(self) -> Path:
        return self.trace_dir / f"{self.pipeline_id}-{self.trace_id}.jsonl"

    def record(
        self,
        step_id: str,
        status: str,
        started_at: float,
        inputs: Dict[str, Any],
        outputs: Optional[Dict[str, Any]] = None,
        error: Optional[str] = None,
        notes: Optional[List[str]] = None,
    ) -> None:
        ended_at = time.time()
        event = TraceEvent(
            trace_id=self.trace_id,
            pipeline_id=self.pipeline_id,
            step_id=step_id,
            status=status,
            started_at=datetime.utcfromtimestamp(started_at).isoformat() + "Z",
            ended_at=datetime.utcfromtimestamp(ended_at).isoformat() + "Z",
            latency_ms=round((ended_at - started_at) * 1000, 2),
            inputs=inputs,
            outputs=outputs or {},
            error=error,
            notes=notes or [],
        )
        self.events.append(event)

    def flush(self) -> Path:
        self.trace_dir.mkdir(parents=True, exist_ok=True)
        self.path.write_text("\n".join(json.dumps(asdict(e)) for e in self.events))
        return self.path


def load_config(path: Path = CONFIG_PATH) -> Dict[str, Any]:
    return yaml.safe_load(path.read_text())


def find_pipeline(config: Dict[str, Any], pipeline_id: str) -> Dict[str, Any]:
    for pipeline in config.get("pipelines", []):
        if pipeline.get("id") == pipeline_id:
            return pipeline
    raise ValueError(f"Pipeline '{pipeline_id}' not found in config.")


def validate_payload(payload: Dict[str, Any], schema: Dict[str, Any]) -> List[str]:
    validator = Draft7Validator(schema)
    errors = sorted(validator.iter_errors(payload), key=lambda e: e.path)
    return [f"{'/'.join(map(str, err.path)) or '<root>'}: {err.message}" for err in errors]


def resolve_inputs(raw_inputs: Dict[str, Any], context: Dict[str, Any]) -> Tuple[Dict[str, Any], List[str]]:
    resolved: Dict[str, Any] = {}
    notes: List[str] = []
    for key, value in (raw_inputs or {}).items():
        if isinstance(value, str) and value.startswith("$."):
            try:
                expr = jsonpath_parse(value)
                matches = [match.value for match in expr.find(context)]
                if not matches:
                    resolved[key] = None
                    notes.append(f"{key}: jsonpath '{value}' returned no results")
                elif len(matches) == 1:
                    resolved[key] = matches[0]
                else:
                    resolved[key] = matches
            except Exception as exc:  # noqa: BLE001
                resolved[key] = None
                notes.append(f"{key}: failed to resolve '{value}' ({exc})")
        else:
            resolved[key] = value
    return resolved, notes


SAMPLE_PAYLOADS: Dict[str, Dict[str, Any]] = {
    "pipeline.video_ingest_to_index": {
        "video_b64": "ZGVtbw==",
        "content_type": "video/mp4",
        "dst_path": "videos/sample.mp4",
        "segmentation": {"strategy": "shot_detect", "interval_sec": 2.0},
        "perception": {"caption_prompt": "Concise captions.", "ocr_lang": "eng", "det_model": "yolov8n"},
        "index": {"namespace": "videos"},
    },
    "pipeline.semantic_search": {
        "query": "person at whiteboard",
        "namespace": "videos",
        "top_k": 3,
    },
    "pipeline.web_enriched_index": {
        "video_b64": "ZGVtbw==",
        "content_type": "video/mp4",
        "dst_path": "videos/sample.mp4",
        "topic": "multimodal retrieval",
        "segmentation": {"strategy": "shot_detect", "interval_sec": 2.0},
        "index": {"namespace": "videos"},
    },
}


class PipelineDriver:
    def __init__(self, config_path: Path = CONFIG_PATH, trace_dir: Path = TRACE_DIR) -> None:
        self.config = load_config(config_path)
        self.trace_dir = trace_dir

    def run(
        self,
        pipeline_id: str,
        payload: Dict[str, Any],
        dry_run: bool = True,
    ) -> Dict[str, Any]:
        pipeline = find_pipeline(self.config, pipeline_id)
        validation_errors = validate_payload(payload, pipeline.get("inputs", {}))
        trace_logger = TraceLogger(pipeline_id, trace_dir=self.trace_dir)

        if validation_errors:
            trace_logger.events.append(
                TraceEvent(
                    trace_id=trace_logger.trace_id,
                    pipeline_id=pipeline_id,
                    step_id="validation",
                    status="failed",
                    started_at=datetime.utcnow().isoformat() + "Z",
                    ended_at=None,
                    latency_ms=None,
                    inputs=payload,
                    outputs={},
                    error="; ".join(validation_errors),
                    notes=[],
                )
            )
            trace_path = trace_logger.flush()
            return {"status": "failed", "trace_path": str(trace_path), "errors": validation_errors}

        context = dict(payload)
        for step in pipeline.get("steps", []):
            started_at = time.time()
            resolved_inputs, notes = resolve_inputs(step.get("with", {}), context)

            if dry_run:
                outputs = {"skipped": True, "reason": "dry_run"}
                status = "skipped"
                error = None
            else:
                outputs = {}
                status = "pending"
                error = "No executor provided; implement tool/agent execution to run live."

            context[step["id"]] = outputs
            trace_logger.record(
                step_id=step["id"],
                status=status,
                started_at=started_at,
                inputs=resolved_inputs,
                outputs=outputs,
                error=error,
                notes=notes,
            )

        trace_path = trace_logger.flush()
        return {"status": "ok", "trace_path": str(trace_path)}


def load_payload_arg(raw: Optional[str], pipeline_id: str) -> Dict[str, Any]:
    if raw is None:
        return SAMPLE_PAYLOADS.get(pipeline_id, {})
    path = Path(raw)
    if path.exists():
        return json.loads(path.read_text())
    return json.loads(raw)


def main() -> None:
    parser = argparse.ArgumentParser(description="Baseline pipeline driver with tracing/validation.")
    parser.add_argument("--pipeline", required=True, help="Pipeline ID to run (see config/pipeline_config.yaml).")
    parser.add_argument("--payload", help="JSON file path or JSON string payload. Defaults to a sample payload.")
    parser.add_argument("--dry-run", action="store_true", help="Skip execution and only validate/trace inputs (default).")
    parser.add_argument("--live", action="store_true", help="Attempt live execution (requires executor wiring).")
    args = parser.parse_args()

    payload = load_payload_arg(args.payload, args.pipeline)
    driver = PipelineDriver()
    dry_run = True
    if args.live:
        dry_run = False
    elif args.dry_run:
        dry_run = True
    result = driver.run(args.pipeline, payload, dry_run=dry_run)
    print(json.dumps(result, indent=2))


if __name__ == "__main__":
    main()
