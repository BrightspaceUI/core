import '../list.js';
import './custom-nav-item.js';
import '../../tooltip/tooltip-help.js';
import { css, html, LitElement, nothing } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { listDemos } from './list-demo-scenarios.js';
import { repeat } from 'lit/directives/repeat.js';

class CustomNavList extends (LitElement) {

	static get properties() {
		return {
			_currentItem: { state: true }
		};
	}

	static get styles() {
		return css`
			d2l-list {
				max-width: 334px;
			}
		`;
	}

	constructor() {
		super();

		this._currentItem = undefined;
	}

	render() {
		return html`
			<div>
				${this._renderList(listDemos['primaryTextOnlyDeepNesting'], false)}
			</div>
		`;
	}

	async _handleButtonClick(e) {
		this.shadowRoot.querySelectorAll('d2l-list-item-custom-nav-item[current]').forEach(item => {
			item.current = undefined;
		});

		this._currentItem = e.target.key;
	}

	_renderItemContent(item) {
		return html`
			<div>
				<div>${item.primaryText}</div>
				<div slot="supporting-info">${item.supportingText}</div>
				<div slot="secondary">
					<d2l-tooltip-help text="Available Jan 4, 2025">Due Jan 20, 2025</d2l-tooltip-help>
				</div>
			</div>`;
	}

	_renderList(items, nested) {
		return html`
			<d2l-list
				@d2l-list-item-button-click="${this._handleButtonClick}"
				grid
				slot="${ifDefined(nested ? 'nested' : undefined)}">
				${repeat(items, item => item.key, item => html`
					${this._renderListItem(item)}
				`)}
			</d2l-list>
		`;
	}

	_renderListItem(item) {
		const hasChildren = item?.items?.length > 0;
		return html`
			<d2l-list-item-custom-nav-item
				color="#006fbf"
				key="${item.key}"
				label="${item.primaryText}"
				current="${ifDefined(this._currentItem === item.key) ? 'page' : undefined}"
				?expandable="${hasChildren}"
				expanded>
					${this._renderItemContent(item)}
					${this._renderNestedList(item)}
			</d2l-list-item-custom-nav-item>
		`;
	}

	_renderNestedList(item) {
		if (item?.items?.length <= 0) {
			return nothing;
		}
		return this._renderList(item.items, true);
	}

}

customElements.define('d2l-custom-nav-list', CustomNavList);
