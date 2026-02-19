const urlParams = new URLSearchParams(window.location.search);
const colorMode = urlParams.get('color-mode');
if (colorMode) {
	document.documentElement.dataset.colorMode = colorMode;
} else {
	delete document.documentElement.dataset.colorMode;
}
