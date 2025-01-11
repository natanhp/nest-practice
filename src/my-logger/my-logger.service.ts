import { ConsoleLogger, Injectable } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import { promises as fsPromises } from 'fs';

@Injectable()
export class MyLoggerService extends ConsoleLogger {
  async logToFile(entry: string) {
    const formattedEntry = `${Intl.DateTimeFormat('id-ID', { dateStyle: 'short', timeStyle: 'short', timeZone: 'Asia/Jakarta' }).format(new Date())}\t${entry}\n`;

    try {
      if (!fs.existsSync(path.join(__dirname, '..', '..', 'logs'))) {
        await fsPromises.mkdir(path.join(__dirname, '..', '..', 'logs'));
      }
      await fsPromises.appendFile(
        path.join(__dirname, '..', '..', 'logs', 'app.log'),
        formattedEntry,
      );
    } catch (e) {
      if (e instanceof Error) console.error(e.message);
    }
  }
  log(message: any, context?: string) {
    const entry = `${context}\t${message}`;

    this.logToFile(entry);

    super.log(message, context);
  }

  error(message: any, stackOrContext?: string) {
    const entry = `${stackOrContext}\t${message}`;

    this.logToFile(entry);

    super.error(message, stackOrContext);
  }
}
