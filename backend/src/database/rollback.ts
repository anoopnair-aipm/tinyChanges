import { query, closePool } from './connection';

async function rollback() {
  try {
    console.log('⚠️  Rolling back database schema...');

    // Drop tables in reverse order
    const tables = [
      'notifications',
      'reward_redemptions',
      'reward_balances',
      'task_completions',
      'rewards',
      'tasks',
      'users',
    ];

    for (const table of tables) {
      await query(`DROP TABLE IF EXISTS ${table} CASCADE`);
      console.log(`✓ Dropped table: ${table}`);
    }

    console.log('✅ Rollback completed');
  } catch (error) {
    console.error('❌ Rollback error:', error);
    process.exit(1);
  } finally {
    await closePool();
  }
}

rollback();
