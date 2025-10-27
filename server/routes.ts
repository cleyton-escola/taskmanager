import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";

export async function registerRoutes(app: Express): Promise<Server> {
  await setupAuth(app);

  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  app.get('/api/quadros', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const userQuadros = await storage.getQuadros(userId);
      res.json(userQuadros);
    } catch (error) {
      console.error("Error fetching quadros:", error);
      res.status(500).json({ error: "Failed to fetch quadros" });
    }
  });

  app.post('/api/quadros/new', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { description } = req.body;
      
      if (!description) {
        return res.status(400).json({ error: "Description is required" });
      }

      const newQuadro = await storage.createQuadro({
        userId,
        description,
      });
      
      res.json(newQuadro);
    } catch (error) {
      console.error("Error creating quadro:", error);
      res.status(500).json({ error: "Failed to create quadro" });
    }
  });

  app.post('/api/quadros/update/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { id } = req.params;
      const { description } = req.body;

      if (!description) {
        return res.status(400).json({ error: "Description is required" });
      }

      const updated = await storage.updateQuadro(id, userId, description);
      
      if (!updated) {
        return res.status(404).json({ error: "Quadro not found" });
      }

      res.json(updated);
    } catch (error) {
      console.error("Error updating quadro:", error);
      res.status(500).json({ error: "Failed to update quadro" });
    }
  });

  app.delete('/api/quadros/delete/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { id } = req.params;

      const deleted = await storage.deleteQuadro(id, userId);
      
      if (!deleted) {
        return res.status(404).json({ error: "Quadro not found" });
      }

      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting quadro:", error);
      res.status(500).json({ error: "Failed to delete quadro" });
    }
  });

  app.get('/api/tarefas/card/:quadroId', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { quadroId } = req.params;
      const tarefas = await storage.getTarefasByQuadro(quadroId, userId);
      res.json(tarefas);
    } catch (error) {
      console.error("Error fetching tarefas:", error);
      res.status(500).json({ error: "Failed to fetch tarefas" });
    }
  });

  app.post('/api/tarefas/new', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { description, quadroId } = req.body;

      if (!description || !quadroId) {
        return res.status(400).json({ error: "Description and quadroId are required" });
      }

      const newTarefa = await storage.createTarefa({
        description,
        quadroId,
      }, userId);
      
      if (!newTarefa) {
        return res.status(404).json({ error: "Quadro not found or access denied" });
      }
      
      res.json(newTarefa);
    } catch (error) {
      console.error("Error creating tarefa:", error);
      res.status(500).json({ error: "Failed to create tarefa" });
    }
  });

  app.post('/api/tarefas/update/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { id } = req.params;
      const { description } = req.body;

      if (!description) {
        return res.status(400).json({ error: "Description is required" });
      }

      const updated = await storage.updateTarefa(id, description, userId);
      
      if (!updated) {
        return res.status(404).json({ error: "Tarefa not found or access denied" });
      }

      res.json(updated);
    } catch (error) {
      console.error("Error updating tarefa:", error);
      res.status(500).json({ error: "Failed to update tarefa" });
    }
  });

  app.delete('/api/tarefas/delete/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { id } = req.params;

      const deleted = await storage.deleteTarefa(id, userId);
      
      if (!deleted) {
        return res.status(404).json({ error: "Tarefa not found or access denied" });
      }

      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting tarefa:", error);
      res.status(500).json({ error: "Failed to delete tarefa" });
    }
  });

  app.post('/api/tarefas/change/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { id } = req.params;
      const { quadroId } = req.body;

      if (!quadroId) {
        return res.status(400).json({ error: "quadroId is required" });
      }

      const updated = await storage.changeTarefaQuadro(id, quadroId, userId);
      
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
