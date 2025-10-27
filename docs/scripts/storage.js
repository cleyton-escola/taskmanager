// LocalStorage Manager for Static Site
class TaskManagerStorage {
    constructor() {
        this.STORAGE_KEY = 'taskManagerData';
        this.initStorage();
    }

    // Initialize storage with default data if empty
    initStorage() {
        if (!localStorage.getItem(this.STORAGE_KEY)) {
            const defaultData = {
                quadros: [],
                tarefas: [],
                nextQuadroId: 1,
                nextTarefaId: 1
            };
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(defaultData));
        }
    }

    // Get all data from storage
    getData() {
        const data = localStorage.getItem(this.STORAGE_KEY);
        return data ? JSON.parse(data) : null;
    }

    // Save data to storage
    saveData(data) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    }

    // Get all quadros
    getQuadros() {
        const data = this.getData();
        return data.quadros || [];
    }

    // Create new quadro
    createQuadro(description) {
        const data = this.getData();
        const newQuadro = {
            id: data.nextQuadroId,
            description: description,
            createdAt: new Date().toISOString()
        };
        data.quadros.push(newQuadro);
        data.nextQuadroId++;
        this.saveData(data);
        return newQuadro;
    }

    // Update quadro
    updateQuadro(id, description) {
        const data = this.getData();
        const quadro = data.quadros.find(q => q.id === parseInt(id));
        if (quadro) {
            quadro.description = description;
            quadro.updatedAt = new Date().toISOString();
            this.saveData(data);
            return quadro;
        }
        return null;
    }

    // Delete quadro
    deleteQuadro(id) {
        const data = this.getData();
        data.quadros = data.quadros.filter(q => q.id !== parseInt(id));
        // Also delete all tasks in this quadro
        data.tarefas = data.tarefas.filter(t => t.quadroId !== parseInt(id));
        this.saveData(data);
        return true;
    }

    // Get tasks by quadro
    getTarefasByQuadro(quadroId) {
        const data = this.getData();
        return data.tarefas.filter(t => t.quadroId === parseInt(quadroId));
    }

    // Create new tarefa
    createTarefa(description, quadroId) {
        const data = this.getData();
        const newTarefa = {
            id: data.nextTarefaId,
            description: description,
            quadroId: parseInt(quadroId),
            createdAt: new Date().toISOString()
        };
        data.tarefas.push(newTarefa);
        data.nextTarefaId++;
        this.saveData(data);
        return newTarefa;
    }

    // Update tarefa
    updateTarefa(id, description) {
        const data = this.getData();
        const tarefa = data.tarefas.find(t => t.id === parseInt(id));
        if (tarefa) {
            tarefa.description = description;
            tarefa.updatedAt = new Date().toISOString();
            this.saveData(data);
            return tarefa;
        }
        return null;
    }

    // Move tarefa to different quadro
    changeTarefaQuadro(id, newQuadroId) {
        const data = this.getData();
        const tarefa = data.tarefas.find(t => t.id === parseInt(id));
        if (tarefa) {
            tarefa.quadroId = parseInt(newQuadroId);
            tarefa.updatedAt = new Date().toISOString();
            this.saveData(data);
            return tarefa;
        }
        return null;
    }

    // Delete tarefa
    deleteTarefa(id) {
        const data = this.getData();
        data.tarefas = data.tarefas.filter(t => t.id !== parseInt(id));
        this.saveData(data);
        return true;
    }

    // Clear all data
    clearAll() {
        localStorage.removeItem(this.STORAGE_KEY);
        this.initStorage();
    }
}

// Create global storage instance
const storage = new TaskManagerStorage();

// Global function to clear all data
function clearAllData() {
    if (confirm('Tem certeza que deseja limpar todos os dados? Esta ação não pode ser desfeita.')) {
        storage.clearAll();
        window.location.reload();
    }
}
