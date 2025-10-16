import fs from 'fs/promises';
import path from 'path';

const DB_PATH = path.resolve(process.cwd(), 'db.json');

interface DbData {
  ticketLinks: any[];
  configurations: any[];
}

export async function readDb(): Promise<DbData> {
  try {
    const data = await fs.readFile(DB_PATH, 'utf-8');
    const parsedData = JSON.parse(data);
    // Ensure ticketLinks and configurations are arrays
    return {
      ticketLinks: Array.isArray(parsedData.ticketLinks) ? parsedData.ticketLinks : [],
      configurations: Array.isArray(parsedData.configurations) ? parsedData.configurations : [],
    };
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      // If db.json doesn't exist, return initial structure
      return { ticketLinks: [], configurations: [] };
    }
    throw error;
  }
}

export async function writeDb(data: DbData): Promise<void> {
  await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
}
