import '../menu/menu.js';
import '../button/button-icon.js';
import '../button/button-subtle.js';
import '../dropdown/dropdown-button-subtle.js';
import '../dropdown/dropdown-menu.js';
import '../inputs/input-search.js';

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
			_currentChildView: { type: Object }
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
		const header = this._currentChildView ?
			html`
				<div class="back">
					<d2l-button-icon @click="${this._currentChildView.hide}" icon="tier1:chevron-left" text="Back"></d2l-button-icon>
					<div class="header d2l-body-standard">${this._currentChildView.text}</div>
				</div>
				<div class="header-container">
					<d2l-button-subtle text="Clear"></d2l-button-subtle>
					<d2l-input-search label="Search" placeholder="Search ${this._currentChildView.text}"></d2l-input-search>
				</div>
			` :
			html`<d2l-button-subtle text="Clear All"></d2l-button-subtle>`;

		return html`
			<d2l-dropdown-button-subtle
				text="Filter"
				?disabled="${this.disabled}">
				<d2l-dropdown-menu min-width="300" no-padding-header>
					<div slot="header">${header}</div>
					<d2l-menu @d2l-hierarchical-view-hide-start=${this._onHideChildView} @d2l-hierarchical-view-show-start=${this._onShowChildView} label="Filter">
						<slot></slot>
					</d2l-menu>
				</d2l-dropdown-menu>
			</d2l-dropdown-button-subtle>
		`;
	}

	_onHideChildView() {
		this._currentChildView = null;
	}

	_onShowChildView(e) {
		this._currentChildView = {
			text: e.target.text,
			hide: e.detail.sourceView.hide.bind(e.detail.sourceView)
		};
	}

}

customElements.define('d2l-filter', Filter);
