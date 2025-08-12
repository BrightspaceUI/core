import { existsSync, mkdirSync, readdirSync, readFileSync, unlinkSync, writeFileSync } from 'fs';
import chalk from 'chalk';
import path from 'path';

const __dirname = process.cwd();
const outputRoot = path.join(__dirname, '/generated');
const flagsPath = path.join(outputRoot, 'flags.js');

function getFlags(directoryPath, fileName, recursive) {
	const files = readdirSync(directoryPath, { recursive: recursive, withFileTypes: true });
	const flagFiles = files.filter(file => file.name === 'flags.json');

	return flagFiles.reduce((acc, file ) => {
		const filePath = path.join(file.path, file.name);
		console.log(chalk.blue(filePath));
		const data = readFileSync(filePath, { encoding: 'utf8' });
		const flags = JSON.parse(data);
		return [...acc, ...flags]
	}, []);
}

function generate() {

	console.log(chalk.yellow('Generating flags...'));
	console.group();

	console.log(chalk.blue('Removing existing "flags.js"'));
	if (existsSync(flagsPath)) unlinkSync(flagsPath);
	if (!existsSync(outputRoot)) mkdirSync(outputRoot);

	console.log(chalk.blue('Searching for flags files...'));
	console.group();
	const flags = [
		...getFlags(path.join(__dirname, '/'), 'flags.json', false),
		...getFlags(path.join(__dirname, '/node_modules/@brightspace-ui'), 'flags.json', true)
	].map(flag => {
		if (flag.defaultValue?.toLowerCase?.() === 'true') flag.defaultValue = true;
		else if (flag.defaultValue?.toLowerCase?.() === 'false') flag.defaultValue = false;
		return flag;
	});
	console.groupEnd();

	const output = `export const flags = ${JSON.stringify(flags, null, '\t')};`;
	writeFileSync(flagsPath, output);

	console.groupEnd();
	console.log(chalk.green(`"flags.js" (${flags.length}) generated.`));
}

try {
	generate();
	process.exit(0);
} catch (err) {
	console.error(chalk.red(err));
	console.groupEnd();
	process.exit(1);
}
