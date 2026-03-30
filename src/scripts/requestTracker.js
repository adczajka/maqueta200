const requestTracker = {
    // Maps agent id → number of times called
    callCounts: {},

    record(agents) {
        agents.forEach(agent => {
            this.callCounts[agent.id] = (this.callCounts[agent.id] || 0) + 1;
        });
    },

    getCallCount(agentId) {
        return this.callCounts[agentId] || 0;
    },

    hasBeenCalled(agentId) {
        return (this.callCounts[agentId] || 0) > 0;
    },
};