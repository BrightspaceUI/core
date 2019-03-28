import 'd2l-icons/d2l-icon.js';
import 'd2l-icons/tier1-icons.js';
import { html, LitElement } from 'lit-element/lit-element.js';
import { buttonSharedStyles } from './button-shared-styles.js';
import { buttonSubtleStyles } from './button-subtle-styles.js';
import { D2LButtonMixin } from './button-mixin.js';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { labelStyles } from '../typography/styles.js';

/* TODO: convert icons to Lit and update these imports */
/* TODO: move tier1-icons.js out of here and figure out correct path for it */
/* TODO: check to make sure nothing was missed */

export class D2LButtonSubtle extends D2LButtonMixin(LitElement) {

	static get properties() {
		return {
			hAlign: { type: String, reflect: true, attribute: 'h-align' },
			icon: { type: String, reflect: true },
			iconRight: { type: Boolean, reflect: true, attribute: 'icon-right' },
			text: { type: String, reflect: true }
		};
	}

	static get styles() {
		return [ labelStyles, buttonSharedStyles, buttonSubtleStyles ];
	}

	render() {
		return html`
			<button
				aria-expanded="${ifDefined(this.ariaExpanded)}"
				aria-haspopup="${ifDefined(this.ariaHaspopup)}"
				aria-label="${ifDefined(this.ariaLabel)}"
				?autofocus="${ifDefined(this.autofocus)}"
				class="d2l-label-text"
				?disabled="${this.disabled}"
				form="${ifDefined(this.form)}"
				formaction="${ifDefined(this.formaction)}"
				formenctype="${ifDefined(this.formenctype)}"
				formmethod="${ifDefined(this.formmethod)}"
				formnovalidate="${ifDefined(this.formnovalidate)}"
				formtarget="${ifDefined(this.formtarget)}"
				name="${ifDefined(this.name)}"
				type="${this.type}">
				<d2l-icon icon="${ifDefined(this.icon)}" class="d2l-button-subtle-icon"></d2l-icon>
				<span class="d2l-button-subtle-content">${this.text}</span>
				<slot></slot>
		</button>
		`;
	}

}

customElements.define('d2l-button-subtle', D2LButtonSubtle);
