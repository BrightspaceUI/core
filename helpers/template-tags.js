const emptyStartRe = /^\s*?\n/;
const emptyEndRe = /\n[^\S\n]+$/;
const indentRe = /^\s*/;
export function set(strings, ...expressions) {
	let w = Number.MAX_SAFE_INTEGER;
	const emptyStart = strings[0].match(emptyStartRe);
	if (emptyStart) {
		strings = [ strings[0].replace(emptyStartRe, ''), ...strings.slice(1) ];
		strings[strings.length - 1] = strings.at(-1).replace(emptyEndRe, '');
	}
	strings
		.forEach(s => s
			.split('\n')
			.forEach((s, idx) => {
				if (idx) w = Math.min(s.match(indentRe)[0].length, w);
			})
		);

	const re = new RegExp(`(^|\n)[^\\S\n]{${w}}`, 'g');
	return strings.reduce((acc, i, idx) => {
		return acc.push(i.replace(re, '$1'), expressions[idx] ?? '') && acc;
	}, []).join('');
}
