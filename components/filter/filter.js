import '../button/button-icon.js';
import '../button/button-subtle.js';
import '../dropdown/dropdown-button-subtle.js';
import '../dropdown/dropdown-menu.js';
import '../inputs/input-search.js';
import '../menu/menu.js';

import { css, html, LitElement } from 'lit-element/lit-element.js';
import { bodyStandardStyles } from '../typography/styles.js';
import { LocalizeCoreElement } from '../../lang/localize-core-element.js';
import { RtlMixin } from '../../mixins/rtl-mixin.js';

/**
 * To Do
 */
class Filter extends LocalizeCoreElement(RtlMixin(LitElement)) {

	static get properties() {
		return {
			disabled: { type: String, reflect: true },
			_activeDimension: { type: Object }
		};
	}

	static get styles() {
		return [bodyStandardStyles, css`
			div[slot="header"] {
				padding: 18px 6px 18px;
				position: relative;
			}
			d2l-input-search {
				padding-right: 12px;
			}
			.back {
				display: flex;
				padding-bottom: 18px;
			}
			.header {
				display: flex;
				width: 100%;
				align-self: center;
				justify-content: center;
    			padding-right: 42px;
			}
			.header-container {
				display: flex;
			}
			.header-container d2l-button-subtle {
				padding-right: 6px;;
			}
		`];
	}

	constructor() {
		super();
		this.disabled = false;
	}

	render() {
		const header = this._activeDimension ?
			html`
				<div class="back">
					<d2l-button-icon @click="${this._onHideDimension}" icon="tier1:chevron-left" text="Back"></d2l-button-icon>
					<div class="header d2l-body-standard">${this._activeDimension.name}</div>
				</div>
				<div class="header-container">
					<d2l-button-subtle text="Clear"></d2l-button-subtle>
					<d2l-input-search label="Search" placeholder="Search ${this._activeDimension.name}"></d2l-input-search>
				</div>
			` :
			html`<d2l-button-subtle text="Clear All"></d2l-button-subtle>`;

		return html`
			<d2l-dropdown-button-subtle
				text="Filter"
				?disabled="${this.disabled}">
				<d2l-dropdown-menu min-width="300" no-padding-header>
					<div slot="header">${header}</div>
					<d2l-menu label="Filter">
						<slot @d2l-filter-dimension-show="${this._onShowDimension}"></slot>
					</d2l-menu>
				</d2l-dropdown-menu>
			</d2l-dropdown-button-subtle>
		`;
	}

	giveMeHierarchicalView() {
		return this.shadowRoot.querySelector('d2l-menu');
	}

	_onHideDimension() {
		this._activeDimension.hide();
		this._activeDimension = null;
	}

	_onShowDimension(e) {
		this._activeDimension = e.detail.dimension;
	}

}

customElements.define('d2l-filter', Filter);
