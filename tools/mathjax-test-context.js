const disabled = window.location.search.indexOf('latex=false') !== -1;

document.getElementsByTagName('html')[0].dataset.mathjaxContext = JSON.stringify({
	outputScale: 1.1,
	renderLatex: !disabled
});
