export function fixSvg(svg) {

	const paths = svg.querySelectorAll('path[fill]');
	paths.forEach((path) => {
		if (path.getAttribute('fill') !== 'none') path.removeAttribute('fill');
	});

	svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
	svg.setAttribute('focusable', 'false');
	svg.removeAttribute('height');
	svg.removeAttribute('width');

}
