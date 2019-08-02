import '../button/button-icon.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { DialogMixin } from './dialog-mixin.js';
import { dialogStyles } from './dialog-styles.js';
import { getUniqueId } from '../../helpers/uniqueId.js';
import { heading3Styles } from '../typography/styles.js';

class Dialog extends DialogMixin(LitElement) {

	static get properties() {
		return {
		};
	}

	static get styles() {
		return [ dialogStyles, heading3Styles,
			css``
		];
	}

	constructor() {
		super();
		this.width = 600;
		this._labelId = getUniqueId();
	}

	render() {
		const inner = html`
			<div class="d2l-dialog-inner">
				<div class="d2l-dialog-header">
					<h2 id="${this._labelId}" class="d2l-heading-3">${this.title}</h2>
					<d2l-button-icon icon="d2l-tier1:close-small" text="Close this dialog" @click="${this._close}"></d2l-button-icon>
				</div>
				<div class="d2l-dialog-content"><slot></slot></div>
				<div class="d2l-dialog-footer"><slot name="footer"></slot></div>
			</div>
		`;
		return html`${this._hasNativeDialog ?
			html`<dialog aria-labelledby="${this._labelId}" class="d2l-dialog" @close="${this._handleClose}">${inner}</dialog>` :
			html`<div role="dialog" aria-labelledby="${this._labelId}" class="d2l-dialog">${inner}</div>`}
		`;
	}

}

customElements.define('d2l-dialog', Dialog);
