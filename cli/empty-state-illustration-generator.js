import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'fs';
import chalk from 'chalk';
import { cleanDir } from './cleanDir.js';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const imagePath = path.join(__dirname, '../components/empty-state/images');
const outputRoot = path.join(__dirname, '../generated');
const outputPath = path.join(outputRoot, 'empty-state');

function createLoader(svgs) {

	let template = '// auto-generated\n' +
		'export function loadSvg(illustration) {\n' +
		'\tswitch (illustration) {\n';
	svgs.forEach((name) => {
		template += `\t\tcase '${name}':
			return import(/* webpackChunkName: "illustration-${name}" */'./${name}.js');\n`;
	});

	template += '\t}\n' +
		'\treturn undefined;\n' +
		'}\n';
	const filePath = path.join(outputPath, 'presetIllustrationLoader.js');

	writeFileSync(filePath, template);

}

function getSvgs() {

	const files = readdirSync(imagePath);

	const svgs = files
		.filter((file) => {
			return (path.extname(file) === '.svg');
		}).map((file) => {
			return file.substring(0, file.length - 4);
		});
	return svgs;

}

function createSvgs(svgs) {

	svgs.forEach((name) => {
		const sourcePath = path.join(imagePath, `${name}.svg`);
		const destPath = path.join(outputPath, `${name}.js`);

		const data = readFileSync(sourcePath);
		/* eslint-disable-next-line prefer-template */
		const output = '// auto-generated\n' + 'export const val = `' + data + '`;\n';

		writeFileSync(destPath, output);
	});

}

function createCatalogue(svgs) {

	let output = '# Preset Empty State Illustration Catalogue\n\n';

	const numCols = 1;
	const numPerCol = Math.ceil(svgs.length / numCols);

	for (let c = 0; c < numCols; c++) {
		output += '| Illustration | Name |';
		if (c === numCols - 1) {
			output += '\n';
		} else {
			output += ' ';
		}
	}
	for (let d = 0; d < numCols; d++) {
		output += '| :---: | :--- |';
		if (d === numCols - 1) {
			output += '\n';
		} else {
			output += ' --- ';
		}
	}

	for (let i = 0; i < numPerCol; i++) {

		for (let j = 0; j < numCols; j++) {

			const index = i + j * numPerCol;
			if (index > svgs.length - 1) {
				output += '| &nbsp; | &nbsp; |';
			} else {
				const illustrationName = svgs[index];
				output += `| ![](https://raw.githubusercontent.com/BrightspaceUI/core/main/components/empty-state/images/${illustrationName}.svg?sanitize=true) | ${illustrationName} |`;
			}

			if (j === numCols - 1) {
				output += '\n';
			} else {
				output += ' ';
			}

		}

	}

	output += '\n';

	const outputPath = path.join(__dirname, '../components/empty-state/catalogue.md');
	writeFileSync(outputPath, output);

}

function generate() {

	console.log(chalk.yellow('Generating illustrations...'));
	console.group();

	console.log(chalk.blue('Clearing output directory...'));
	if (!existsSync(outputRoot)) {
		mkdirSync(outputRoot, { recursive: true });
	}
	cleanDir(outputPath);
	mkdirSync(outputPath, { recursive: true });

	const svgs = getSvgs();
	console.log(chalk.blue('Found SVGs, generating output...'));

	createCatalogue(svgs);
	console.log(chalk.blue('"catalogue.md" generated.'));

	createLoader(svgs);
	console.log(chalk.blue('"presetIconLoader.js" generated.'));

	createSvgs(svgs);
	console.groupEnd();
	console.log(chalk.green('SVG imports generated.'));
}

try {
	generate();
	process.exit(0);
} catch (err) {
	console.error(chalk.red(err));
	console.groupEnd();
	process.exit(1);
}
