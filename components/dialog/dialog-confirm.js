import { css, html, LitElement } from 'lit-element/lit-element.js';
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
		`];
	}

	render() {
		if (!this._titleId) this._titleId = getUniqueId();
		if (!this._textId) this._textId = getUniqueId();

		const inner = html`
			<div class="d2l-dialog-inner">
				${this.title ? html`
					<div class="d2l-dialog-header">
						<div><h2 id="${this._titleId}" class="d2l-heading-3">${this.title}</h2></div>
					</div>` : null}
				<div id="${this._textId}" class="d2l-dialog-content">
					<div>${this.text}</div>
				</div>
				<div class="d2l-dialog-footer">
					<slot name="footer"></slot>
				</div>
			</div>`;

		const labelId = (this.title && this.text) ? this._titleId : this._textId;
		const descriptionId = (this.title && this.text) ? this._textId : null;
		return this._render(labelId, descriptionId, inner);
	}

	_getWidth() {
		/* override default width measurement and just use max-width */
	}

}

customElements.define('d2l-dialog-confirm', DialogConfirm);
