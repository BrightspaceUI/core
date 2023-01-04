import '../list-item-content.js';
import '../list-item.js';
import '../list.js';
import { html, LitElement, nothing } from 'lit';
import { getUniqueId } from '../../../helpers/uniqueId.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { listDemos } from './list-demo-scenarios.js';
import { repeat } from 'lit/directives/repeat.js';

class ListDemoNestedLazyLoad extends LitElement {

	static get properties() {
		return {
			demoItemKey: { type: String, attribute: 'demo-item-key' },
			_items: { state: true },
		};
	}

	constructor() {
		super();
		this._items = [];
	}

	render() {
		return html`
			<div>
				${this._renderList(this._items.values(), false)}
			</div>
		`;
	}

	updated(changedProperties) {
		super.updated(changedProperties);
		if (changedProperties.has('demoItemKey')) {
			const itemMap = new Map();
			const demoItems = listDemos[this.demoItemKey] ?? [];
			demoItems.forEach(element => {
				itemMap.set(element.key, element);
			});
			this._items = itemMap;
		}
	}

	_handleListItemToggle(e) {
		const listItem = e.path[0];
		const itemKey = e.detail.key;
		const itemToAddChildren = this._items.get(itemKey);
		if (listItem.expandCollapseOverride === 'closed' && itemToAddChildren.items.length === 0) {
			const uniqueId = getUniqueId();
			itemToAddChildren.items = [{
				key: uniqueId,
				primaryText: `Lazy Loaded Item ${uniqueId}`,
				items: []
			}];
			listItem.expandCollapseOverride = 'opened';
			setTimeout(() => {
				// fake lazy loading items
				this._items.set(itemKey, itemToAddChildren);
				this.requestUpdate();
			}, 2000);
		} else if (listItem.expandCollapseOverride === 'closed') {
			listItem.expandCollapseOverride = 'opened';
		} else if (listItem.expandCollapseOverride === 'opened') {
			listItem.expandCollapseOverride = 'closed';
		}
	}

	_renderIllustration(item) {
		if (!item.imgSrc) {
			return nothing;
		}
		return html`<img slot="illustration" src="${item.imgSrc}">`;
	}

	_renderItemContent(item) {
		return html`
			<d2l-list-item-content>
				<div>${item.primaryText}</div>
				<div slot="supporting-info">${item.supportingText}</div>
			</d2l-list-item-content>`;
	}

	_renderList(items, nested) {
		return html`
			<d2l-list grid drag-multiple slot="${ifDefined(nested ? 'nested' : undefined)}">
				${repeat(items, item => item.key, item => html`
					${this._renderListItem(item)}
				`)}
			</d2l-list>
		`;
	}

	_renderListItem(item) {
		return html`
			<d2l-list-item
				?draggable="${this.draggable}"
				drag-handle-text="${item.primaryText}"
				key="${item.key}"
				label="${item.primaryText}"
				expandable
				expand-collapse-override="${item.expandOverride || ''}"
				@d2l-list-item-expand-collapse-toggled="${this._handleListItemToggle}">
					${this._renderIllustration(item)}
					${this._renderItemContent(item)}
					${this._renderNestedList(item)}
			</d2l-list-item>
		`;
	}

	_renderNestedList(item) {
		if (item?.items?.length <= 0) {
			return nothing;
		}
		return this._renderList(item.items, true);
	}
}

customElements.define('d2l-demo-list-nested-lazy-load', ListDemoNestedLazyLoad);
