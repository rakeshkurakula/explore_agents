# Repository Guidelines

## Project Structure & Module Organization
- Core pipeline configs live in `config/pipeline_config.yaml` (FastMCP tools/agents/pipelines) and `agent_config.yaml` (research/summarization agent examples).
- Exploratory notebooks are under `notebooks/` for prototyping tools and agents.
- `README.md` is the primary orientation doc; keep it consistent with config changes.

## Build, Test, and Development Commands
```bash
# Python env
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
```
Explain commands in commits/PRs if you add new scripts or targets.

## Coding Style & Naming Conventions
- Python: 4-space indent, snake_case for functions/vars, CapWords for classes; favor type hints and small, pure functions. Keep YAML schemas deterministic (stable key order, descriptive field names).
- Configs: keep env-var names uppercase (e.g., `OPENAI_API_KEY`, `SERPER_API_KEY`, `STORAGE_BUCKET`, `TRANSIENT_DIR`). Avoid committing secrets; use `.env` locally.

## Testing Guidelines
- No formal test suite is present; add coverage alongside new logic. Prefer `pytest` for Python utilities and minimal integration checks for pipeline runners.
- Provide sample inputs or fixtures when touching pipeline YAML to validate schema changes manually.

## Commit & Pull Request Guidelines
- Git history uses Conventional Commit prefixes (`build`, `chore`, `docs`); follow the same (`feat`, `fix`, `refactor`, etc.).
- PRs should include: purpose, scope, impacted configs, env var changes, and manual test notes.
- Link issues when available, keep PRs scoped, and mention any follow-up work left intentionally out.

## Security & Configuration Tips
- Keep API keys and JWT secrets in local `.env` files; never commit them. Document required variables in PRs when adding new ones.
- Validate any new tool/agent schemas in `config/pipeline_config.yaml` for input/output contract clarity before deploying or publishing Docker images.
