import '../button/button-icon.js';
import '../loading-spinner/loading-spinner.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { AsyncContainerMixin } from '../../mixins/async-container/async-container-mixin.js';
import { DialogMixin } from './dialog-mixin.js';
import { dialogStyles } from './dialog-styles.js';
import { getUniqueId } from '../../helpers/uniqueId.js';
import { heading3Styles } from '../typography/styles.js';
import { LocalizeStaticMixin } from '../../mixins/localize-static-mixin.js';

class Dialog extends LocalizeStaticMixin(AsyncContainerMixin(DialogMixin(LitElement))) {

	static get properties() {
		return {
			async: { type: Boolean },
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

			.d2l-dialog-content > div {
				/* required to properly calculate preferred height when there are bottom
				margins at the end of the slotted content */
				border-bottom: 1px solid transparent;
			}

			.d2l-dialog-content-loading {
				text-align: center;
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

	static get resources() {
		return {
			'ar': { close: 'إغلاق مربع الحوار هذا' },
			'da': { close: 'Luk denne dialogboks' },
			'de': { close: 'Dieses Dialogfeld schließen' },
			'en': { close: 'Close this dialog' },
			'es': { close: 'Cerrar este cuadro de diálogo' },
			'fr': { close: 'Fermer cette boîte de dialogue' },
			'ja': { close: 'このダイアログを閉じる' },
			'ko': { close: '이 대화 상자 닫기' },
			'nl': { close: 'Dit dialoogvenster sluiten' },
			'pt': { close: 'Fechar esta caixa de diálogo' },
			'sv': { close: 'Stäng dialogrutan' },
			'tr': { close: 'Bu iletişim kutusunu kapat' },
			'tr-tr': { close: 'Bu diyalog kutusunu kapat' },
			'zh': { close: '关闭此对话框' },
			'zh-cn': { close: '关闭此对话' },
			'zh-tw': { close: '關閉此對話方塊' }
		};
	}

	constructor() {
		super();
		this.width = 600;
	}

	render() {

		let content;
		if (this.async && this.asyncState !== 'complete') {
			content = html`
				<div class="d2l-dialog-content-loading">
					<d2l-loading-spinner size="100"></d2l-loading-spinner>
				</div>
				<div style="display: none;"><slot></slot></div>
			`;
		} else {
			content = html`<div><slot></slot></div>`;
		}

		const loadingSpinner = (this.async && this.asyncState !== 'complete')
			? html`<div class="d2l-dialog-content-loading"><d2l-loading-spinner size="100"></d2l-loading-spinner></div>` : null;

		if (!this._titleId) this._titleId = getUniqueId();
		const inner = html`
			<div class="d2l-dialog-inner">
				<div class="d2l-dialog-header">
					<div>
						<h2 id="${this._titleId}" class="d2l-heading-3">${this.titleText}</h2>
						<d2l-button-icon icon="d2l-tier1:close-small" text="${this.localize('close')}" @click="${this._abort}"></d2l-button-icon>
					</div>
				</div>
				<div class="d2l-dialog-content">${content}</div>
				<div class="d2l-dialog-footer">
					<slot name="footer"></slot>
				</div>
			</div>
		`;
		return this._render(
			inner,
			{ labelId: this._titleId, role: 'dialog' }
		);
	}

	updated(changedProperties) {
		if (!changedProperties.has('asyncState')) return;
		if (this.asyncState === 'complete') {
			this.resize();
		}
	}

	asyncContainer() {
		return this.shadowRoot.querySelector('.d2l-dialog-content');
	}

	_abort() {
		this._close('abort');
	}

}

customElements.define('d2l-dialog', Dialog);
