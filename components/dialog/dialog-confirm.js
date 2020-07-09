import { css, html, LitElement } from 'lit-element/lit-element.js';
import { DialogMixin } from './dialog-mixin.js';
import { dialogStyles } from './dialog-styles.js';
import { getUniqueId } from '../../helpers/uniqueId.js';
import { heading3Styles } from '../typography/styles.js';

/**
 * A simple confirmation dialog for prompting the user. Apply the "data-dialog-action" attribute to workflow buttons to automatically close the confirm dialog with the action value.
 * @slot footer - Slot for footer content such as workflow buttons
 * @fires d2l-dialog-open - Dispatched when the dialog is opened
 * @fires d2l-dialog-close - Dispatched with the action value when the dialog is closed for any reason
 */
class DialogConfirm extends DialogMixin(LitElement) {

	static get properties() {
		return {
			/**
			 * REQUIRED: The text content for the confirmation dialog
			 */
			text: { type: String }
		};
	}

	static get styles() {
		return [ dialogStyles, heading3Styles, css`

			.d2l-dialog-outer {
				max-width: 420px;
			}

			.d2l-dialog-content > div {
				padding-top: 30px;
			}

			.d2l-dialog-header + .d2l-dialog-content > div {
				padding-top: 0;
			}

			@media (max-width: 615px) {

				.d2l-dialog-outer {
					bottom: 0;
					margin: auto;
					top: 0;
				}

				.d2l-dialog-content > div {
					padding-top: 20px;
				}

			}

		`];
	}

	render() {
		if (!this._titleId) this._titleId = getUniqueId();
		if (!this._textId) this._textId = getUniqueId();

		const inner = html`
			<div class="d2l-dialog-inner">
				${this.titleText ? html`
					<div class="d2l-dialog-header">
						<div><h2 id="${this._titleId}" class="d2l-heading-3">${this.titleText}</h2></div>
					</div>` : null}
				<div id="${this._textId}" class="d2l-dialog-content">
					<div>${this.text}</div>
				</div>
				<div class="d2l-dialog-footer">
					<slot name="footer" class="d2l-dialog-footer-slot"></slot>
				</div>
			</div>`;

		const labelId = (this.titleText && this.text) ? this._titleId : this._textId;
		const descId = (this.titleText && this.text) ? this._textId : undefined;
		return this._render(
			inner,
			{ labelId: labelId, descId: descId, role: 'alertdialog' }
		);
	}

	_focusInitial() {
		const footer = this.shadowRoot.querySelector('.d2l-dialog-footer-slot');
		const nodes = footer.assignedNodes();
		for (let i = 0; i < nodes.length; i++) {
			const node = nodes[i];
			if (node.nodeType !== Node.ELEMENT_NODE) continue;
			if (!node.hasAttribute('primary')) {
				node.focus();
				return;
			}
		}
		this._focusFirst();
	}

	_getWidth() {
		/* override default width measurement and just use max-width */
	}

}

customElements.define('d2l-dialog-confirm', DialogConfirm);
