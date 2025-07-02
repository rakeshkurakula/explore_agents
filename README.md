# explore_agent

Exploring agents with Agno and Crew AI

## Day Trading Example

This repository now includes a simple example of building a multi-agent crew for day trading research and planning. The configuration lives in `day_trading_config.yaml` and defines:

- A search agent that gathers information from Crewai documentation and SEBI regulations.
- ReAct, planning and reflective agents that analyze the results and develop a strategy.
- A day trading agent that performs paper trading using the generated plan.

Before running the example, set your Serper API key so the search agent can query the web:

```bash
export SERPER_API_KEY=your_serper_api_key
```

Run the crew with:

```bash
python run_day_trading_agents.py
```

This will execute the tasks sequentially and print the final simulated trading summary.

The example simulates a trading workflow only and is not financial advice.
