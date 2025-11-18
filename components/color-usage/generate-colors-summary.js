import { readFileSync, writeFileSync } from 'fs';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

function generateColorsByUsage(colorUsages) {
	const colorsByUsage = {};

	for (const [component, usages] of Object.entries(colorUsages)) {
		if (!Array.isArray(usages) || usages.length === 0) {
			continue;
		}

		for (const usage of usages) {
			const { color, usage: usageText, categories } = usage;

			if (!color || !usageText) {
				continue;
			}

			if (!colorsByUsage[color]) {
				colorsByUsage[color] = {
					summary: '',
					categories: [],
					usages: []
				};
			}

			colorsByUsage[color].usages.push({
				component,
				usage: usageText,
				categories: categories || []
			});
		}
	}

	// Generate summaries and aggregate categories for each color
	for (const [color, data] of Object.entries(colorsByUsage)) {
		// Collect all unique categories
		const allCategories = new Set();
		data.usages.forEach(usage => {
			if (usage.categories) {
				usage.categories.forEach(cat => allCategories.add(cat));
			}
		});
		data.categories = Array.from(allCategories).sort();

		// Generate semantic summary
		data.summary = generateSummary(color, data.usages, data.categories);

		// Add resultant color for semi-transparent rgba colors
		if (color.startsWith('rgba') || color.startsWith('rgb')) {
			const parsed = parseRgba(color);
			if (parsed && parsed.a < 1) {
				data.resultantOnWhite = calculateResultantColor(parsed);
			}
		}
	}

	return colorsByUsage;
}

/**
 * Parses an rgba/rgb color string and returns the components
 * @param {string} colorStr - Color string like "rgba(0, 0, 0, 0.5)" or "rgb(255, 255, 255)"
 * @returns {object|null} - {r, g, b, a} or null if invalid
 */
function parseRgba(colorStr) {
	const rgbaMatch = colorStr.match(/rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+)\s*)?\)/);

	if (!rgbaMatch) {
		return null;
	}

	return {
		r: parseInt(rgbaMatch[1], 10),
		g: parseInt(rgbaMatch[2], 10),
		b: parseInt(rgbaMatch[3], 10),
		a: rgbaMatch[4] !== undefined ? parseFloat(rgbaMatch[4]) : 1
	};
}

/**
 * Calculates the resultant color when an rgba color is placed on a white background
 * Uses alpha compositing formula: resultant = foreground * alpha + background * (1 - alpha)
 * @param {object} rgba - {r, g, b, a} object
 * @returns {string} - Hex color string like "#808080"
 */
function calculateResultantColor(rgba) {
	const { r, g, b, a } = rgba;
	const whiteBackground = 255;

	// Apply alpha compositing
	const resultR = Math.round(r * a + whiteBackground * (1 - a));
	const resultG = Math.round(g * a + whiteBackground * (1 - a));
	const resultB = Math.round(b * a + whiteBackground * (1 - a));

	// Convert to hex
	const toHex = (val) => val.toString(16).padStart(2, '0');
	return `#${toHex(resultR)}${toHex(resultG)}${toHex(resultB)}`;
}

function generateSummary(color, usages) {
	if (usages.length === 0) return '';

	// Extract common themes from usages
	const usageTexts = usages.map(u => u.usage.toLowerCase());
	const components = [...new Set(usages.map(u => u.component))];

	// Detect common patterns
	const isBackground = usageTexts.some(u => u.includes('background'));
	const isText = usageTexts.some(u => u.includes('text'));
	const isBorder = usageTexts.some(u => u.includes('border'));
	const isIcon = usageTexts.some(u => u.includes('icon'));
	const isShadow = usageTexts.some(u => u.includes('shadow'));
	const isHover = usageTexts.some(u => u.includes('hover'));
	const isFocus = usageTexts.some(u => u.includes('focus'));
	const isDisabled = usageTexts.some(u => u.includes('disabled'));
	const isSelected = usageTexts.some(u => u.includes('selected'));
	const isPrimary = usageTexts.some(u => u.includes('primary'));
	const isDarkTheme = usageTexts.some(u => u.includes('dark theme'));

	// Build summary
	let summary = '';

	// Describe the color type
	if (color.startsWith('--d2l-color-')) {
		const colorName = color.replace('--d2l-color-', '').replace(/-/g, ' ');
		summary = colorName.charAt(0).toUpperCase() + colorName.slice(1);
	} else if (color === 'white' || color === '#ffffff' || color === '#FFF') {
		summary = 'White';
	} else if (color === 'black' || color === '#000000' || color === '#000') {
		summary = 'Black';
	} else if (color === 'transparent') {
		summary = 'Transparent';
	} else if (color.startsWith('rgba') || color.startsWith('rgb')) {
		if (color.includes('255, 255, 255')) {
			summary = 'White variation';
		} else if (color.includes('0, 0, 0')) {
			summary = 'Black variation';
		} else {
			summary = 'Custom color';
		}
	} else if (color.startsWith('#')) {
		summary = 'Custom color';
	} else {
		summary = 'Color';
	}

	// Describe primary usage
	const usageTypes = [];
	if (isBackground) usageTypes.push('background');
	if (isText) usageTypes.push('text');
	if (isIcon) usageTypes.push('icon');
	if (isBorder) usageTypes.push('border');
	if (isShadow) usageTypes.push('shadow');

	if (usageTypes.length > 0) {
		summary += ` used for ${ usageTypes.join(', ')}`;
	}

	// Add state information
	const states = [];
	if (isHover) states.push('hover');
	if (isFocus) states.push('focus');
	if (isSelected) states.push('selected');
	if (isDisabled) states.push('disabled');
	if (isPrimary) states.push('primary');

	if (states.length > 0) {
		summary += ` in ${ states.join(', ') } states`;
	}

	// Add theme info
	if (isDarkTheme) {
		summary += ' (dark theme)';
	}

	// Add component context if limited
	if (components.length <= 3) {
		summary += ` across ${ components.join(', ')}`;
	} else if (components.length <= 5) {
		summary += ' across multiple components';
	}

	return summary || 'Color used across components';
}

// Read the color-usages-by-component.json file
const filePath = `${__dirname}/color-usages-by-component.json`;
const colorUsages = JSON.parse(readFileSync(filePath, 'utf-8'));

// Generate colors-summary.json
const colorsSummary = generateColorsByUsage(colorUsages);

// Write the output
const outputPath = `${__dirname}/colors-summary.json`;
writeFileSync(outputPath, JSON.stringify(colorsSummary, null, 4));

console.log('✓ colors-summary.json regenerated successfully');
