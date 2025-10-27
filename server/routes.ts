import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

const DEFAULT_USER_ID = "default-user";

export async function registerRoutes(app: Express): Promise<Server> {
  app.get('/api/quadros', async (req: any, res) => {
    try {
      const userQuadros = await storage.getQuadros(DEFAULT_USER_ID);
      res.json(userQuadros);
    } catch (error) {
      console.error("Error fetching quadros:", error);
      res.status(500).json({ error: "Failed to fetch quadros" });
    }
  });

  app.post('/api/quadros/new', async (req: any, res) => {
    try {
      const { description } = req.body;
      
      if (!description) {
        return res.status(400).json({ error: "Description is required" });
      }

      const newQuadro = await storage.createQuadro({
        userId: DEFAULT_USER_ID,
        description,
      });
      
      res.json(newQuadro);
    } catch (error) {
      console.error("Error creating quadro:", error);
      res.status(500).json({ error: "Failed to create quadro" });
    }
  });

  app.post('/api/quadros/update/:id', async (req: any, res) => {
    try {
      const { id } = req.params;
      const { description } = req.body;

      if (!description) {
        return res.status(400).json({ error: "Description is required" });
      }

      const updated = await storage.updateQuadro(id, DEFAULT_USER_ID, description);
      
      if (!updated) {
        return res.status(404).json({ error: "Quadro not found" });
      }

      res.json(updated);
    } catch (error) {
      console.error("Error updating quadro:", error);
      res.status(500).json({ error: "Failed to update quadro" });
    }
  });

  app.delete('/api/quadros/delete/:id', async (req: any, res) => {
    try {
      const { id } = req.params;

      const deleted = await storage.deleteQuadro(id, DEFAULT_USER_ID);
      
      if (!deleted) {
        return res.status(404).json({ error: "Quadro not found" });
      }

      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting quadro:", error);
      res.status(500).json({ error: "Failed to delete quadro" });
    }
  });

  app.get('/api/tarefas/card/:quadroId', async (req: any, res) => {
    try {
      const { quadroId } = req.params;
      const tarefas = await storage.getTarefasByQuadro(quadroId, DEFAULT_USER_ID);
      res.json(tarefas);
    } catch (error) {
      console.error("Error fetching tarefas:", error);
      res.status(500).json({ error: "Failed to fetch tarefas" });
    }
  });

  app.post('/api/tarefas/new', async (req: any, res) => {
    try {
      const { description, quadroId } = req.body;

      if (!description || !quadroId) {
        return res.status(400).json({ error: "Description and quadroId are required" });
      }

      const newTarefa = await storage.createTarefa({
        description,
        quadroId,
      }, DEFAULT_USER_ID);
      
      if (!newTarefa) {
        return res.status(404).json({ error: "Quadro not found or access denied" });
      }
      
      res.json(newTarefa);
    } catch (error) {
      console.error("Error creating tarefa:", error);
      res.status(500).json({ error: "Failed to create tarefa" });
    }
  });

  app.post('/api/tarefas/update/:id', async (req: any, res) => {
    try {
      const { id } = req.params;
      const { description } = req.body;

      if (!description) {
        return res.status(400).json({ error: "Description is required" });
      }

      const updated = await storage.updateTarefa(id, description, DEFAULT_USER_ID);
      
      if (!updated) {
        return res.status(404).json({ error: "Tarefa not found or access denied" });
      }

      res.json(updated);
    } catch (error) {
      console.error("Error updating tarefa:", error);
      res.status(500).json({ error: "Failed to update tarefa" });
    }
  });

  app.delete('/api/tarefas/delete/:id', async (req: any, res) => {
    try {
      const { id } = req.params;

      const deleted = await storage.deleteTarefa(id, DEFAULT_USER_ID);
      
      if (!deleted) {
        return res.status(404).json({ error: "Tarefa not found or access denied" });
      }

      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting tarefa:", error);
      res.status(500).json({ error: "Failed to delete tarefa" });
    }
  });

  app.post('/api/tarefas/change/:id', async (req: any, res) => {
    try {
      const { id } = req.params;
      const { quadroId } = req.body;

      if (!quadroId) {
        return res.status(400).json({ error: "quadroId is required" });
      }

      const updated = await storage.changeTarefaQuadro(id, quadroId, DEFAULT_USER_ID);
      
      if (!updated) {
        return res.status(404).json({ error: "Tarefa not found or access denied" });
      }

      res.json(updated);
    } catch (error) {
      console.error("Error changing tarefa quadro:", error);
      res.status(500).json({ error: "Failed to change tarefa quadro" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
