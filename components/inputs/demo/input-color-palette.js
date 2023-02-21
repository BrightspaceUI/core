import '../../button/button.js';
import '../input-text.js';
import { css, html, LitElement } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';

class InputColorPalette extends LitElement {

	static get properties() {
		return {
			value: { type: String }
		};
	}

	static get styles() {
		return [ css`
			:host {
				display: block;
				padding: 12px;
			}
			:host([hidden]) {
				display: none;
			}
			p {
				margin-top: 0;
			}
			span {
				margin: 0 0.2rem 0 0.55rem;
			}
			div {
				align-items: flex-end;
				display: flex;
				gap: 6px;
			}
		`];
	}

	render() {
		return html`
			<p>On a MVC page, its color palette will render in here.</p>
			<div>
				<d2l-input-text input-width="120px" label="Value (HEX)" maxlength="6" value="${ifDefined(this.value)}"><span slot="left" aria-hidden="true">#</span></d2l-input-text>
				<d2l-button primary @click="${this._handleOK}">OK</d2l-button>
				<d2l-button @click="${this._handleCancel}">Cancel</d2l-button>
			</div>
			`;
	}

	_handleCancel() {
		this.dispatchEvent(new CustomEvent(
			'd2l-input-color-dropdown-close', { bubbles: true, composed: false }
		));
	}

	_handleOK() {
		let value = this.shadowRoot.querySelector('d2l-input-text').value.trim();
		if (value.length === 0) {
			value = undefined;
		} else {
			value = `#${value}`;
		}
		this.dispatchEvent(new CustomEvent(
			'd2l-input-color-dropdown-close', { bubbles: true, composed: false, detail: { newValue: value } }
		));
	}

}
customElements.define('d2l-test-input-color-palette', InputColorPalette);
