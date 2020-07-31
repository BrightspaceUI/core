const chalk = require('chalk'),
	fs = require('fs'),
	path = require('path');

const langs = ['ar', 'cy-gb', 'da', 'de', 'es', 'es-es', 'fr', 'ja', 'ko', 'nl', 'pt', 'sv', 'tr', 'zh-tw', 'zh'];
const langTermsPath = path.join(__dirname, '../lang');

function _parseFile(fileName) {
	const file = fs.readFileSync(`${langTermsPath}/${fileName}.js`).toString();
	const stringContent = file.split('default ')[1].split(';')[0];
	return JSON.parse(stringContent);
}

function _writeChanges(fileName, content) {
	const json = JSON.stringify(content, null, '\t');
	const fileContent = `/* eslint quotes: 0 */

export default ${json};
`;
	fs.writeFileSync(`${langTermsPath}/${fileName}.js`, fileContent, 'utf8');
}

function verify() {
	const englishTranslations = _parseFile('en');
	const englishKeys = Object.keys(englishTranslations);

	langs.forEach((lang) => {
		let changes = false;
		const translations = _parseFile(lang);
		englishKeys.forEach((key) => {
			const translatedValue = translations[key];
			if (translatedValue === undefined || translatedValue === '') {
				changes = true;
				translations[key] = englishTranslations[key];
			}
		});

		if (changes) {
			const ordered = {};
			Object.keys(translations).sort().forEach((key) => {
				ordered[key] = translations[key];
			});
			_writeChanges(lang, ordered);
		}
	});
}

try {
	verify();
	process.exit(0);
} catch (err) {
	console.error(chalk.red(err));
	console.groupEnd();
	process.exit(1);
}
