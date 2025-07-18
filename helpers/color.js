const HEX_CHAR = '[0-9a-f]';
const HEX_REGEX = new RegExp(`^#(${HEX_CHAR}{3}|${HEX_CHAR}{6})$`, 'i');
const HEX_REGEX_ALPHA = new RegExp(`^#(${HEX_CHAR}{4}|${HEX_CHAR}{8})$`, 'i');

export function getValidHexColor(value, canHaveAlpha) {

	if (!canHaveAlpha) {
		if (value !== undefined && !HEX_REGEX.test(value)) {
			throw new TypeError(`Invalid HEX color value "${value}". Expecting a 3 or 6 character HEX color.`);
		}
	} else {
		if (value !== undefined && !HEX_REGEX.test(value) && !HEX_REGEX_ALPHA.test(value)) {
			throw new TypeError(`Invalid HEX color value "${value}". Expecting a 3, 4, 6, or 8 character HEX color.`);
		}
	}
	return (typeof value === 'string') ? value.toUpperCase() : undefined;
}

export function toRGB(d2lColor, alpha = 1) {
	const hex = getComputedStyle(document.documentElement)
		.getPropertyValue(`--d2l-color-${d2lColor}`);
	if (!hex) {
		throw new Error(`Color variable --d2l-color-${d2lColor} not found.`);
	}
	const rgb = hex
		.match(/\w\w/g)
		.map(v => parseInt(v, 16))
		.join(' ');
	return `rgb(${rgb} / ${alpha})`;
}
