#!/usr/bin/env node
/* eslint-disable no-console */

import { dirname, join } from 'path';
import { readdirSync, readFileSync, statSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Extracts spacing usage information from component files.
 *
 * Usage: node extract-spacing-by-component.js <component-directory>
 * Example: node extract-spacing-by-component.js ../button/
 */

const SPACING_PATTERNS = [
	// Numeric values with units (px, rem, em only - no %)
	/\b\d+(?:\.\d+)?(?:px|rem|em)\b/g
];

const CONTEXT_PATTERNS = [
	/\bmargin(?:-(?:top|right|bottom|left|inline|block|inline-start|inline-end|block-start|block-end))?:/i,
	/\bpadding(?:-(?:top|right|bottom|left|inline|block|inline-start|inline-end|block-start|block-end))?:/i,
	/\bgap:/i,
	/\brow-gap:/i,
	/\bcolumn-gap:/i,
	/\bborder(?:-(?:top|right|bottom|left|inline|block|inline-start|inline-end|block-start|block-end))?(?:-width)?:/i,
	/\bborder-radius:/i,
	/\bborder-(?:top|bottom)-(?:left|right)-radius:/i
];

const PROPERTY_PATTERNS = {
	margin: /\bmargin(?:-(?:top|right|bottom|left|inline|block|inline-start|inline-end|block-start|block-end))?:/i,
	padding: /\bpadding(?:-(?:top|right|bottom|left|inline|block|inline-start|inline-end|block-start|block-end))?:/i,
	gap: /\b(?:gap|row-gap|column-gap):/i,
	border: /\bborder(?:-(?:top|right|bottom|left|inline|block|inline-start|inline-end|block-start|block-end))?(?:-width)?:/i,
	'border-radius': /\bborder-radius:|border-(?:top|bottom)-(?:left|right)-radius:/i
};

const FILE_EXTENSIONS = ['.css', '.js'];
const IGNORED_DIRECTORIES = ['node_modules', 'test', 'demo'];

/**
 * Get all CSS and JS files in a directory and its subdirectories
 */
function getJsFiles(dir) {
	const files = [];

	function scanDirectory(currentDir) {
		try {
			const entries = readdirSync(currentDir);

			for (const entry of entries) {
				// Skip ignored directories
				if (IGNORED_DIRECTORIES.includes(entry)) {
					continue;
				}

				const fullPath = join(currentDir, entry);
				const stat = statSync(fullPath);

				if (stat.isDirectory()) {
					// Recursively scan subdirectories
					scanDirectory(fullPath);
				} else if (stat.isFile() && FILE_EXTENSIONS.some(ext => entry.endsWith(ext))) {
					files.push(fullPath);
				}
			}
		} catch (error) {
			console.error(`Error reading directory ${currentDir}:`, error.message);
		}
	}

	scanDirectory(dir);
	return files;
}

/**
 * Extract property name from line
 */
function extractPropertyName(line) {
	const match = line.match(/(margin|padding|gap|row-gap|column-gap|border(?:-(?:top|right|bottom|left|inline|block|inline-start|inline-end|block-start|block-end))?(?:-width)?|border-radius|border-(?:top|bottom)-(?:left|right)-radius)(?:-(?:top|right|bottom|left|inline|block|inline-start|inline-end|block-start|block-end))?/i);
	return match ? match[0] : 'spacing';
}

/**
 * Extract spacing values from file content
 */
function extractSpacingValues(filePath) {
	try {
		const content = readFileSync(filePath, 'utf8');
		const spacingValues = new Map();
		const lines = content.split('\n');

		lines.forEach((line) => {
			const hasSpacingContext = CONTEXT_PATTERNS.some(pattern => pattern.test(line));
			if (!hasSpacingContext) return;

			SPACING_PATTERNS.forEach(pattern => {
				const matches = line.matchAll(pattern);

				for (const match of matches) {
					const value = match[0];

					// Skip very large values
					if (value.match(/^\d+/) && parseFloat(value) > 1000) {
						continue;
					}

					// Determine property category
					const categories = [];
					Object.entries(PROPERTY_PATTERNS).forEach(([propName, pattern]) => {
						if (pattern.test(line)) {
							categories.push(propName);
						}
					});

					if (categories.length === 0) continue;

					// Extract property name for usage
					const propertyName = extractPropertyName(line);

					if (!spacingValues.has(value)) {
						spacingValues.set(value, {
							usages: [],
							categories: new Set()
						});
					}

					const entry = spacingValues.get(value);
					if (!entry.usages.includes(propertyName)) {
						entry.usages.push(propertyName);
					}
					categories.forEach(cat => entry.categories.add(cat));
				}
			});
		});

		return Array.from(spacingValues.entries()).map(([value, data]) => ({
			spacing: value,
			usages: data.usages.sort(),
			categories: [...data.categories].sort()
		}));
	} catch (error) {
		return [];
	}
}

/**
 * Main function
 */
function main() {
	const args = process.argv.slice(2); /* eslint-disable-line no-undef */

	if (args.length === 0) {
		console.error('Usage: node extract-spacing-by-component.js <component-directory>');
		console.error('Example: node extract-spacing-by-component.js ../button/');
		process.exit(1); /* eslint-disable-line no-undef */
	}

	const componentDir = args[0];
	const componentName = componentDir.split('/').filter(Boolean).pop();

	// Get all CSS and JS files
	const files = getJsFiles(componentDir);

	if (files.length === 0) {
		console.error('No files found.');
		return;
	}

	console.log(`Found ${files.length} file(s):\n`);

	// Extract spacing from each file
	const fileResults = new Map();

	files.forEach(file => {
		const fileName = file.split('/').pop();
		const spacingValues = extractSpacingValues(file);

		if (spacingValues.length > 0) {
			fileResults.set(fileName, spacingValues);
		}
	});

	// Build JSON output
	const jsonOutput = {};

	fileResults.forEach((spacingValues, fileName) => {
		const componentKey = fileName.replace('.css', '').replace('.js', '');
		jsonOutput[`d2l-${componentKey}`] = spacingValues;
	});

	// Load existing data
	const outputPath = join(__dirname, 'spacing-usages-by-component.json');
	let existingData = {};
	try {
		existingData = JSON.parse(readFileSync(outputPath, 'utf8'));
	} catch {
		console.log('\nℹ spacing-usages-by-component.json not found, creating new file...');
	}

	// Merge new data with existing
	Object.entries(jsonOutput).forEach(([componentKey, spacingValues]) => {
		if (spacingValues.length > 0) {
			existingData[componentKey] = spacingValues;
		} else if (!existingData[componentKey]) {
			existingData[componentKey] = [];
		}
	});

	// Write to file
	writeFileSync(
		outputPath,
		JSON.stringify(existingData, null, 4) + '\n',
		'utf8'
	);

	console.log(`\n✓ Successfully updated ${outputPath}`);
	console.log(`  Added/updated ${Object.keys(jsonOutput).length} component(s)`);
}

main();
