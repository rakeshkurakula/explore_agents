import yaml
from crewai import Agent, Task, Crew, Process
from crewai_tools import SerperDevTool
from collections import defaultdict, deque


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


def _sort_task_names(task_defs):
    indegree = {name: 0 for name in task_defs}
    graph = defaultdict(list)

    for name, info in task_defs.items():
        deps = info.get("depends_on")
        if not deps:
            continue
        if isinstance(deps, str):
            deps = [deps]
        for dep in deps:
            if dep not in task_defs:
                raise KeyError(f"Task '{name}' depends on undefined task '{dep}'")
            graph[dep].append(name)
            indegree[name] += 1

    queue = deque([n for n, d in indegree.items() if d == 0])
    ordered = []
    while queue:
        current = queue.popleft()
        ordered.append(current)
        for neighbor in graph.get(current, []):
            indegree[neighbor] -= 1
            if indegree[neighbor] == 0:
                queue.append(neighbor)

    if len(ordered) != len(task_defs):
        raise ValueError("Cycle detected in task dependencies")
    return ordered


def create_tasks(task_defs, agents, search_tool):
    task_objs = {}
    for name, info in task_defs.items():
        tools = [search_tool] if info.get("assigned_agent") == "search_agent" else []
        task_objs[name] = Task(
            description=info["description"],
            agent=agents[info["assigned_agent"]],
            expected_output=info["expected_output"],
            tools=tools,
        )

    ordered_names = _sort_task_names(task_defs)
    return [task_objs[n] for n in ordered_names]


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
