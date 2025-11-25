# explore_agents

A modular FastMCP + Video Agent pipeline demonstrating multimodal processing, semantic search, and web-enriched indexing.

- Key files:
  - `config/pipeline_config.yaml` — tools, agents, pipelines, and flow docs
  - `agent_config.yaml` — agent role/task examples for research/summarization
  - `notebooks/` — exploratory notebooks for agents and tools

## Why this project
Fast iteration on video understanding stacks requires clear contracts between tools, agents, and pipelines. This repo provides:
- Explicit tool/agent I/O schemas
- Reusable pipelines (ingest → segment → perceive → index → search)
- Web research enrichment (Serper) and vector search
- Production-ready Dockerfile and examples

---
## Installation

Prerequisites:
- Python 3.10+

Environment variables:
- OPENAI_API_KEY (for vision LLM if used)
- SERPER_API_KEY (for web search)
- STORAGE_BUCKET (e.g., s3://my-bucket or file:// for local)
- TRANSIENT_DIR (local tmp directory)

Install Python dependencies:
```bash
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
```

---
## Quickstart

1) Configure pipeline
- Open `config/pipeline_config.yaml` and review tools/agents

2) Run ingestion→indexing (example pseudo-runner):
```python
# examples/run_ingest_index.py
import base64, json
from pathlib import Path
from pipeline import run_pipeline  # your orchestrator loader

video_b64 = base64.b64encode(Path('sample.mp4').read_bytes()).decode()
inputs = {
  'video_b64': video_b64,
  'content_type': 'video/mp4',
  'dst_path': 'videos/sample.mp4',
  'segmentation': {'strategy': 'shot_detect', 'interval_sec': 2.0},
  'perception': {'caption_prompt': 'Concise, factual captions.'},
  'index': {'namespace': 'videos'}
}
print(json.dumps(run_pipeline('pipeline.video_ingest_to_index', inputs), indent=2))
```

3) Query semantic search:
```python
from pipeline import run_pipeline
print(run_pipeline('pipeline.semantic_search', {
  'query': 'person speaking at whiteboard',
  'namespace': 'videos',
  'top_k': 5
}))
```

---
## Architecture

The system consists of FastMCP tools, specialized agents, and composed pipelines:
- Tools: stateless capabilities (storage, video segmentation, OCR/detection/captioning, embeddings, vector index, web search)
- Agents: orchestrate tools with validated inputs/outputs
- Pipelines: chain agents into end-to-end flows

Textual flow diagram (data and control lines):
- Client → agent.ingest → storage.put → video_uri
- agent.segment(video_uri) → segments[keyframe_uri]
- agent.perception(keyframes)
  - vision.caption → captions
  - vision.ocr → text
  - vision.detect → boxes
- agent.indexer
  - vision.embed(keyframes/captions) → vectors
  - index.upsert(namespace, vector, metadata)
- agent.search (text query)
  - vision.embed(query) → query_vector
  - index.query(query_vector, top_k) → matches
- Optional enrichment: agent.webresearch(topic) → results

See full configuration with JSON Schemas in `config/pipeline_config.yaml`.

---
## Usage Details

CLI example (pseudo):
```bash
python -m pipelines.run --pipeline pipeline.video_ingest_to_index \
  --video sample.mp4 --dst videos/sample.mp4 \
  --strategy shot_detect --interval 2.0
```

API example (FastAPI-style):
```python
@app.post('/ingest')
def ingest(req: IngestRequest):
    return run_pipeline('pipeline.video_ingest_to_index', req.dict())
```

Outputs include:
- video_uri: persistent location of uploaded video
- segments: timing and keyframe URIs
- upserted: count of index records

---
## FastMCP Integration

- Tools are declared with explicit JSON Schemas (inputs/outputs)
- Agents reference tools and validate payloads
- Pipelines map step outputs to inputs using JSONPath-like references (e.g., `$.s1_ingest.video_uri`)

Code/config examples live in `config/pipeline_config.yaml`.

---
## Video Agent Stack

- Segmenter: fixed interval or shot detection with keyframe extraction
- Perception: captioning (vision LLM), OCR, detection (YOLO)
- Embedding: CLIP-style embeddings supporting image+text
- Index: vector database with metadata
- Search: text or image query → nearest frames

Tuning tips:
- Increase segment interval for long videos
- Use higher YOLO model size for accuracy (`yolov8m/yolov8l`)
- Store both frame and caption embeddings for better recall

---
## License

MIT — see LICENSE.
