const agentSelector = {
    selectAgents(count = 5) {
        return mockDatabase.getNextAgents(count);
    },
};