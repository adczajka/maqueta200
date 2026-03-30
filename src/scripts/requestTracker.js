const requestTracker = {
    // Elimina los agentes dados de todos los pedidos activos (libera para futuras solicitudes)
    finishRequestByIdx(idx) {
        if (typeof idx !== 'number' || !this.history[idx]) return;
        this.history[idx].finished = true;
        // Al finalizar, liberar los agentes de este pedido para futuras solicitudes
        const finishedAgentIds = (this.history[idx].agents || []).map(a => a.id);
        // Quitar estos agentes de todos los pedidos NO finalizados
        this.history.forEach((item, i) => {
            if (!item.finished && item.agents && Array.isArray(item.agents)) {
                item.agents = item.agents.filter(a => !finishedAgentIds.includes(a.id));
            }
        });
        try {
            localStorage.setItem('requestHistory', JSON.stringify(this.history));
        } catch (e) {}
    },
    // Maps agent id → number of times called
    callCounts: {},
    // Historial de solicitudes enviadas
    history: [],

    // Guarda los agentes y los datos de la notificación
    record(agents, notificationData) {
        // Crear un ID único para la solicitud
        const requestId = Date.now() + '-' + Math.floor(Math.random() * 100000);
        // Relacionar cada agente con la solicitud
        agents.forEach(agent => {
            this.callCounts[agent.id] = (this.callCounts[agent.id] || 0) + 1;
        });
        // Guardar en historial con requestId y agentes notificados
        const entry = {
            id: requestId,
            timestamp: new Date().toISOString(),
            agents: agents.map(a => ({...a, notifiedOn: requestId})),
            notification: {...notificationData, requestId}
        };
        this.history.push(entry);
        // Persistir en localStorage
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