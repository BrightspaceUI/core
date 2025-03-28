import { existsSync, lstatSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'fs';
import chalk from 'chalk';
import { cleanDir } from './cleanDir.js';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const imagePath = path.join(__dirname, '../components/icons/images');
const outputRoot = path.join(__dirname, '../generated');
const outputPath = path.join(outputRoot, 'icons');

function getSvgsInDir(dir) {

	const dirPath = path.join(imagePath, dir);

	if (!lstatSync(dirPath).isDirectory()) {
		return [];
	}

	const svgs = readdirSync(dirPath)
		.filter((file) => {
			return (path.extname(file) === '.svg');
		}).map((file) => {
			return file.substr(0, file.length - 4);
		});
	return svgs;

}

function getSvgs() {
	const svgs = [];
	const dirs = readdirSync(imagePath);
	dirs.forEach((dir) => {
		const newSvgs = getSvgsInDir(dir);
		if (newSvgs.length > 0) {
			svgs.push({
				name: dir,
				svgs: newSvgs
			});
		}
	});
	return svgs;
}

function createSvg(category, name) {

	const categoryPath = path.join(outputPath, category);
	const sourcePath = path.join(imagePath, category, `${name}.svg`);
	const destPath = path.join(outputPath, category, `${name}.js`);

	if (!existsSync(categoryPath)) {
		mkdirSync(categoryPath);
	}

	const data = readFileSync(sourcePath);
	const output = '// auto-generated\n' + 'export const val = `' + data + '`;\n';

	writeFileSync(destPath, output);

}

function createSvgs(categories) {
	categories.forEach((category) => {
		category.svgs.forEach((name) => {
			createSvg(category.name, name);
		});
	});
}

function createLoader(categories) {

	let template = '// auto-generated\n' +
		'export function loadSvg(icon) {\n' +
		'\tswitch (icon) {\n';
	categories.forEach((category) => {
		category.svgs.forEach((name) => {
			template += `\t\tcase '${category.name}:${name}':
			return import(/* webpackChunkName: "icon-${name}" */'./${category.name}/${name}.js');\n`;
		});
	});

	template += '\t}\n' +
		'\treturn undefined;\n' +
		'}\n';
	const filePath = path.join(outputPath, 'presetIconLoader.js');

	writeFileSync(filePath, template);

}

function createCatalogue(categories) {

	let output = '# Preset Icon Catalogue\n\n';

	categories.forEach((category) => {

		let size = 18;
		if (category.name === 'tier2') {
			size = 24;
		} else if (category.name === 'tier3') {
			size = 30;
		}
		output += `## ${category.name}\n\n` + 'Size: `' + size + 'px` x `' + size + '`px\n\n';

		const numCols = 3;
		const numPerCol = Math.ceil(category.svgs.length / numCols);

		for (let c = 0; c < numCols; c++) {
			output += '| Icon | Name |';
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
				if (index > category.svgs.length - 1) {
					output += '| &nbsp; | &nbsp; |';
				} else {
					const iconName = category.svgs[index];
					output += `| ![](https://raw.githubusercontent.com/BrightspaceUI/core/main/components/icons/images/${category.name}/${iconName}.svg?sanitize=true) | ${iconName} |`;
				}

				if (j === numCols - 1) {
					output += '\n';
				} else {
					output += ' ';
				}

			}

		}

		output += '\n';

	});

	const outputPath = path.join(__dirname, '../components/icons/catalogue.md');
	writeFileSync(outputPath, output);

}

function generate() {

	console.log(chalk.yellow('Generating icons...'));
	console.group();

	console.log(chalk.blue('Clearing output directory...'));
	if (!existsSync(outputRoot)) {
		mkdirSync(outputRoot, { recursive: true });
	}
	cleanDir(outputPath);
	mkdirSync(outputPath, { recursive: true });

	const categories = getSvgs();
	console.log(chalk.blue('Found SVGs, generating output...'));

	createLoader(categories);
	console.log(chalk.blue('"presetIconLoader.js" generated.'));

	createCatalogue(categories);
	console.log(chalk.blue('"catalogue.md" generated.'));

	createSvgs(categories);
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
