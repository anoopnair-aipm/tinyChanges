import { query } from '../database/connection';
import { v4 as uuidv4 } from 'uuid';

export interface Reward {
  id: string;
  parentId: string;
  name: string;
  description?: string;
  pointsValue: number;
  icon?: string;
  color?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface RewardBalance {
  id: string;
  childId: string;
  rewardId: string;
  balance: number;
  createdAt: Date;
  updatedAt: Date;
}

export class RewardModel {
  static async create(
    parentId: string,
    name: string,
    pointsValue: number,
    description?: string,
    icon?: string,
    color?: string
  ): Promise<Reward> {
    const id = uuidv4();
    const now = new Date();

    const result = await query(
      `INSERT INTO rewards (id, parent_id, name, description, points_value, icon, color, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [id, parentId, name, description || null, pointsValue, icon || null, color || null, now, now]
    );

    return this.mapRow(result.rows[0]);
  }

  static async findById(id: string): Promise<Reward | null> {
    const result = await query('SELECT * FROM rewards WHERE id = $1', [id]);
    return result.rows.length ? this.mapRow(result.rows[0]) : null;
  }

  static async findByParentId(parentId: string): Promise<Reward[]> {
    const result = await query(
      'SELECT * FROM rewards WHERE parent_id = $1 ORDER BY created_at DESC',
      [parentId]
    );
    return result.rows.map(row => this.mapRow(row));
  }

  static async update(id: string, updates: Partial<Reward>): Promise<Reward> {
    const now = new Date();
    const fields = [];
    const values = [];
    let paramCount = 1;

    if (updates.name !== undefined) {
      fields.push(`name = $${paramCount++}`);
      values.push(updates.name);
    }
    if (updates.description !== undefined) {
      fields.push(`description = $${paramCount++}`);
      values.push(updates.description);
    }
    if (updates.pointsValue !== undefined) {
      fields.push(`points_value = $${paramCount++}`);
      values.push(updates.pointsValue);
    }
    if (updates.icon !== undefined) {
      fields.push(`icon = $${paramCount++}`);
      values.push(updates.icon);
    }
    if (updates.color !== undefined) {
      fields.push(`color = $${paramCount++}`);
      values.push(updates.color);
    }

    fields.push(`updated_at = $${paramCount++}`);
    values.push(now);
    values.push(id);

    const result = await query(
      `UPDATE rewards SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    );

    return this.mapRow(result.rows[0]);
  }

  static async delete(id: string): Promise<void> {
    await query('DELETE FROM rewards WHERE id = $1', [id]);
  }

  static async getBalance(childId: string, rewardId: string): Promise<number> {
    const result = await query(
      'SELECT balance FROM reward_balances WHERE child_id = $1 AND reward_id = $2',
      [childId, rewardId]
    );
    return result.rows.length ? result.rows[0].balance : 0;
  }

  static async addBalance(childId: string, rewardId: string, amount: number): Promise<void> {
    const now = new Date();
    await query(
      `INSERT INTO reward_balances (id, child_id, reward_id, balance, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (child_id, reward_id) DO UPDATE
       SET balance = reward_balances.balance + $4, updated_at = $6`,
      [uuidv4(), childId, rewardId, amount, now, now]
    );
  }

  static async subtractBalance(childId: string, rewardId: string, amount: number): Promise<number> {
    const result = await query(
      `UPDATE reward_balances
       SET balance = balance - $1, updated_at = $2
       WHERE child_id = $3 AND reward_id = $4
       RETURNING balance`,
      [amount, new Date(), childId, rewardId]
    );

    if (result.rows.length === 0) {
      throw new Error('Reward balance not found');
    }

    return result.rows[0].balance;
  }

  static async getChildBalances(childId: string): Promise<any[]> {
    const result = await query(
      `SELECT rb.*, r.name, r.description, r.icon, r.color, r.points_value
       FROM reward_balances rb
       JOIN rewards r ON rb.reward_id = r.id
       WHERE rb.child_id = $1 AND rb.balance > 0
       ORDER BY r.name`,
      [childId]
    );
    return result.rows;
  }

  private static mapRow(row: any): Reward {
    return {
      id: row.id,
      parentId: row.parent_id,
      name: row.name,
      description: row.description,
      pointsValue: row.points_value,
      icon: row.icon,
      color: row.color,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    };
  }
}
