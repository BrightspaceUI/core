import { html, LitElement } from 'lit-element/lit-element.js';
import { DialogMixin } from './dialog-mixin.js';
import { dialogStyles } from './dialog-styles.js';
import { getUniqueId } from '../../helpers/uniqueId.js';
import { heading3Styles } from '../typography/styles.js';

class DialogConfirm extends DialogMixin(LitElement) {

	static get properties() {
		return {
			text: { type: String }
		};
	}

	static get styles() {
		return [ dialogStyles, heading3Styles ];
	}

	constructor() {
		super();
		this.width = 420; /* max */
	}

	render() {
		if (!this._titleId) this._titleId = getUniqueId();
		if (!this._textId) this._textId = getUniqueId();

		const inner = html`
			<div class="d2l-dialog-inner">
				${this.title ? html`
					<div class="d2l-dialog-header">
						<h2 id="${this._titleId}" class="d2l-heading-3">${this.title}</h2>
					</div>` : null}
				<div id="${this._textId}" class="d2l-dialog-content">${this.text}</div>
				<div class="d2l-dialog-footer"><slot name="footer"></slot></div>
			</div>`;

		const labelId = (this.title && this.text) ? this._titleId : this._textId;
		const descriptionId = (this.title && this.text) ? this._textId : null;
		return this._render(labelId, descriptionId, inner);
	}

}

customElements.define('d2l-dialog-confirm', DialogConfirm);
