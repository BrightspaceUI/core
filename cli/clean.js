const chalk = require('chalk'),
	cleanDir = require('./cleanDir.js'),
	path = require('path');
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
