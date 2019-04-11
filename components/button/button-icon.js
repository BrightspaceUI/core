import 'd2l-icons/d2l-icon.js';
import 'd2l-icons/tier1-icons.js';
import { html, LitElement } from 'lit-element/lit-element.js';
import { ButtonMixin } from './button-mixin.js';
import { buttonSharedStyles } from './button-shared-styles.js';
import { buttonIconStyles } from './button-icon-styles.js';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { RtlMixin } from '../localize/rtl-mixin.js';

class ButtonIcon extends ButtonMixin(RtlMixin(LitElement)) {

	static get properties() {
		return {
			hAlign: { type: String, reflect: true, attribute: 'h-align' },
			icon: { type: String, reflect: true },
			text: { type: String, reflect: true },
			translucent: { type: Boolean, reflect: true }
		};
	}

	static get styles() {
		return [ buttonSharedStyles, buttonIconStyles ];
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
				title="${ifDefined(this.text)}"
				type="${this.type}">
				<d2l-icon icon="${ifDefined(this.icon)}" class="d2l-button-icon"></d2l-icon>
		</button>
		`;
	}

}

customElements.define('d2l-button-icon', ButtonIcon);
