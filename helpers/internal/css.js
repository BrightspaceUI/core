export function _isValidCssSelector(selector) {
	const partIsValid = (part) => {
		const re = /([a-zA-Z0-9-_ >.#]+)(\[[a-zA-Z0-9-_="]+\])?([a-zA-Z0-9-_ >.#]+)?/g;
		if (part === ':host') return true;
		const match = part.match(re);
		const isValid = !!match && match.length === 1 && match[0].length === part.length;
		if (!isValid) {
			console.warn(`Invalid CSS selector: "${part}"`);
		}
		return isValid;
	};

	const parts = selector.split(',');
	const allValid = parts.every(part => partIsValid(part));
	return allValid;
}

export function _registerCustomSemanticVariableValue(name, lightValue, darkValue) {
	const style = globalThis.document?.head.querySelector('#d2l-colors');
	if (!style) throw new Error('Colors stylesheet not found, make sure to properly import colors.js');
	if (!name || !_isValidCssValue(lightValue) || !_isValidCssValue(darkValue)) {
		throw new TypeError('_registerCustomSemanticVariableValue requires a name, lightValue, and darkValue');
	}
	const lightRule = style.sheet.cssRules[0];
	const darkRule = style.sheet.cssRules[1];
	const osRule = style.sheet.cssRules[2].cssRules[0];

	lightRule.style.setProperty(name, lightValue);
	darkRule.style.setProperty(name, darkValue);
	osRule.style.setProperty(name, darkValue);
}

function _isValidCssValue(value) {
	return (typeof value === 'string') || typeof (value?.cssText) === 'string';
}
