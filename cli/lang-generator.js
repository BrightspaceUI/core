const chalk = require('chalk'),
	cleanDir = require('./cleanDir.js'),
	fs = require('fs'),
	path = require('path'),
	sergeDirectories = require('../core.serge.json');

const outputRoot = path.join(__dirname, '../generated');
const outputPath = path.join(outputRoot, 'lang');

function alphaSort(a, b) {
	a = a.toLowerCase();
	b = b.toLowerCase();
	if (a < b) {
		return -1;
	} else if (a > b) {
		return 1;
	}
	return 0;
}

function appendComponent(sergeComponent) {
	const directory = `${sergeComponent.source_dir}/`;
	const filenames = fs.readdirSync(directory);

	if (!filenames) {
		throw 'dir is empty';
	}

	filenames.forEach((filename) => {
		const filepath = directory + filename;
		const lang = path.basename(filepath, '.json');

		const terms = {};
		const data = fs.readFileSync(filepath);
		if (data) {
			const currentLangTerms = JSON.parse(data);
			Object.keys(currentLangTerms)
				.sort(alphaSort)
				.forEach((key) => {
					terms[key] = currentLangTerms[key] && currentLangTerms[key].translation;
				});
		}

		const component = sergeComponent.name;
		appendLangFile(lang, component, terms);
	});
}
function appendLangFile(lang, component, terms) {
	const generateFilePath = path.join(outputPath, `${lang}.js`);

	if (!fs.existsSync(generateFilePath)) {
		fs.writeFileSync(generateFilePath, '');
	}
	const json = JSON.stringify(terms);
	fs.appendFileSync(generateFilePath, `export const ${component} = JSON.parse('${json}');\n`, 'utf8', (err) => {
		if (err) throw err;
	});
}
function generate() {
	console.log(chalk.yellow('Generating language files...'));
	console.group();

	console.log(chalk.blue('Clearing output directory...'));
	if (!fs.existsSync(outputRoot)) {
		fs.mkdirSync(outputRoot, {recursive: true});
	}
	cleanDir(outputPath);
	fs.mkdirSync(outputPath, {recursive: true});

	sergeDirectories.forEach((component) => {
		console.log(chalk.blue(`Building language files for ${component.name}...`));
		appendComponent(component);
	});

	console.groupEnd();
	console.log(chalk.green('Language files successfully generated.'));
}

try {
	generate();
	process.exit(0);
} catch (err) {
	console.error(chalk.red(err));
	console.groupEnd();
	process.exit(1);
}
