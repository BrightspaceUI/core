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
				margin: 0.6rem 0;
				cursor: pointer;
			}
			input[type="checkbox"].d2l-input-checkbox[disabled] {
				cursor: default;
			}
			.d2l-select-action {
				flex-grow: 1;
				padding: 0.6rem 0 0 0.5rem;
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
			${this._renderSelectAction(html`<slot></slot>`)}
		`;
	}
}

customElements.define('d2l-selectable-item', SelectableItem);
