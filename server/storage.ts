import {
  users,
  quadros,
  tarefas,
  type User,
  type UpsertUser,
  type Quadro,
  type InsertQuadro,
  type Tarefa,
  type InsertTarefa,
} from "../shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  getQuadros(userId: string): Promise<Quadro[]>;
  createQuadro(quadro: InsertQuadro): Promise<Quadro>;
  updateQuadro(id: string, userId: string, description: string): Promise<Quadro | undefined>;
  deleteQuadro(id: string, userId: string): Promise<boolean>;
  
  getTarefasByQuadro(quadroId: string, userId: string): Promise<Tarefa[]>;
  createTarefa(tarefa: InsertTarefa, userId: string): Promise<Tarefa | undefined>;
  updateTarefa(id: string, description: string, userId: string): Promise<Tarefa | undefined>;
  deleteTarefa(id: string, userId: string): Promise<boolean>;
  changeTarefaQuadro(id: string, quadroId: string, userId: string): Promise<Tarefa | undefined>;
}

export class DatabaseStorage implements IStorage {
  async ensureDefaultUser(): Promise<void> {
    const defaultUserId = "default-user";
    const existingUser = await this.getUser(defaultUserId);
    if (!existingUser) {
      await this.upsertUser({
        id: defaultUserId,
        email: "default@example.com",
        firstName: "Default",
        lastName: "User",
      });
    }
  }

  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async getQuadros(userId: string): Promise<Quadro[]> {
    return await db.select().from(quadros).where(eq(quadros.userId, userId));
  }

  async createQuadro(quadro: InsertQuadro): Promise<Quadro> {
    const [newQuadro] = await db.insert(quadros).values(quadro).returning();
    return newQuadro;
  }

  async updateQuadro(id: string, userId: string, description: string): Promise<Quadro | undefined> {
    const [updated] = await db
      .update(quadros)
      .set({ description, updatedAt: new Date() })
      .where(and(eq(quadros.id, id), eq(quadros.userId, userId)))
      .returning();
    return updated;
  }

  async deleteQuadro(id: string, userId: string): Promise<boolean> {
    const result = await db
      .delete(quadros)
      .where(and(eq(quadros.id, id), eq(quadros.userId, userId)))
      .returning();
    return result.length > 0;
  }

  async getTarefasByQuadro(quadroId: string, userId: string): Promise<Tarefa[]> {
    const quadro = await db.select().from(quadros).where(and(eq(quadros.id, quadroId), eq(quadros.userId, userId))).limit(1);
    if (quadro.length === 0) return [];
    return await db.select().from(tarefas).where(eq(tarefas.quadroId, quadroId));
  }

  async createTarefa(tarefa: InsertTarefa, userId: string): Promise<Tarefa | undefined> {
    const quadro = await db.select().from(quadros).where(and(eq(quadros.id, tarefa.quadroId), eq(quadros.userId, userId))).limit(1);
    if (quadro.length === 0) return undefined;
    const [newTarefa] = await db.insert(tarefas).values(tarefa).returning();
    return newTarefa;
  }

  async updateTarefa(id: string, description: string, userId: string): Promise<Tarefa | undefined> {
    const tarefa = await db.select().from(tarefas).where(eq(tarefas.id, id)).limit(1);
    if (tarefa.length === 0) return undefined;
    
    const quadro = await db.select().from(quadros).where(and(eq(quadros.id, tarefa[0].quadroId), eq(quadros.userId, userId))).limit(1);
    if (quadro.length === 0) return undefined;
    
    const [updated] = await db
      .update(tarefas)
      .set({ description, updatedAt: new Date() })
      .where(eq(tarefas.id, id))
      .returning();
    return updated;
  }

  async deleteTarefa(id: string, userId: string): Promise<boolean> {
    const tarefa = await db.select().from(tarefas).where(eq(tarefas.id, id)).limit(1);
    if (tarefa.length === 0) return false;
    
    const quadro = await db.select().from(quadros).where(and(eq(quadros.id, tarefa[0].quadroId), eq(quadros.userId, userId))).limit(1);
    if (quadro.length === 0) return false;
    
    const result = await db.delete(tarefas).where(eq(tarefas.id, id)).returning();
    return result.length > 0;
  }

  async changeTarefaQuadro(id: string, quadroId: string, userId: string): Promise<Tarefa | undefined> {
    const tarefa = await db.select().from(tarefas).where(eq(tarefas.id, id)).limit(1);
    if (tarefa.length === 0) return undefined;
    
    const oldQuadro = await db.select().from(quadros).where(and(eq(quadros.id, tarefa[0].quadroId), eq(quadros.userId, userId))).limit(1);
    if (oldQuadro.length === 0) return undefined;
    
    const newQuadro = await db.select().from(quadros).where(and(eq(quadros.id, quadroId), eq(quadros.userId, userId))).limit(1);
    if (newQuadro.length === 0) return undefined;
    
    const [updated] = await db
      .update(tarefas)
      .set({ quadroId, updatedAt: new Date() })
      .where(eq(tarefas.id, id))
      .returning();
    return updated;
  }
}

export const storage = new DatabaseStorage();
