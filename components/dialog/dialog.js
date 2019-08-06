import '../button/button-icon.js';
import { html, LitElement } from 'lit-element/lit-element.js';
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
		return [ dialogStyles, heading3Styles ];
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
					<h2 id="${this._titleId}" class="d2l-heading-3">${this.title}</h2>
					<d2l-button-icon icon="d2l-tier1:close-small" text="Close this dialog" @click="${this._close}"></d2l-button-icon>
				</div>
				<div class="d2l-dialog-content"><slot></slot></div>
				<div class="d2l-dialog-footer"><slot name="footer"></slot></div>
			</div>
		`;
		return this._render(this._titleId, undefined, inner);
	}

}

customElements.define('d2l-dialog', Dialog);
