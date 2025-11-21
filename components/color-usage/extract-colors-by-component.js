#!/usr/bin/env node
/* eslint-disable no-console */

import { dirname, join } from 'path';
import { readdirSync, readFileSync, statSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Extracts color usage information from component files.
 *
 * Usage: node extract-colors.js <component-directory>
 * Example: node extract-colors.js ../button/
 */

const COLOR_PATTERNS = [
	// CSS custom properties
	/--d2l-color-[\w-]+/g,
	// 3 or 6 character hex colors
	/#[0-9a-fA-F]{6}\b/g,
	/#[0-9a-fA-F]{3}\b/g,
	// RGB/RGBA colors
	/rgba?\([^)]+\)/g
];

const CONTEXT_PATTERNS = [
	/background-color/i,
	/\bcolor:/i,
	/\bborder/i,
	/box-shadow/i,
	/\bfill/i,
	/\bstroke/i,
	/outline/i
];

const CATEGORY_PATTERNS = {
	background: /background(?:-color)?/i,
	foreground: /(?:text|icon|foreground|fill|stroke)\s+color/i,
	border: /border|outline/i,
	shadow: /(?:box-)?shadow/i,
	gradient: /gradient/i
};

const FILE_EXTENSIONS = ['.css', '.js'];
const IGNORED_DIRECTORIES = ['node_modules'];

/**
 * Get all CSS files in a directory and its subdirectories
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
 * Extract colors from file content
 */
function extractColors(filePath) {
	try {
		const content = readFileSync(filePath, 'utf8');
		const colors = new Map();

		// Split into lines for context
		const lines = content.split('\n');

		lines.forEach((line, index) => {
			// Check if line has color-related properties
			const hasColorContext = CONTEXT_PATTERNS.some(pattern => pattern.test(line));

			if (!hasColorContext) return;

			// Extract colors from this line
			COLOR_PATTERNS.forEach(pattern => {
				const matches = line.matchAll(pattern);

				for (const match of matches) {
					const color = match[0];

					// Get surrounding context
					const contextStart = Math.max(0, index - 2);
					const contextEnd = Math.min(lines.length, index + 3);
					const context = lines.slice(contextStart, contextEnd).join('\n');

					// Try to determine usage from context
					const usage = inferUsage(line, context);

					if (!colors.has(color)) {
						colors.set(color, []);
					}

					colors.get(color).push({
						line: index + 1,
						usage,
						context: line.trim()
					});
				}
			});
		});

		return colors;
	} catch (error) {
		console.error(`Error reading file ${filePath}:`, error.message);
		return new Map();
	}
}

/**
 * Infer usage description from context
 */
function inferUsage(line, context) {
	const usageHints = [];

	// Check for specific CSS properties
	if (/background-color/i.test(line)) {
		usageHints.push('background-color');
	}
	if (/\bcolor:/i.test(line)) {
		usageHints.push('text color');
	}
	if (/border(?!-)/i.test(line)) {
		usageHints.push('border color');
	}
	if (/border-top/i.test(line)) {
		usageHints.push('border-top');
	}
	if (/border-bottom/i.test(line)) {
		usageHints.push('border-bottom');
	}
	if (/box-shadow/i.test(line)) {
		usageHints.push('box-shadow');
	}
	if (/\bfill/i.test(line)) {
		usageHints.push('fill color');
	}
	if (/\bstroke/i.test(line)) {
		usageHints.push('stroke color');
	}
	if (/outline/i.test(line)) {
		usageHints.push('outline color');
	}

	// Check for states
	if (/:hover/i.test(context)) {
		usageHints.push('on hover');
	}
	if (/:focus/i.test(context)) {
		usageHints.push('on focus');
	}
	if (/:active/i.test(context)) {
		usageHints.push('on active');
	}
	if (/disabled/i.test(context)) {
		usageHints.push('when disabled');
	}
	if (/selected/i.test(context)) {
		usageHints.push('when selected');
	}
	if (/primary/i.test(context)) {
		usageHints.push('when primary');
	}
	if (/invalid/i.test(context)) {
		usageHints.push('when invalid');
	}

	return usageHints.join(', ') || 'color usage';
}

/**
 * Detect categories based on usage description
 */
function detectCategories(usage) {
	const categories = [];

	for (const [category, pattern] of Object.entries(CATEGORY_PATTERNS)) {
		if (pattern.test(usage)) {
			categories.push(category);
		}
	}

	// Return at least one category if none detected
	if (categories.length === 0) {
		categories.push('other');
	}

	return categories;
}

/**
 * Aggregate colors from multiple files
 */
function aggregateColors(colorMaps) {
	const aggregated = new Map();

	colorMaps.forEach(colorMap => {
		colorMap.forEach((usages, color) => {
			if (!aggregated.has(color)) {
				aggregated.set(color, []);
			}
			aggregated.get(color).push(...usages);
		});
	});

	// Convert to the expected JSON format
	const result = [];
	aggregated.forEach((usages, color) => {
		// Deduplicate and combine similar usages
		const uniqueUsages = new Set(usages.map(u => u.usage));
		const combinedUsage = Array.from(uniqueUsages).join('; ');

		result.push({
			color,
			usage: combinedUsage,
			categories: detectCategories(combinedUsage)
		});
	});

	return result;
}

/**
 * Main function
 */
function main() {
	const args = process.argv.slice(2); /* eslint-disable-line no-undef */

	if (args.length === 0) {
		console.error('Usage: node extract-colors.js <component-directory>');
		console.error('Example: node extract-colors.js ../button/');
		console.error('');
		console.error('Options:');
		console.error('  --update    Update color-usages-by-component.json with the extracted colors');
		process.exit(1); /* eslint-disable-line no-undef */
	}

	const componentDir = args.filter(arg => !arg.startsWith('--'))[0];
	const componentName = componentDir.split('/').filter(Boolean).pop();

	// Get all CSS files
	const files = getJsFiles(componentDir);

	if (files.length === 0) {
		console.error('No files found.');
		return;
	}

	console.log(`Found ${files.length} CSS file(s):\n`);

	// Extract colors from each file
	const colorMaps = [];
	const fileResults = new Map();

	files.forEach(file => {
		const fileName = file.split('/').pop();
		const colors = extractColors(file);

		if (colors.size > 0) {
			colorMaps.push(colors);
			fileResults.set(fileName, colors);
		}
	});

	// Aggregate all colors
	const aggregated = aggregateColors(colorMaps, componentName);

	console.log(`\n${'='.repeat(60)}`);
	console.log(`Total unique colors found: ${aggregated.length}`);
	console.log(`${'='.repeat(60)}\n`);

	// Build JSON output
	const jsonOutput = {};

	fileResults.forEach((colors, fileName) => {
		const componentKey = fileName.replace('.css', '').replace('.js', '');
		const colorArray = [];

		colors.forEach((usages, color) => {
			const uniqueUsages = new Set(usages.map(u => u.usage));
			const combinedUsage = Array.from(uniqueUsages).join('; ');

			colorArray.push({
				color,
				usage: combinedUsage,
				categories: detectCategories(combinedUsage)
			});
		});

		jsonOutput[`d2l-${componentKey}`] = colorArray;
	});

	try {
		const colorUsagesPath = join(__dirname, 'components/color-usage/color-usages-by-component.json');

		// Create color-usages-by-component.json if it doesn't exist
		let existingData = {};
		try {
			existingData = JSON.parse(readFileSync(colorUsagesPath, 'utf8'));
		} catch {
			console.log('\nℹ color-usages-by-component.json not found, creating new file...');
		}

		// Merge new data with existing, preserving existing entries
		Object.entries(jsonOutput).forEach(([componentKey, colors]) => {
			if (colors.length > 0) {
				existingData[componentKey] = colors;
			} else if (!existingData[componentKey]) {
				// Add empty array for components with no colors
				existingData[componentKey] = [];
			}
		});

		// Write back to file
		writeFileSync(colorUsagesPath, `${JSON.stringify(existingData, null, 4) }\n`, 'utf8');

		console.log(`\n✓ Successfully updated ${colorUsagesPath}`);
		console.log(`  Added/updated ${Object.keys(jsonOutput).length} component(s)`);
	} catch (error) {
		console.error('\n✗ Error updating color-usages-by-component.json:', error.message);
	}
}

main();

