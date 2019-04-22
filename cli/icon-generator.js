const fs = require('fs'),
	path = require('path');

const imagePath = path.join(__dirname, '../components/icons/images');
const outputRoot = path.join(__dirname, '../.generated');
const outputPath = path.join(outputRoot, 'icons');

function getSvgsInDir(dir) {

	const dirPath = path.join(imagePath, dir);

	if (!fs.lstatSync(dirPath).isDirectory()) {
		return [];
	}

	const svgs = fs.readdirSync(dirPath)
		.filter((file) => {
			return (path.extname(file) === '.svg');
		}).map((file) => {
			return {category: dir, name: file.substr(0, file.length - 4)};
		});
	return svgs;

}

function getSvgs() {
	let svgs = [];
	const dirs = fs.readdirSync(imagePath);
	dirs.forEach((dir) => {
		const newSvgs = getSvgsInDir(dir);
		svgs = svgs.concat(newSvgs);
	});
	return svgs;
}

function cleanDir(dirPath) {

	if (!fs.existsSync(dirPath))
		return;

	const files = fs.readdirSync(dirPath);
	files.forEach((file) => {
		const currentPath = path.join(dirPath, file);
		if (fs.lstatSync(currentPath).isDirectory()) {
			cleanDir(currentPath);
		} else {
			fs.unlinkSync(currentPath);
		}
	});

	fs.rmdirSync(dirPath);

}

function createSvg(entry) {

	const categoryPath = path.join(outputPath, entry.category);
	const sourcePath = path.join(imagePath, entry.category, `${entry.name}.svg`);
	const destPath = path.join(outputPath, entry.category, `${entry.name}.js`);

	if (!fs.existsSync(categoryPath)) {
		fs.mkdirSync(categoryPath);
	}

	const data = fs.readFileSync(sourcePath);
	const output = '// auto-generated\n' +
		'export const val = `' + data + '`;';

	fs.writeFileSync(destPath, output);

}

function createSvgs(svgs) {
	svgs.forEach((entry) => {
		createSvg(entry);
	});
}

function createLoader(svgs) {

	let template = '// auto-generated\n' +
		'export async function loadSvg(icon) {\n' +
		'\tswitch (icon) {\n';
	svgs.forEach((svg) => {
		template += `\t\tcase 'd2l-${svg.category}:${svg.name}':
			return await import('./${svg.category}/${svg.name}.js');\n`;
	});
	template += '\t}\n' +
		'\treturn undefined;\n' +
		'}';
	const filePath = path.join(outputPath, 'presetIconLoader.js');

	fs.writeFileSync(filePath, template);

}

function generate() {

	console.log('Generating icons...');
	console.group();

	console.log('Clearing output directory...');
	cleanDir(outputRoot);
	fs.mkdirSync(outputRoot, {recursive: true});
	fs.mkdirSync(outputPath, {recursive: true});

	const svgs = getSvgs();
	console.log(`Found ${svgs.length} SVGs, generating output...`);

	createLoader(svgs);
	console.log('"presetIconLoader.js" generated.');

	createSvgs(svgs);
	console.log('SVG imports generated.');
	console.groupEnd();

}

try {
	generate();
	process.exit(0);
} catch (err) {
	console.error(err);
	console.groupEnd();
	process.exit(1);
}
