import { css, html, LitElement } from 'lit-element/lit-element.js';
import { getUniqueId } from '../../../helpers/uniqueId.js';
import { SelectableMixin } from '../selectable-mixin.js';

class SelectableItem extends SelectableMixin(LitElement) {

	static get styles() {
		return [ super.styles, css`
			:host {
				position: relative;
				display:flex;
			}
			input[type="checkbox"].d2l-input-checkbox {
				margin-right: 0.6rem;
			}
			.d2l-select-action {
				position: absolute;
				width: 100%;
				padding-left: 0.9rem;

			}
		`];
	}

	constructor() {
		super();
		this.key = getUniqueId();
	}

	render() {
		return html`
			${this._renderCheckbox()}
			<slot></slot>
			${this._renderSelectAction()}
		`;
	}
}

customElements.define('d2l-selectable-item', SelectableItem);
