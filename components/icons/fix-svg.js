export function fixSvg(svg) {

	const fills = svg.querySelectorAll('[fill]');
	fills.forEach((fill) => {
		if (fill.getAttribute('fill') !== 'none') fill.removeAttribute('fill');
	});

	svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
	svg.setAttribute('focusable', 'false');
	svg.removeAttribute('height');
	svg.removeAttribute('width');

}
