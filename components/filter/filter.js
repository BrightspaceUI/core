import '../button/button-subtle.js';
import '../dropdown/dropdown-button-subtle.js';
import '../dropdown/dropdown-menu.js';
import '../menu/menu.js';
import '../menu/menu-item.js';

import { css, html, LitElement } from 'lit-element/lit-element.js';
import { LocalizeCoreElement } from '../../lang/localize-core-element.js';
import { RtlMixin } from '../../mixins/rtl-mixin.js';

/**
 * To Do
 */
class Filter extends LocalizeCoreElement(RtlMixin(LitElement)) {

	static get properties() {
		return {
			disabled: { type: String, reflect: true },
			_activeDimension: { type: Object },
			_dimensions : { type: Array }
		};
	}

	static get styles() {
		return [css`
			div[slot="header"] {
				padding: 18px 6px 18px;
				position: relative;
			}
		`];
	}

	constructor() {
		super();
		this.disabled = false;
		this._dimensions = [];
	}

	firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);

		this._dimensionSlot = this.shadowRoot.querySelector('slot');
	}

	render() {
		const header = this._activeDimension ?
			this._activeDimension.renderHeader() :
			html`<d2l-button-subtle text="Clear All"></d2l-button-subtle>`;

		const dimensions = this._getDimensions();

		return html`
			<d2l-dropdown-button-subtle
				text="Filter"
				?disabled="${this.disabled}">
				<d2l-dropdown-menu min-width="300" no-padding-header>
					<div slot="header">${header}</div>
					<d2l-menu label="Filter">
						<slot @d2l-filter-dimension-hide="${this._onHideDimension}" @d2l-filter-dimension-show="${this._onShowDimension}" @slotchange="${this._handleSlotChange}"></slot>
						${dimensions}
					</d2l-menu>
				</d2l-dropdown-menu>
			</d2l-dropdown-button-subtle>
		`;
	}

	_getDimensions() {
		return this._dimensions.map(dimension => {
			return html`<d2l-menu-item text="${dimension.name}">
				${dimension.renderItems()}
			</d2l-menu-item>`;
		});
	}

	_getSlotItems() {
		const nodes = this._dimensionSlot.assignedNodes();
		const filteredNodes = nodes.filter((node) => {
			const isNode = node.nodeType === Node.ELEMENT_NODE && node.tagName.toLowerCase() !== 'template';
			return isNode;
		});

		return filteredNodes;
	}

	_handleSlotChange() {
		this._dimensions = this._getSlotItems();
	}

	_onHideDimension(e) {
		this.shadowRoot.querySelector(`#${e.detail.dimension.name}`).hide();
		this._activeDimension = null;
	}

	_onShowDimension(e) {
		this._activeDimension = e.detail.dimension;
	}

}

customElements.define('d2l-filter', Filter);
