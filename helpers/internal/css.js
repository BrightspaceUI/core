export function _isValidCssSelector(selector) {
	const partIsValid = (part) => {
		const notRegex = /:not\((.+?)\)/;
		const notMatches = part.match(notRegex);
		if (notMatches) {
			return [
				part.substring(0, notMatches.index),
				notMatches[1],
				part.substring(notMatches.index + notMatches[1].length + 6)
			].every((part, i) => (i !== 1 && part === '') || partIsValid(part));
		}

		const re = /([:a-zA-Z0-9-_ >.#]+)(\(?\[[a-zA-Z0-9-_="]+\]\)?)?([a-zA-Z0-9-_ >.#]+)?/g;
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
