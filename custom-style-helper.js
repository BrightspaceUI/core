import '@webcomponents/shadycss/custom-style-interface.min.js';

export const addCustomStyle = (style) => {
	const elem = document.createElement('style');
	elem.textContent = style;
	const head = document.getElementsByTagName('head')[0];
	head.appendChild(elem);
	window.ShadyCSS.CustomStyleInterface.addCustomStyle({
		getStyle() {
			return elem;
		}
	});
};
