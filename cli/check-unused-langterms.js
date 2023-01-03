import { dirname, join, resolve } from 'path';
import { readdirSync, readFileSync, statSync } from 'fs';
import chalk from 'chalk';
import { fileURLToPath } from 'url';
import langTerms from '../lang/en.js';

const { green, yellow } = chalk;

const __filename = resolve(fileURLToPath(import.meta.url));
const __dirname = dirname(__filename);

const getJavaScriptFiles = (paths) => {
	if (!Array.isArray(paths)) {
		paths = [paths];
	}

	const files = [];

	for (const path of paths) {
		const pathStat = statSync(path);

		if (pathStat.isFile()) {
			const fullPath = resolve(path);

			files.push(fullPath);
		} else if (pathStat.isDirectory()) {
			for (const entry of readdirSync(path, { withFileTypes: true })) {
				const fullPath = join(path, entry.name);

				if (entry.isDirectory()) {
					files.push(...getJavaScriptFiles(fullPath));
				} else if (entry.isFile() && entry.name.endsWith('.js')) {
					files.push(fullPath);
				}
			}
		}
	}

	return files;
};

const files = getJavaScriptFiles(join(__dirname, '../src'));
const langTermsNotFound = [];

console.info('Check for unused langterms\n');

for (const langTerm of Object.keys(langTerms)) {
	let found = false;

	for (const file of files) {
		const fileContents = readFileSync(file);
		const regex = new RegExp(`['"]${langTerm}['"]`);

		found = regex.test(fileContents);

		if (found) {
			console.info(`${langTerm} ${green('✔')}`);

			break;
		}
	}

	if (!found) {
		langTermsNotFound.push([langTerm]);
		console.warn(`${langTerm} ${yellow('✖')}`);
	}
}

if (langTermsNotFound.length) {
	console.warn(yellow('\nIssues:'));
} else {
	console.info(green('\nNo issues found!'));
}

for (const langTermNotFound of langTermsNotFound) {
	console.warn(`  ${langTermNotFound} ${yellow('✖ (possibly not in use)')}`);
}
