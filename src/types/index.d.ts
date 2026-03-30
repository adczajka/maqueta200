interface Agent {
    id: number;
    name: string;
    status: 'available' | 'on vacation' | 'sick leave';
    abilities: string[];
}

interface RequestTracker {
    requestedAgents: Set<number>;
    addRequest(agentId: number): void;
    hasRequested(agentId: number): boolean;
}