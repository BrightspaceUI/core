export function set(strings, ...expressions) {
	let w = Number.MAX_SAFE_INTEGER;
	const emptyStart = strings[0].match(/^\s*?\n/);
	if (emptyStart) {
		strings = [ strings[0].replace(/^.*?\n/, ''), ...strings.slice(1) ];
		strings[strings.length - 1] = strings.at(-1).replace(new RegExp('\\n[\\t ]+$'), '');
	}
	strings
		.map((s, idx) => s
			.split('\n')
			.filter((s, idx2) => !idx || idx2) // skip strings after an expression
		)
		.flat()
		.forEach((s, idx) => {
			if (idx) w = Math.min(s.match(/^\s*/)[0].length, w);
		});

	const re = new RegExp(`(^|\n)[^\\S\n]{${w}}`, 'g');
	return strings.reduce((acc, i, idx) => {
		return acc.push(i.replace(re, '$1'), expressions[idx] ?? '') && acc;
	}, []).join('');
}
