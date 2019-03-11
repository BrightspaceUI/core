import { ifDefined } from 'lit-html/directives/if-defined.js';
import { LitElement, html } from 'lit-element/lit-element.js';
import { D2LButtonMixin } from './button-mixin.js';
import { buttonStyles } from './button-styles.js';

/* TODO: deal with icons */
/* TODO: figure out best way to render icon in template if no icon defined */
/* TODO: implement focusable mixin, or just implement in the button mixin */
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
				aria-expanded="${ifDefined(this.ariaExpanded)}"
				aria-haspopup="${ifDefined(this.ariaHaspopup)}"
				aria-label="${ifDefined(this.ariaLabel)}"
				?autofocus="${ifDefined(this.autofocus)}"
				class="d2l-focusable"
				?disabled="${this.disabled}"
				form="${ifDefined(this.form)}"
				formaction="${ifDefined(this.formaction)}"
				formenctype="${ifDefined(this.formenctype)}"
				formmethod="${ifDefined(this.formmethod)}"
				formnovalidate="${ifDefined(this.formnovalidate)}"
				formtarget="${ifDefined(this.formtarget)}"
				name="${ifDefined(this.name)}"
				type="${this.type}">
				<d2l-icon icon="[[icon]]" class="d2l-button-subtle-icon"></d2l-icon>
				<span class="d2l-button-subtle-content">${this.text}</span>
				<slot></slot>
		</button>
		`;
	}

}

customElements.define('d2l-button-subtle', D2LButtonSubtle);
