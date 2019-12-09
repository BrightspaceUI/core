import { css, html, LitElement } from 'lit-element/lit-element.js';
import { labelStyles } from './input-label-styles.js';

class InputFieldset extends LitElement {

	static get properties() {
		return {
			label: { type: String },
			required: { type: Boolean, reflect: true }
		};
	}

	static get styles() {
		return [ labelStyles,
			css`
				:host {
					display: block;
				}
				:host([hidden]) {
					display: none;
				}
			`
		];
	}

	constructor() {
		super();
		this.required = false;
	}

	render() {
		return html`
			<fieldset class="d2l-input-label-fieldset">
				<legend class="d2l-input-label">${this.label}</legend>
				<slot></slot>
			</fieldset>
		`;
	}

}
customElements.define('d2l-input-fieldset', InputFieldset);
