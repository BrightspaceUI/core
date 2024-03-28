import chalk from 'chalk';
import { fileURLToPath } from 'url';
import path from 'path';
import { readFile } from 'fs/promises';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const customElementsPath = path.join(__dirname, '../custom-elements.json');

function validateTag(tag) {

	// assume an element with no description is to be ignored
	if (!tag.description) {
		return 0;
	}

	let errors = 0;

	tag.attributes?.forEach(a => {
		if (!a.description) {
			console.log(`Attribute "${a.name}" on tag "${tag.name}" is missing a description.`);
			errors++;
		}
	});

	tag.events?.forEach(e => {
		if (e.name !== 'Internal event' && !e.description) {
			console.log(`Event "${e.name}" on tag "${tag.name}" is missing a description.`);
			errors++;
		}
	});

	return errors;

}

async function exec() {

	const customElementsContent = await readFile(customElementsPath, { encoding: 'utf8' });
	const customElements = JSON.parse(customElementsContent);

	console.log(chalk.blue('Validating custom-elements.json...'));
	console.group();

	let errors = 0;
	customElements.tags.forEach(tag => {
		errors += validateTag(tag);
	});

	console.groupEnd();

	if (errors > 0) {
		console.log(chalk.red('Validation failed.'));
		return 1;
	}

	console.log(chalk.green('Success!'));
	return 0;

}

exec()
	.then((success) => process.exitCode = success)
	.catch((err) => {
		console.error(err);
		process.exitCode = 1;
	});