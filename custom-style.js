import '@webcomponents/shadycss/custom-style-interface.min.js';

class CustomStyle extends HTMLElement {
	constructor() {
		super();
		window.ShadyCSS.CustomStyleInterface.addCustomStyle(this);
	}
	getStyle() {
		return this.querySelector('style');
	}
}
customElements.define('d2l-custom-style', CustomStyle);
