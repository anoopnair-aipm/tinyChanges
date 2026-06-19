import { query } from '@/database/connection';
import { v4 as uuidv4 } from 'uuid';

export interface Task {
  id: string;
  parentId: string;
  childId: string;
  title: string;
  description?: string;
  dueDate: Date;
  rewardId?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'completed' | 'expired';
  createdAt: Date;
  updatedAt: Date;
}

export class TaskModel {
  static async create(
    parentId: string,
    childId: string,
    title: string,
    dueDate: Date,
    description?: string,
    rewardId?: string,
    priority: 'low' | 'medium' | 'high' = 'medium'
  ): Promise<Task> {
    const id = uuidv4();
    const now = new Date();

    const result = await query(
      `INSERT INTO tasks (id, parent_id, child_id, title, description, due_date, reward_id, priority, status, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING *`,
      [id, parentId, childId, title, description || null, dueDate, rewardId || null, priority, 'pending', now, now]
    );

    return this.mapRow(result.rows[0]);
  }

  static async findById(id: string): Promise<Task | null> {
    const result = await query('SELECT * FROM tasks WHERE id = $1', [id]);
    return result.rows.length ? this.mapRow(result.rows[0]) : null;
  }

  static async findByChildId(childId: string, status?: string): Promise<Task[]> {
    let sql = 'SELECT * FROM tasks WHERE child_id = $1';
    const params: any[] = [childId];

    if (status) {
      sql += ' AND status = $2';
      params.push(status);
    }

    sql += ' ORDER BY due_date ASC';

    const result = await query(sql, params);
    return result.rows.map(row => this.mapRow(row));
  }

  static async findByParentId(parentId: string): Promise<Task[]> {
    const result = await query(
      'SELECT * FROM tasks WHERE parent_id = $1 ORDER BY due_date ASC',
      [parentId]
    );
    return result.rows.map(row => this.mapRow(row));
  }

  static async update(id: string, updates: Partial<Task>): Promise<Task> {
    const now = new Date();
    const fields = [];
    const values = [];
    let paramCount = 1;

    if (updates.title !== undefined) {
      fields.push(`title = $${paramCount++}`);
      values.push(updates.title);
    }
    if (updates.description !== undefined) {
      fields.push(`description = $${paramCount++}`);
      values.push(updates.description);
    }
    if (updates.dueDate !== undefined) {
      fields.push(`due_date = $${paramCount++}`);
      values.push(updates.dueDate);
    }
    if (updates.priority !== undefined) {
      fields.push(`priority = $${paramCount++}`);
      values.push(updates.priority);
    }
    if (updates.status !== undefined) {
      fields.push(`status = $${paramCount++}`);
      values.push(updates.status);
    }

    fields.push(`updated_at = $${paramCount++}`);
    values.push(now);
    values.push(id);

    const result = await query(
      `UPDATE tasks SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    );

    return this.mapRow(result.rows[0]);
  }

  static async delete(id: string): Promise<void> {
    await query('DELETE FROM tasks WHERE id = $1', [id]);
  }

  static async markCompleted(taskId: string, childId: string, notes?: string): Promise<string> {
    const completionId = uuidv4();
    const completedAt = new Date();

    // Create completion record
    await query(
      `INSERT INTO task_completions (id, task_id, child_id, completed_at, notes, created_at)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [completionId, taskId, childId, completedAt, notes || null, completedAt]
    );

    // Update task status
    await query(
      `UPDATE tasks SET status = $1, updated_at = $2 WHERE id = $3`,
      ['completed', completedAt, taskId]
    );

    return completionId;
  }

  private static mapRow(row: any): Task {
    return {
      id: row.id,
      parentId: row.parent_id,
      childId: row.child_id,
      title: row.title,
      description: row.description,
      dueDate: new Date(row.due_date),
      rewardId: row.reward_id,
      priority: row.priority,
      status: row.status,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    };
  }
}
