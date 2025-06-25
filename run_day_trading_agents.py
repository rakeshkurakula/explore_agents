import yaml
from crewai import Agent, Task, Crew, Process
from crewai_tools import SerperDevTool


def load_config(path: str):
    with open(path, "r") as f:
        return yaml.safe_load(f)


def create_agents(agent_defs):
    search_tool = SerperDevTool()
    agents = {}
    for name, info in agent_defs.items():
        tools = [search_tool] if name == "search_agent" else []
        agents[name] = Agent(
            role=info["role"],
            goal=info["goal"],
            backstory=info["backstory"],
            tools=tools,
            verbose=True,
        )
    return agents, search_tool


def create_tasks(task_defs, agents, search_tool):
    tasks = []
    for name, info in task_defs.items():
        tools = [search_tool] if info.get("assigned_agent") == "search_agent" else []
        task = Task(
            description=info["description"],
            agent=agents[info["assigned_agent"]],
            expected_output=info["expected_output"],
            tools=tools,
        )
        tasks.append(task)
    return tasks


def main():
    config = load_config("day_trading_config.yaml")
    agents, search_tool = create_agents(config["agents"])
    tasks = create_tasks(config["tasks"], agents, search_tool)

    crew = Crew(
        agents=list(agents.values()),
        tasks=tasks,
        process=Process.sequential,
        verbose=True,
    )

    result = crew.kickoff()
    print("\nFinal result:\n", result)


if __name__ == "__main__":
    main()
