export interface ParsedTransaction {
  date: string;
  description: string;
  amount: number;
  rawLine: string;
}

export interface CSVParseResult {
  success: boolean;
  transactions: ParsedTransaction[];
  errors: string[];
  totalAmount: number;
}

export class CSVParser {
  parse(csvContent: string): CSVParseResult {
    const lines = csvContent
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    const transactions: ParsedTransaction[] = [];
    const errors: string[] = [];

    lines.forEach((line, index) => {
      try {
        const parsed = this.parseLine(line);
        if (parsed) {
          transactions.push(parsed);
        }
      } catch (error) {
        errors.push(
          `Line ${index + 1}: ${error instanceof Error ? error.message : 'Invalid format'}`
        );
      }
    });

    const totalAmount = Number(transactions.reduce((sum, t) => sum + t.amount, 0).toFixed(2));

    return {
      success: errors.length === 0,
      transactions,
      errors,
      totalAmount
    };
  }

  private parseLine(line: string): ParsedTransaction | null {
    const parts = line.split(';');

    if (parts.length < 2 || !parts[0]) {
      throw new Error('Invalid format: missing semicolon separator');
    }

    const dateStr = parts[0].trim();
    const rest = parts.slice(1).join(';');

    const lastSemicolon = rest.lastIndexOf(';');
    if (lastSemicolon === -1) {
      throw new Error('Invalid format: missing amount');
    }

    const description = rest.substring(0, lastSemicolon).trim();
    const amountStr = rest.substring(lastSemicolon + 1).trim();

    const date = this.parseDate(dateStr);
    const amount = this.parseAmount(amountStr);

    if (!description) {
      throw new Error('Description is empty');
    }

    return {
      date,
      description,
      amount,
      rawLine: line
    };
  }

  private parseDate(dateStr: string): string {
    const match = dateStr.match(/^(\d{2})\/(\d{2})$/);
    if (!match || !match[1] || !match[2]) {
      throw new Error(`Invalid date format: ${dateStr}. Expected DD/MM`);
    }

    const day = match[1];
    const month = match[2];
    const currentYear = new Date().getFullYear();

    return `${currentYear}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }

  private parseAmount(amountStr: string): number {
    const cleaned = amountStr.replace(/\./g, '').replace(',', '.');
    const amount = parseFloat(cleaned);

    if (isNaN(amount)) {
      throw new Error(`Invalid amount: ${amountStr}`);
    }

    return Number(amount.toFixed(2));
  }

  validateFile(file: File): { valid: boolean; error?: string } {
    if (!file) {
      return { valid: false, error: 'No file selected' };
    }

    if (file.type && !file.type.includes('text') && !file.type.includes('csv')) {
      return { valid: false, error: 'File must be a CSV or text file' };
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return { valid: false, error: 'File size must be less than 5MB' };
    }

    return { valid: true };
  }

  async readFile(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        const content = e.target?.result as string;
        resolve(content);
      };

      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };

      reader.readAsText(file, 'UTF-8');
    });
  }
}
