// sqliteService.ts
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';

class SQLiteService {
  private static instance: SQLiteService;
  private sqliteConnection: SQLiteConnection | null = null;
  private readonly = false;
  private db: SQLiteDBConnection | null = null;

  private constructor() {
    this.sqliteConnection = new SQLiteConnection(CapacitorSQLite);
  }

  /**
   * Get the singleton instance of the SQLiteService.
   */
  public static getInstance(): SQLiteService {
    if (!SQLiteService.instance) {
      SQLiteService.instance = new SQLiteService();
    }
    return SQLiteService.instance;
  }

  /**
   * Get or create a database connection.
   * @param dbName - The name of the database.
   * @param readonly - Whether the connection should be readonly.
   * @returns The SQLiteDBConnection instance.
   */
  public async getConnection(
    dbName: string,
    readonly: boolean = false
  ): Promise<SQLiteDBConnection> {
    if (this.db) {
      console.log('Returning existing DB connection');
      return this.db;
    }

    if (!this.sqliteConnection) {
      throw new Error('SQLite plugin is not initialized');
    }

    await this.sqliteConnection.checkConnectionsConsistency();
    // Check if a connection exists
    const isConnected = await this.sqliteConnection.isConnection(dbName, readonly);
    if (isConnected.result) {
      console.log('Retrieving existing connection');
      this.db = await this.sqliteConnection.retrieveConnection(dbName, readonly);
    } else {
      console.log('Creating new connection');
      this.db = await this.sqliteConnection.createConnection(
        dbName,
        false,
        'no-encryption',
        1,
        readonly
      );
    }

    if (this.db) {
      await this.db.open(); // Open the connection
      console.log('Database connection opened');
    }

    return this.db;
  }

  /**
   * Close the database connection.
   */
  public async closeConnection(dbName: string): Promise<void> {
    if (this.sqliteConnection && this.db) {
      await this.sqliteConnection.closeConnection(dbName, this.readonly);
      this.db = null; // Reset the connection
      console.log('Database connection closed');
    }
  }
}

export default SQLiteService.getInstance();
