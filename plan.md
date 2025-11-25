# Frontier-Agent Strategy & Execution Plan

## Objectives
- Build mastery of high-leverage agent patterns (planning, routing, reflection, multi-agent delegation) using this repo’s pipelines.
- Prioritize reliability, evals, and safety so frontier models run predictably with tools.
- Deliver reusable building blocks (drivers, traces, tests, docs) for rapid iteration.

## Phase 1: Orient & Instrument
- Read `README.md`, `AGENTS.md`, `config/pipeline_config.yaml`, `agent_config.yaml`; diagram current tool/agent graph and data shapes.
- Stand up env: `python -m venv .venv && source .venv/bin/activate && pip install -r requirements.txt`.
- Add structured logging and trace IDs around agent calls (inputs hash, latency, tool/model name, errors) to enable later evals.

## Phase 2: Baseline & Guardrails
- Run a minimal pipeline with synthetic or small media; capture traces and failure points.
- Add lightweight pydantic/dataclass validation on pipeline inputs/outputs to detect schema drift.
- Establish safety defaults: max tokens, rate limits, banned content filters, and deterministic tool argument validation.

## Phase 3: Pattern Library (frontier-focused)
- Planner/Executor: model emits a plan; executor enforces step contracts, retries idempotent steps, and short-circuits on confidence.
- Router/MoE: route between vision/text tools or model grades; include confidence thresholds and cold-start defaults.
- Reflection/Repair: after tool outputs, run a short reflection pass to detect incoherence and optionally re-query/fallback.
- Delegation Chains: research → summarize → fact-check (from `agent_config.yaml`), with structured outputs and explicit dependencies.
- Concurrency & Caching: parallelize independent tool calls; memoize deterministic steps (embeddings, captions) by content hash.

## Phase 4: Evaluation Harness
- Define a small eval set (queries, media snippets, expected attributes) and write `pytest`-driven checks for: tool selection, latency budgets, correctness proxies (e.g., caption contains target entities), and safety adherence.
- Track metrics: success rate, fallback hit rate, p95 latency per tool, cost per run, and error taxonomy.

## Phase 5: Performance, Cost, and Robustness
- Tune prompts/system messages for brevity and determinism; prefer structured outputs over free text.
- Add retry/backoff policies per tool; set circuit-breakers when an upstream model degrades.
- Explore cheaper vs. frontier models for substeps; log cost deltas and quality impact.

## Phase 6: Documentation & Reuse
- Produce a short `docs/agents.md` (or expand `AGENTS.md`) with: patterns, when-to-use guidance, API contracts, and sample traces.
- Package common utilities (tracing, validation, retry/fallback helpers, router) into reusable modules.

## Phase 7: Stretch Experiments
- Integrate retrieval-enriched planning and web search for harder tasks; measure gains vs. latency/cost.
- Try guardrails or policy checks (content filters, allowlists for tools) before executing side-effectful actions.
- Investigate memory buffers or short-term context windows for multi-turn tasks without excessive token use.
