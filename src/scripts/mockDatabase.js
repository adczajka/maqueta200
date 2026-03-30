const mockDatabase = {
    agents: [
        { id: 1,  name: "Carlos Oliveira",   rank: "Mayor",             available: true  },
        { id: 2,  name: "Fernanda Lima",     rank: "Guardia",           available: true  },
        { id: 3,  name: "Ricardo Souza",     rank: "Principal",         available: false },
        { id: 4,  name: "Aline Pereira",     rank: "Sargento",          available: true  },
        { id: 5,  name: "Thiago Mendes",     rank: "Cabo",              available: false },
        { id: 6,  name: "Juliana Costa",     rank: "Mayor",             available: true  },
        { id: 7,  name: "Bruno Almeida",     rank: "Sargento 1ro",      available: true  },
        { id: 8,  name: "Patrícia Rocha",    rank: "Guardia",           available: false },
        { id: 9,  name: "Eduardo Nunes",     rank: "Principal",         available: true  },
        { id: 10, name: "Mariana Ferreira",  rank: "Sargento",          available: true  },
        { id: 11, name: "Lucas Barbosa",     rank: "Cabo 1ro",          available: true  },
        { id: 12, name: "Camila Teixeira",   rank: "Sargento",          available: false },
        { id: 13, name: "Rafael Cardoso",    rank: "Mayor",             available: true  },
        { id: 14, name: "Isabela Martins",   rank: "Cabo",              available: true  },
        { id: 15, name: "Gustavo Ribeiro",   rank: "Sargento 1ro",      available: true  },
        { id: 16, name: "Tatiane Correia",   rank: "Guardia",           available: false },
        { id: 17, name: "Henrique Dias",     rank: "Principal",         available: true  },
        { id: 18, name: "Vanessa Moreira",   rank: "Sargento Ayudante", available: true  },
        { id: 19, name: "Diego Cavalcanti",  rank: "Cabo 1ro",          available: true  },
        { id: 20, name: "Larissa Pinto",     rank: "Mayor",             available: false },
        { id: 21, name: "Felipe Nascimento", rank: "Guardia",           available: true  },
        { id: 22, name: "Amanda Silveira",   rank: "Sargento",          available: true  },
        { id: 23, name: "Rodrigo Fonseca",   rank: "Principal",         available: true  },
        { id: 24, name: "Natália Gomes",     rank: "Cabo",              available: false },
        { id: 25, name: "Leandro Vieira",    rank: "Sargento 1ro",      available: true  },
        { id: 26, name: "Priscila Azevedo",  rank: "Mayor",             available: true  },
        { id: 27, name: "Matheus Carvalho",  rank: "Cabo 1ro",          available: true  },
        { id: 28, name: "Renata Campos",     rank: "Sargento Ayudante", available: false },
        { id: 29, name: "André Monteiro",    rank: "Principal",         available: true  },
        { id: 30, name: "Débora Lopes",      rank: "Guardia",           available: true  },
        { id: 31, name: "Vitor Medeiros",    rank: "Sargento",          available: true  },
        { id: 32, name: "Cristiane Batista", rank: "Mayor",             available: false },
        { id: 33, name: "João Pedro Ramos",  rank: "Cabo",              available: true  },
        { id: 34, name: "Simone Aragão",     rank: "Sargento 1ro",      available: true  },
        { id: 35, name: "Fábio Queiroz",     rank: "Principal",         available: true  },
        { id: 36, name: "Mônica Esteves",    rank: "Guardia",           available: false },
        { id: 37, name: "Caio Nogueira",     rank: "Sargento Ayudante", available: true  },
        { id: 38, name: "Letícia Brandão",   rank: "Mayor",             available: true  },
        { id: 39, name: "Samuel Freitas",    rank: "Cabo 1ro",          available: true  },
        { id: 40, name: "Bianca Rezende",    rank: "Sargento",          available: false },
        { id: 41, name: "Danilo Matos",      rank: "Principal",         available: true  },
        { id: 42, name: "Érica Cunha",       rank: "Cabo",              available: true  },
        { id: 43, name: "Murilo Pires",      rank: "Sargento 1ro",      available: true  },
        { id: 44, name: "Adriana Sousa",     rank: "Mayor",             available: false },
        { id: 45, name: "Wellington Cruz",   rank: "Guardia",           available: true  },
        { id: 46, name: "Sabrina Macedo",    rank: "Sargento Ayudante", available: true  },
        { id: 47, name: "Marcos Andrade",    rank: "Principal",         available: true  },
        { id: 48, name: "Cláudia Borges",    rank: "Cabo 1ro",          available: false },
        { id: 49, name: "Tiago Salles",      rank: "Sargento",          available: true  },
        { id: 50, name: "Roberta Tavares",   rank: "Mayor",             available: true  },
    ],

    _queue: [],
    _rankOrder: {
        "Guardia": 0, "Cabo": 1, "Cabo 1ro": 2, "Sargento": 3,
        "Sargento 1ro": 4, "Sargento Ayudante": 5, "Principal": 6, "Mayor": 7,
    },

    _refillQueue() {
        this._queue = [...this.agents]
            .filter(a => a.available)
            .sort((a, b) => this._rankOrder[a.rank] - this._rankOrder[b.rank]);
    },

    getNextAgents(count = 5) {
        const result = [];
        while (result.length < count) {
            if (this._queue.length === 0) this._refillQueue();
            if (this._queue.length === 0) break;
            result.push(this._queue.shift());
        }
        return result;
    },

    getAllAgents()    { return this.agents; },
    getAgentById(id) { return this.agents.find(a => a.id === id) || null; },
};