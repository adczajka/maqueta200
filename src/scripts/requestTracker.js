const requestTracker = {
    // Maps agent id → number of times called
    callCounts: {},
    // Historial de solicitudes enviadas
    history: [],

    // Guarda los agentes y los datos de la notificación
    record(agents, notificationData) {
        agents.forEach(agent => {
            this.callCounts[agent.id] = (this.callCounts[agent.id] || 0) + 1;
        });
        // Guardar en historial
        this.history.push({
            timestamp: new Date().toISOString(),
            agents: agents.map(a => ({...a})),
            notification: {...notificationData}
        });
        // Opcional: persistir en localStorage
        try {
            localStorage.setItem('requestHistory', JSON.stringify(this.history));
        } catch (e) {}
    },

    getCallCount(agentId) {
        return this.callCounts[agentId] || 0;
    },

    hasBeenCalled(agentId) {
        return (this.callCounts[agentId] || 0) > 0;
    },

    getHistory() {
        // Intentar cargar de localStorage si está vacío
        if (this.history.length === 0) {
            try {
                const data = localStorage.getItem('requestHistory');
                if (data) this.history = JSON.parse(data);
            } catch (e) {}
        }
        return this.history;
    },
    clearHistory() {
        this.history = [];
        try { localStorage.removeItem('requestHistory'); } catch (e) {}
    }
};