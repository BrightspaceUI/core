import '../../components/button/button.js';
import './visibility-test-list.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { ifDefined } from 'lit-html/directives/if-defined.js';

export class VisibilityTest extends LitElement {

	static get properties() {
		return {
			_listVisibility: { type: Boolean, reflect: false }
		};
	}

	static get styles() {
		return css`
			:host {
				display: block;
				max-width: 400px;
			}
		`;
	}

	constructor() {
		super();
		this._listVisibilityChanged = false;
		this._listVisibility = true;
	}

	render() {
		const animateValue = this._listVisibilityChanged ?
			(this._listVisibility ? 'show' : 'hide') : undefined;
		const toggleText = this._listVisibility ? 'Hide List' : 'Show List';
		return html`
			<d2l-visibility-test-list animate="${ifDefined(animateValue)}"></d2l-visibility-test-list>
			<d2l-button @click="${this._handleAddItem}" ?disabled="${!this._listVisibility}">Add Item</d2l-button>
			<d2l-button @click="${this._handleToggleList}">${toggleText}</d2l-button>
		`;
	}

	_handleAddItem() {
		this.shadowRoot.querySelector('d2l-visibility-test-list').addItem();
	}

	_handleToggleList() {
		this._listVisibility = !this._listVisibility;
		this._listVisibilityChanged = true;
	}

}

customElements.define('d2l-visibility-test', VisibilityTest);
