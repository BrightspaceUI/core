export function _isValidCssSelector(selector) {
	const partIsValid = (part) => {
		const re = /([a-zA-Z0-9-_ >.#]+)(\[[a-zA-Z0-9-_]+\])?([a-zA-Z0-9-_ >.#]+)?/g;
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

	style.sheet.insertRule(`html { ${ name }: ${ lightValue } }`, 0);
	style.sheet.insertRule(`html[data-color-mode="dark"] { ${ name }: ${ darkValue } }`, 1);
	style.sheet.insertRule(`@media (prefers-color-scheme: dark) {
		html[data-color-mode="os"] { ${ name }: ${ darkValue } }
	}`, 2);
}

function _isValidCssValue(value) {
	return (typeof value === 'string') || typeof (value?.cssText) === 'string';
}
