import '../colors/colors.js';
import './breadcrumb.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';

class BreadCrumbs extends LitElement {
	static get properties() {
		return {
			compact: {
				type: Boolean,
				reflect: true
			}
		};
	}

	static get styles() {
		return css`
		`;
	}

	constructor() {
		super();
		this.state = 'default';
		this.bold = false;
	}

	render() {
		return html`
			<div>
				<slot></slot>
			</div>
		`;
	}

}
customElements.define('d2l-breadcrumbs', BreadCrumbs);
