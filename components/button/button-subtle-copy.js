import './button-subtle.js';
import { html, LitElement } from 'lit';
import { ButtonCopyMixin } from './button-copy-mixin.js';
import { FocusMixin } from '../../mixins/focus/focus-mixin.js';

class ButtonSubtleCopy extends FocusMixin(ButtonCopyMixin(LitElement)) {
	static get properties() {
		return {
			/**
			 * ACCESSIBILITY: A description to be added to the button for accessibility when text on button does not provide enough context
			 * @type {string}
			 */
			description: { type: String },
			/**
			 * ACCESSIBILITY: REQUIRED: Text for the button
			 * @type {string}
			 */
			text: { type: String, reflect: true },
			/**
			 * Whether to render the slimmer version of the button
			 * @type {boolean}
			 */
			slim: { type: Boolean, reflect: true },
		};
	}

	static get focusElementSelector() {
		return 'd2l-button-subtle';
	}

	render() {
		return html`
			<d2l-button-subtle
				?slim="${this.slim}"
				?disabled="${this.disabled}"
				icon="${this._recentCopySuccessful ? 'tier1:check' : 'tier1:copy'}"
				text="${this.text}"
				description="${this.description}"
				@click="${this._handleClick}">
			</d2l-button-subtle>
			${this._renderToast()}
		`;
	}
}

customElements.define('d2l-button-subtle-copy', ButtonSubtleCopy);
