import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

export default function handler(req, res) {
  try {
    const filePath = path.join(process.cwd(), 'public', 'nifty50.csv');
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
    });

    const symbols = records.map(record => ({
      symbol: `${record.Symbol}.NS`,
      name: record.Company
    }));

    res.status(200).json(symbols);
  } catch (error) {
    console.error('Error reading symbols:', error);
    res.status(500).json({ error: 'Failed to load symbols' });
  }
}
