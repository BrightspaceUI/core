import '@webcomponents/shadycss/custom-style-interface.min.js';

const processCustomCSS = () => {
	const styles = document.querySelectorAll('.d2l-custom-style');
	styles.forEach((style) => {
		window.ShadyCSS.CustomStyleInterface.addCustomStyle(style);
	});
};

if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', processCustomCSS);
} else {
	processCustomCSS();
}
