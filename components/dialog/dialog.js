import '../button/button-icon.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { DialogMixin } from './dialog-mixin.js';
import { dialogStyles } from './dialog-styles.js';
import { getUniqueId } from '../../helpers/uniqueId.js';
import { heading3Styles } from '../typography/styles.js';

class Dialog extends DialogMixin(LitElement) {

	static get properties() {
		return {
			width: { type: Number }
		};
	}

	static get styles() {
		return [ dialogStyles, heading3Styles, css`

			.d2l-dialog-header {
				padding-bottom: 15px;
			}

			.d2l-dialog-header > div > d2l-button-icon {
				flex: none;
				margin: -4px -15px 0 15px;
			}

			:host([dir="rtl"]) .d2l-dialog-header > div > d2l-button-icon {
				margin-left: -15px;
				margin-right: 15px;
			}

			@media (max-width: 615px) {

				.d2l-dialog-outer {
					height: calc(100% - 42px) !important;
					top: 42px;
					width: 100% !important;
				}

				div[nested].d2l-dialog-outer {
					top: 0;
				}

				.d2l-dialog-header > div > d2l-button-icon {
					margin: -8px -13px 0 15px;
				}

				:host([dir="rtl"]) .d2l-dialog-header > div > d2l-button-icon {
					margin-left: -13px;
					margin-right: 15px;
				}

			}

		`];
	}

	constructor() {
		super();
		this.width = 600;
	}

	render() {
		if (!this._titleId) this._titleId = getUniqueId();
		const inner = html`
			<div class="d2l-dialog-inner">
				<div class="d2l-dialog-header">
					<div>
						<h2 id="${this._titleId}" class="d2l-heading-3">${this.titleText}</h2>
						<d2l-button-icon icon="d2l-tier1:close-small" text="Close this dialog" @click="${this._close}"></d2l-button-icon>
					</div>
				</div>
				<div class="d2l-dialog-content">
					<div><slot></slot></div>
				</div>
				<div class="d2l-dialog-footer">
					<slot name="footer"></slot>
				</div>
			</div>
		`;
		return this._render(this._titleId, undefined, inner);
	}

}

customElements.define('d2l-dialog', Dialog);
