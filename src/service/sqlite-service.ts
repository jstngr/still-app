import {
  SQLiteDBConnection,
  SQLiteConnection,
  capSQLiteSet,
  CapacitorSQLite,
} from '@capacitor-community/sqlite';
import { Capacitor } from '@capacitor/core';

class SQLiteService {
  sqlite: SQLiteConnection | null = null;
  db: SQLiteDBConnection | null = null;
  dbName = 'still-app-database';

  constructor() {
    const platform = Capacitor.getPlatform();
    if (platform === 'ios' || platform === 'android') {
      this.sqlite = new SQLiteConnection(CapacitorSQLite);
    } else if (platform === 'web') {
      this.sqlite = new SQLiteConnection(CapacitorSQLite);
    }
  }

  /**
   * Initialize and open a connection to the SQLite database.
   * @returns {Promise<void>}
   */
  async initDb(): Promise<void> {
    try {
      if (!this.sqlite) throw new Error('SQLite plugin is not initialized');

      // Open the database connection
      this.db = await this.sqlite.createConnection(this.dbName, false, 'no-encryption', 1, false);
      if (!this.db) throw new Error('Failed to create the SQLite connection');

      await this.db.open();
      console.log('Database connection opened');

      await this.createTable(); // Create the table
    } catch (err) {
      console.error('Failed to initialize the database:', err);
    }
  }

  /**
   * Create a table if it does not exist.
   * @returns {Promise<void>}
   */
  async createTable(): Promise<void> {
    if (!this.db) return;

    const query = `
      CREATE TABLE IF NOT EXISTS items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        value TEXT NOT NULL
      );
    `;
    try {
      await this.db.execute(query);
      console.log('Table created or already exists');
    } catch (err) {
      console.error('Error creating table:', err);
    }
  }

  /**
   * Insert data into the database.
   * @param name - Name of the item
   * @param value - Value of the item
   * @returns {Promise<void>}
   */
  async insertItem(name: string, value: string): Promise<void> {
    if (!this.db) return;

    const query = `INSERT INTO items (name, value) VALUES (?, ?);`;
    try {
      await this.db.run(query, [name, value]);
      console.log(`Inserted: ${name}, ${value}`);
    } catch (err) {
      console.error('Error inserting item:', err);
    }
  }

  /**
   * Load all items from the database.
   * @returns {Promise<any[]>}
   */
  async loadItems(): Promise<any[]> {
    if (!this.db) return [];

    const query = `SELECT * FROM items;`;
    try {
      const result = await this.db.query(query);
      return result.values ? result.values : [];
    } catch (err) {
      console.error('Error loading items:', err);
      return [];
    }
  }

  /**
   * Close the SQLite database connection.
   * @returns {Promise<void>}
   */
  async closeDb(): Promise<void> {
    if (this.db) {
      await this.sqlite?.closeConnection(this.dbName, false);
      this.db = null;
      console.log('Database connection closed');
    }
  }
}

export default new SQLiteService();