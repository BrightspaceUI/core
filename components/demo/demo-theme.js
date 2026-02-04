const urlParams = new URLSearchParams(window.location.search);
const theme = urlParams.get('theme');
if (theme) {
	document.documentElement.dataset.theme = theme;
} else {
	delete document.documentElement.dataset.theme;
}
