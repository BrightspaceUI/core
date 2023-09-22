export async function loadSass() {
	return new Promise(resolve => {
		const link = document.createElement('link');
		link.id = 'vdiff-sass';
		link.type = 'text/css';
		link.rel = 'stylesheet';
		link.href = './test/sass.output.css';
		link.onload = resolve;
		document.getElementsByTagName('head')[0].appendChild(link);
	});
}

export function unloadSass() {
	document.getElementById('vdiff-sass').remove();
}
