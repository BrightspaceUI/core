const HEX_REGEX = /^#([0-9a-fA-F]){6}$/;
const HEX_REGEX_ALPHA = /^#([0-9a-fA-F]){8}$/;

export function getValidHexColor(value, canHaveAlpha) {

	if (!canHaveAlpha) {
		if (value !== undefined && !HEX_REGEX.test(value)) {
			throw new TypeError(`Invalid HEX color value "${value}". Expecting a 6 character HEX color.`);
		}
	} else {
		if (value !== undefined && !HEX_REGEX.test(value) && !HEX_REGEX_ALPHA.test(value)) {
			throw new TypeError(`Invalid HEX color value "${value}". Expecting a 6 or 8 character HEX color.`);
		}
	}
	return (typeof value === 'string') ? value.toUpperCase() : undefined;
}
