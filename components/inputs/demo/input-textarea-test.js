import { css, html, LitElement } from 'lit-element/lit-element.js';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { inputStyles } from '../input-styles.js';

class TestInputTextarea extends LitElement {

	static get properties() {
		return {
			disabled: { type: Boolean },
			invalid: { type: Boolean },
			placeholder: { type: String },
			value: { type: String }
		};
	}

	static get styles() {
		return [inputStyles,
			css`
				:host {
					display: block;
				}
			`
		];
	}

	render() {
		const invalid = this.invalid ? 'true' : 'false';
		return html`
			<textarea
				aria-invalid="${invalid}"
				class="d2l-input"
				?disabled="${this.disabled}"
				placeholder="${ifDefined(this.placeholder)}">${this.value}</textarea>
		`;
	}

	focus() {
		const elem = this.shadowRoot.querySelector('textarea');
		if (elem) elem.focus();
	}

}
customElements.define('d2l-test-input-textarea', TestInputTextarea);
