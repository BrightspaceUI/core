console.warn('Using mathjax test context, this is intended for demo pages and tests only');

document.getElementsByTagName('html')[0].dataset.mathjaxContext = JSON.stringify({
	outputScale: 1.1,
	renderLatex: !(window.location.search.indexOf('latex=false') !== -1),
	enableMML3Support: true
});
