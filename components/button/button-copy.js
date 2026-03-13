import './button-icon.js';
import { css, html, LitElement } from 'lit';
import { ButtonCopyMixin } from './button-copy-mixin.js';
import { FocusMixin } from '../../mixins/focus/focus-mixin.js';

/**
 * A button component that copies to the clipboard.
 */
class ButtonCopy extends FocusMixin(ButtonCopyMixin(LitElement)) {

	static get properties() {
		return {
			/**
			 * Description of the content being copied to clipboard
			 * @type {string}
			 */
			text: { type: String },
		};
	}

	static get styles() {
		return css`
			:host {
				display: inline-block;
			}
			:host([hidden]) {
				display: none;
			}
		`;
	}

	static get focusElementSelector() {
		return 'd2l-button-icon';
	}

	render() {
		return html`
			<d2l-button-icon
				?disabled="${this.disabled}"
				icon="${this._recentCopySuccessful ? 'tier1:check' : 'tier1:copy'}"
				text="${this.text ?? this.localize('intl-common:actions:copy')}"
				@click="${this._handleClick}">
			</d2l-button-icon>
			${this._renderToast()}
		`;
	}

}

customElements.define('d2l-button-copy', ButtonCopy);
