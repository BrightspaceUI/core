import chalk from 'chalk';
import { cleanDir } from './cleanDir.js';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outputRoot = path.join(__dirname, '../generated');

try {
	console.log(chalk.yellow('Cleaning all generated files...'));
	cleanDir(outputRoot);
	console.log(chalk.green('Generated files cleaned.'));
	process.exit(0);
} catch (err) {
	console.error(chalk.red(err));
	process.exit(1);
}
