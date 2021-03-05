import '../../components/button/button-icon.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { VisibilityMixin } from '../visibility-mixin.js';

export class VisibilityTestItem extends VisibilityMixin(LitElement) {

	static get properties() {
		return {
			number: { type: Number, reflect: true }
		};
	}

	static get styles() {
		return css`
			:host {
				align-items: center;
				border-bottom: 1px solid #cccccc;
				display: flex;
				margin-bottom: 10px;
				padding: 0 10px 10px 10px;
			}
			span {
				flex: 1 0 auto;
			}
			d2l-button-icon {
				flex: 0 0 auto;
			}
		`;
	}

	render() {
		return html`<span>Item ${this.number}</span>
			<d2l-button-icon icon="tier1:delete" text="Remove" @click="${this._remove}"></d2l-button-icon>`;
	}

	_remove() {
		this.dispatchEvent(
			new CustomEvent('d2l-visibility-test-item-remove', {
				bubbles: false,
				composed: false
			})
		);
	}
}

customElements.define('d2l-visibility-test-item', VisibilityTestItem);
