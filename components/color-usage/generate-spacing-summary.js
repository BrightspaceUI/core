import { readFileSync, writeFileSync } from 'fs';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

function generateSpacingByValue(spacingUsages) {
	const spacingByValue = {};

	for (const [component, usages] of Object.entries(spacingUsages)) {
		if (!Array.isArray(usages) || usages.length === 0) {
			continue;
		}

		for (const usage of usages) {
			const { spacing, usages: usagesList, categories } = usage;

			if (!spacing || !usagesList) {
				continue;
			}

			if (!spacingByValue[spacing]) {
				spacingByValue[spacing] = {
					summary: '',
					categories: [],
					usages: []
				};
			}

			spacingByValue[spacing].usages.push({
				component,
				usages: usagesList,
				categories: categories || []
			});
		}
	}

	// Generate summaries and aggregate categories for each spacing value
	for (const [spacing, data] of Object.entries(spacingByValue)) {
		// Collect all unique categories
		const allCategories = new Set();
		data.usages.forEach(usage => {
			if (usage.categories) {
				usage.categories.forEach(cat => allCategories.add(cat));
			}
		});
		data.categories = Array.from(allCategories).sort();

		// Generate semantic summary
		data.summary = generateSummary(spacing, data.usages, data.categories);
	}

	return spacingByValue;
}

function generateSummary(spacing, usages, categories) {
	if (usages.length === 0) return '';

	const components = [...new Set(usages.map(u => u.component))];
	const allUsagesList = [];
	
	usages.forEach(u => {
		if (u.usages && Array.isArray(u.usages)) {
			allUsagesList.push(...u.usages);
		}
	});

	const uniqueUsages = [...new Set(allUsagesList)];

	// Build summary
	let summary = spacing;

	// Describe primary usage
	if (categories.length > 0) {
		summary += ` used for ${categories.join(', ')}`;
	}

	// Describe specific properties if limited
	if (uniqueUsages.length <= 5) {
		summary += ` (${uniqueUsages.join(', ')})`;
	} else {
		summary += ` across ${uniqueUsages.length} properties`;
	}

	// Add component context
	if (components.length === 1) {
		summary += ` in ${components[0]}`;
	} else if (components.length <= 3) {
		summary += ` across ${components.join(', ')}`;
	} else {
		summary += ` across ${components.length} components`;
	}

	return summary;
}

// Read the spacing-usages-by-component.json file
const filePath = `${__dirname}/spacing-usages-by-component.json`;
const spacingUsages = JSON.parse(readFileSync(filePath, 'utf-8'));

// Generate spacing-summary.json
const spacingSummary = generateSpacingByValue(spacingUsages);

// Write the output
const outputPath = `${__dirname}/spacing-summary.json`;
writeFileSync(outputPath, JSON.stringify(spacingSummary, null, 4));

console.log('✓ spacing-summary.json generated successfully'); // eslint-disable-line no-console
