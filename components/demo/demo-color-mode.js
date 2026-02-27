export const colorModes = ['light', 'dark', 'os'];
export const defaultColorMode = 'light';

const urlParams = new URLSearchParams(window.location.search);
const requestedColorMode = urlParams.get('color-mode');

const colorMode = colorModes.includes(requestedColorMode) ? requestedColorMode : localStorage.getItem('color-mode');
if (colorMode) {
	document.documentElement.dataset.colorMode = colorMode;
} else {
	delete document.documentElement.dataset.colorMode;
}
