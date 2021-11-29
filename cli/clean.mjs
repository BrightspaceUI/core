import chalk from 'chalk';
import { cleanDir } from './cleanDir.mjs';
import path from 'path';

const __dirname = path.dirname(new URL(import.meta.url).pathname);
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
