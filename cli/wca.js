import { spawn } from 'node:child_process';
import { glob as globFiles, mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join, resolve, relative } from 'node:path';

const customElementsFileName = 'custom-elements.json';

function findObjectEnd(content, start) {
	let depth = 0;
	let mode = 'code';
	let quote;

	for (let index = start; index < content.length; index++) {
		const character = content[index];
		const nextCharacter = content[index + 1];

		if (mode === 'line-comment') {
			if (character === '\n') mode = 'code';
			continue;
		}
		if (mode === 'block-comment') {
			if (character === '*' && nextCharacter === '/') {
				mode = 'code';
				index++;
			}
			continue;
		}
		if (mode === 'string' || mode === 'template') {
			if (character === '\\') {
				index++;
			} else if (character === quote) {
				mode = 'code';
			}
			continue;
		}

		if (character === '/' && nextCharacter === '/') {
			mode = 'line-comment';
			index++;
		} else if (character === '/' && nextCharacter === '*') {
			mode = 'block-comment';
			index++;
		} else if (character === '\'' || character === '"' || character === '`') {
			mode = character === '`' ? 'template' : 'string';
			quote = character;
		} else if (character === '{') {
			depth++;
		} else if (character === '}' && --depth === 0) {
			return index;
		}
	}

	throw new Error('Could not find the end of a static properties object.');
}

function transformProperties(content) {
	const propertyPattern = /\bstatic\s+properties\s*=/g;
	let result = '';
	let sourceIndex = 0;
	let match;

	while ((match = propertyPattern.exec(content)) !== null) {
		const objectStart = content.indexOf('{', propertyPattern.lastIndex);
		if (objectStart === -1) throw new Error('Could not find a static properties object.');

		const objectEnd = findObjectEnd(content, objectStart);
		const semicolon = content[objectEnd + 1] === ';' ? 1 : 0;
		const declaration = content.slice(match.index, objectEnd + 1 + semicolon);
		const object = content.slice(objectStart, objectEnd + 1);

		result += content.slice(sourceIndex, match.index);
		result += declaration.replace(/\bstatic\s+properties\s*=\s*/, 'static get properties() { return ')
			.replace(object, `${object}; }`);
		sourceIndex = objectEnd + 1 + semicolon;
		propertyPattern.lastIndex = sourceIndex;
	}

	return result + content.slice(sourceIndex);
}

async function transformFiles(files, temporaryDirectory) {
	for (const file of files) {
		const sourcePath = resolve(file);
		const relativePath = relative(process.cwd(), sourcePath);
		const destinationPath = join(temporaryDirectory, relativePath);

		await mkdir(dirname(destinationPath), { recursive: true });
		const content = await readFile(sourcePath, 'utf8');
		await writeFile(destinationPath, transformProperties(content));
	}
}

function restorePaths(value, temporaryPath) {
	if (Array.isArray(value)) {
		value.forEach(item => restorePaths(item, temporaryPath));
	} else if (value && typeof value === 'object') {
		Object.entries(value).forEach(([key, item]) => {
			if (key === 'path' && typeof item === 'string') {
				value[key] = item.replace(temporaryPath, '.');
			} else {
				restorePaths(item, temporaryPath);
			}
		});
	}
}

async function restoreCustomElementsPaths(temporaryDirectory) {
	const customElements = JSON.parse(await readFile(customElementsFileName, 'utf8'));
	const temporaryPath = `./${relative(process.cwd(), temporaryDirectory)}`;
	restorePaths(customElements, temporaryPath);
	await writeFile(customElementsFileName, `${JSON.stringify(customElements, null, 2)}\n`);
}

function runWca(src) {
	return new Promise((resolve, reject) => {
		const child = spawn('wca', [
			'analyze',
			src,
			'--format', 'json',
			'--outFile', customElementsFileName
		], { stdio: 'inherit' });
		child.once('error', reject);
		child.once('close', (exitCode, signal) => {
			if (exitCode === 0) {
				resolve();
			} else {
				reject(new Error(`wca exited with ${signal ? `signal ${signal}` : `code ${exitCode}`}`));
			}
		});
	});
}

async function main() {
	const [glob] = process.argv.slice(2);
	if (!glob) throw new Error('Usage: node ./cli/wca.js <glob>');

	const temporaryDirectory = await mkdtemp(join(tmpdir(), 'wca-'));

	try {
		const files = await Array.fromAsync(globFiles(glob, { nodir: true }));

		await transformFiles(files, temporaryDirectory);

		await runWca(join(temporaryDirectory, '**/*.js'));

		await restoreCustomElementsPaths(temporaryDirectory);
	} finally {
		await rm(temporaryDirectory, { recursive: true, force: true });
	}
}

main().catch(error => {
	console.error(error);
	process.exitCode = 1;
});
