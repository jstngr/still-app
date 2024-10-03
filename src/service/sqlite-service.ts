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
  blubb = 'test1';

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
      CREATE TABLE IF NOT EXISTS settings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        key TEXT NOT NULL,
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
   * Insert/Manipulate data into the database.
   * @param query - Query to run
   * @returns {Promise<void>}
   */
  async run(query: string): Promise<void> {
    if (!this.db) return;

    try {
      await this.db.run(query);
      console.log(`Query run: ${query}`);
    } catch (err) {
      console.error(`Error running: ${query}`);
    }
  }

  /**
   * Run query to load data
   * @returns {Promise<any[]>}
   */
  async query<IResult>(query: string): Promise<IResult | null> {
    if (!this.db) return null;
    try {
      const result = (await this.db.query(query)) as IResult;
      return result;
    } catch (err) {
      console.error('Error loading items:', err);
      return null;
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
