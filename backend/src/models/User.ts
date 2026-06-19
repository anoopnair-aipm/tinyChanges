import { query } from '../database/connection';
import { v4 as uuidv4 } from 'uuid';

export interface User {
  id: string;
  googleId: string;
  email: string;
  name: string;
  profilePictureUrl?: string;
  isChild: boolean;
  parentId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class UserModel {
  static async create(googleId: string, email: string, name: string, profilePictureUrl?: string, isChild = false, parentId?: string): Promise<User> {
    const id = uuidv4();
    const now = new Date();

    const result = await query(
      `INSERT INTO users (id, google_id, email, name, profile_picture_url, is_child, parent_id, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [id, googleId, email, name, profilePictureUrl || null, isChild, parentId || null, now, now]
    );

    return this.mapRow(result.rows[0]);
  }

  static async findByGoogleId(googleId: string): Promise<User | null> {
    const result = await query('SELECT * FROM users WHERE google_id = $1', [googleId]);
    return result.rows.length ? this.mapRow(result.rows[0]) : null;
  }

  static async findById(id: string): Promise<User | null> {
    const result = await query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows.length ? this.mapRow(result.rows[0]) : null;
  }

  static async findByEmail(email: string): Promise<User | null> {
    const result = await query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows.length ? this.mapRow(result.rows[0]) : null;
  }

  static async findChildren(parentId: string): Promise<User[]> {
    const result = await query(
      'SELECT * FROM users WHERE parent_id = $1 AND is_child = true ORDER BY name',
      [parentId]
    );
    return result.rows.map(row => this.mapRow(row));
  }

  static async update(id: string, updates: Partial<User>): Promise<User> {
    const now = new Date();
    const fields = [];
    const values = [];
    let paramCount = 1;

    if (updates.name !== undefined) {
      fields.push(`name = $${paramCount++}`);
      values.push(updates.name);
    }
    if (updates.profilePictureUrl !== undefined) {
      fields.push(`profile_picture_url = $${paramCount++}`);
      values.push(updates.profilePictureUrl);
    }

    fields.push(`updated_at = $${paramCount++}`);
    values.push(now);
    values.push(id);

    const result = await query(
      `UPDATE users SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    );

    return this.mapRow(result.rows[0]);
  }

  static async delete(id: string): Promise<void> {
    await query('DELETE FROM users WHERE id = $1', [id]);
  }

  private static mapRow(row: any): User {
    return {
      id: row.id,
      googleId: row.google_id,
      email: row.email,
      name: row.name,
      profilePictureUrl: row.profile_picture_url,
      isChild: row.is_child,
      parentId: row.parent_id,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    };
  }
}
