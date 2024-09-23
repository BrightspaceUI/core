import { _generateResetStyles, heading3Styles } from '../typography/styles.js';
import { css, html, LitElement, nothing } from 'lit';
import { DialogMixin } from './dialog-mixin.js';
import { dialogStyles } from './dialog-styles.js';
import { getUniqueId } from '../../helpers/uniqueId.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { LocalizeCoreElement } from '../../helpers/localize-core-element.js';

/**
 * A simple confirmation dialog for prompting the user. Apply the "data-dialog-action" attribute to workflow buttons to automatically close the confirm dialog with the action value.
 * @fires d2l-dialog-before-close - Dispatched with the action value before the dialog is closed for any reason, providing an opportunity to prevent the dialog from closing
 * @slot footer - Slot for footer content such as workflow buttons
 */
class DialogConfirm extends LocalizeCoreElement(DialogMixin(LitElement)) {

	static get properties() {
		return {
			/**
			 * Whether the dialog should indicate that its message is important to the user
			 */
			critical: { type: Boolean },

			/**
			 * REQUIRED: The text content for the confirmation dialog. Newline characters (`&#10;` in HTML or `\n` in JavaScript) will render as multiple paragraphs.
			 * @type {string}
			 */
			text: { type: String }
		};
	}

	static get styles() {
		return [ _generateResetStyles(':host'), dialogStyles, heading3Styles, css`

			.d2l-dialog-outer {
				max-width: 420px;
			}

			.d2l-dialog-content > div {
				padding-top: 30px;
			}

			.d2l-dialog-header + .d2l-dialog-content > div {
				padding-top: 0;
			}

			.d2l-dialog-content p {
				margin: 1rem 0;
			}

			.d2l-dialog-content p:first-child {
				margin-top: 0;
			}

			.d2l-dialog-content p:last-child {
				margin-bottom: 0;
			}

			@media (max-width: 615px), (max-height: 420px) and (max-width: 900px) {

				dialog.d2l-dialog-outer,
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

	constructor() {
		super();
		this.critical = false;
		this._criticalLabelId = getUniqueId();
		this._textId = getUniqueId();
		this._titleId = getUniqueId();
	}

	render() {
		const contentTabIndex = !this.focusableContentElemPresent ? '0' : undefined;
		const inner = html`
			${this.critical ? html`<div id="${this._criticalLabelId}" hidden>${this.localize('components.dialog.critical')}</div>` : nothing}
			<div class="d2l-dialog-inner">
				${this.titleText ? html`
					<div class="d2l-dialog-header">
						<div><h2 id="${this._titleId}" class="d2l-heading-3">${this.titleText}</h2></div>
					</div>` : null}
				<div id="${this._textId}" class="d2l-dialog-content" tabindex="${ifDefined(contentTabIndex)}">
					<div>${this.text ? this.text.split('\n').map(line => html`<p>${line}</p>`) : null}</div>
				</div>
				<div class="d2l-dialog-footer">
					<slot name="footer" class="d2l-dialog-footer-slot"></slot>
				</div>
			</div>`;

		const labelId = (this.titleText && this.text) ? this._titleId : this._textId;
		const fullLabelId = this.critical ? `${this._criticalLabelId} ${labelId}` : labelId;
		const descId = (this.titleText && this.text) ? this._textId : undefined;
		return this._render(
			inner,
			{
				descId: descId,
				fullscreenMobile: false,
				labelId: fullLabelId,
				role: 'alertdialog'
			}
		);
	}

	_focusInitial() {
		if (!this.shadowRoot) return;
		const footer = this.shadowRoot.querySelector('.d2l-dialog-footer-slot');
		const nodes = footer.assignedNodes();
		for (let i = 0; i < nodes.length; i++) {
			const node = nodes[i];
			if (node.nodeType !== Node.ELEMENT_NODE) continue;
			if (!node.hasAttribute('primary')) {
				this._focusElemOrDescendant(node);
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
