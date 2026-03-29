/**
 * Database Adapter Interface
 *
 * This module defines the adapter pattern for database operations.
 * The default implementation uses Prisma, but you can swap it with
 * Drizzle, Supabase, or any other ORM/client.
 *
 * To switch adapters:
 * 1. Install your preferred ORM
 * 2. Implement the DbAdapter interface
 * 3. Update the export in this file
 */

export interface DbAdapter {
  /** Check if the database connection is alive */
  healthCheck(): Promise<boolean>

  /** Disconnect from the database */
  disconnect(): Promise<void>
}

// ---- Prisma Adapter (Default) ----
import { db } from './db'

class PrismaDbAdapter implements DbAdapter {
  async healthCheck(): Promise<boolean> {
    try {
      await db.$queryRaw`SELECT 1`
      return true
    } catch {
      return false
    }
  }

  async disconnect(): Promise<void> {
    await db.$disconnect()
  }
}

// ---- None Adapter (for static sites) ----
class NoneDbAdapter implements DbAdapter {
  async healthCheck(): Promise<boolean> {
    return true // Always healthy - no DB needed
  }

  async disconnect(): Promise<void> {
    // No-op
  }
}

/**
 * Active database adapter.
 * Change this to switch between Prisma, Drizzle, Supabase, or None.
 */
export const dbAdapter: DbAdapter = process.env.DATABASE_URL
  ? new PrismaDbAdapter()
  : new NoneDbAdapter()
