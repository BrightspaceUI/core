import { LitElement, html } from 'lit-element';
import { D2LButtonMixin } from './button-mixin.js';
import { buttonStyles } from './button-styles.js';

/* TODO: deal with icons */
/* TODO: figure out best way to render icon in template if no icon defined */
/* TODO: implement focusable mixin, or just implement in the button mixin */
/* TODO: figure out how to prevent "undefined" values from being rendered on underlying button */
/* TODO: check to make sure nothing was missed */

export class D2LButtonSubtle extends D2LButtonMixin(LitElement) {

	static get properties() {
		return {
			hAlign: { type: String, reflect: true },
			icon: { type: String, reflect: true },
			iconRight: { type: Boolean, reflect: true, attribute: 'icon-right' },
			text: { type: String, reflect: true }
		};
	}

	static get styles() {
		return [ buttonStyles ];
	}

	constructor() {
		super();
	}

	render() {
		return html`
			<button
				aria-expanded="${this.ariaExpanded}"
				aria-haspopup="${this.ariaHaspopup}"
				aria-label="${this.ariaLabel}"
				?autofocus="${this.autofocus}"
				class="d2l-focusable"
				?disabled="${this.disabled}"
				form="${this.form}"
				formaction="${this.formaction}"
				formenctype="${this.formenctype}"
				formmethod="${this.formmethod}"
				formnovalidate="${this.formnovalidate}"
				formtarget="${this.formtarget}"
				name="${this.name}"
				type="${this.type}">
				<d2l-icon icon="[[icon]]" class="d2l-button-subtle-icon"></d2l-icon>
				<span class="d2l-button-subtle-content">${this.text}</span>
				<slot></slot>
		</button>
		`;
	}

}

customElements.define('d2l-button-subtle', D2LButtonSubtle);
