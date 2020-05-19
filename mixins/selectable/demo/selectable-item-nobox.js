import { css, html, LitElement } from 'lit-element/lit-element.js';
import { getUniqueId } from '../../../helpers/uniqueId.js';
import { SelectableMixin } from '../selectable-mixin.js';

class SelectableItemNobox extends SelectableMixin(LitElement) {

	static get styles() {
		return [ super.styles, css`
		.d2l-select-action {
			padding: 0.6rem 0.4rem;
		}
		.d2l-select-action:hover {
			background: #E8F8FF;
		}
		:host([selected]) .d2l-select-action {
			border-left: 5px solid #29A6FF;
		}
		`];
	}

	constructor() {
		super();
		this.key = getUniqueId();
	}

	render() {
		return html`
			${this._renderSelectAction(html`<slot></slot>`)}
		`;
	}
}

customElements.define('d2l-selectable-item-nobox', SelectableItemNobox);
