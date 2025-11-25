# Agent Patterns & Orchestration Guide

## Scope
- Audience: contributors building or extending agents defined in `config/pipeline_config.yaml` and `agent_config.yaml`.
- Goal: ship reliable, frontier-ready agents with clear contracts, traces, and tests.

## Instrumentation & Safety Defaults
- Add structured logs on every agent/tool call: trace ID, tool/model, input hash, latency, token/cost, error code.
- Validate I/O with pydantic/dataclasses at pipeline boundaries to catch schema drift before tool calls.
- Guardrails: set max tokens/cost per call, allowlist tools, sanitize tool args, and short-circuit on repeated failures (circuit breaker + backoff).

## Core Patterns (use selectively)
- Planner/Executor: a model proposes steps; executor enforces contracts, retries idempotent steps, and stops on confidence thresholds. Keep plans short and grounded in available tools.
- Router/MoE: route by modality or difficulty (e.g., text-only vs. vision-enabled). Use simple heuristics + model-graded fallback; log routing decisions for evals.
- Reflection/Repair: after tool outputs, run a brief self-check for incoherence/missing fields; optionally re-run with a constrained prompt or switch to a fallback tool.
- Delegation Chains: mirror `agent_config.yaml` (research → summarize → fact-check) with structured outputs and explicit dependencies; persist intermediate artifacts for reuse.
- Concurrency & Caching: parallelize independent steps; cache deterministic outputs (embeddings, captions) keyed by content hash and model version.

## Evaluation Harness
- Build `pytest` checks for: correct tool selection, schema validity, latency budgets (p95), fallback hit rate, and safety compliance.
- Curate a small eval set (queries/media + expected attributes). Store fixtures and expected summaries/facts to compare against model outputs.
- Track metrics per run: success rate, error taxonomy, cost, latency, and number of retries.

## Minimal Driver (starting point)
1) Install deps: `python -m venv .venv && source .venv/bin/activate && pip install -r requirements.txt`.
2) Use `driver.py` for dry runs and tracing: `python driver.py --pipeline pipeline.video_ingest_to_index --dry-run` (uses sample payloads; writes JSONL traces to `traces/`).
3) Provide a JSON payload file for real validation: `python driver.py --pipeline pipeline.semantic_search --payload payload.json --dry-run`.
4) Wire live execution by adding an executor to `PipelineDriver.run` and feeding resolved inputs per step; keep tracing on.
5) Hook the driver into `pytest` for smoke tests; fail fast on schema issues or unexpected routing.

## Documentation & Reuse
- Keep code pointers and example traces here and in `AGENTS.md`; update when tool contracts or prompts change.
- Factor shared helpers (tracing, validation, retry/fallback, routing) into reusable modules to avoid drift across agents.
