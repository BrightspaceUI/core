import '../list-item-content.js';
import '../list-item.js';
import '../list.js';
import '../list-controls.js';
import '../../selection/selection-action.js';
import { html, LitElement, nothing } from 'lit';
import { getUniqueId } from '../../../helpers/uniqueId.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { repeat } from 'lit/directives/repeat.js';

class ListDemoNestedLazyLoad extends LitElement {

	static get properties() {
		return {
			_items: { state: true },
		};
	}

	constructor() {
		super();
		this._items = new Map();
		this._items.set('a', {
			key: 'a',
			primaryText: 'Item 1: Click Expand To Lazy Load Item',
			items: [],
			expandable: true,
			selected: false
		});
		this._items.set('b', {
			key: 'b',
			primaryText: 'Item 2: Click Expand To Lazy Load Item',
			items: [],
			expandable: true,
			selected: false
		});
	}

	render() {
		return html`
			<div>
				${this._renderList(this._items.values(), false, true)}
			</div>
		`;
	}

	_handleListItemToggle(e) {
		const listItem = e.target;
		const itemKey = e.target.key;
		const previouslyCollapsed = !e.target.expanded;
		const itemToAddChildren = this._items.get(itemKey);
		if (!previouslyCollapsed && itemToAddChildren.items.length === 0) {
			if (listItem.selected) {
				itemToAddChildren.selected = true;
			}
			const uniqueId = getUniqueId();
			itemToAddChildren.items = [{
				key: uniqueId,
				primaryText: `Lazy Loaded Item ${uniqueId}`,
				items: [],
				expandable: false,
				selected: listItem.selected
			}];

			setTimeout(() => {
				// fake lazy loading items
				this._items.set(itemKey, itemToAddChildren);
				this.requestUpdate();
			}, 2000);
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

	_renderList(items, nested, includeHeader = false) {
		return html`
			<d2l-list grid drag-multiple slot="${ifDefined(nested ? 'nested' : undefined)}">
				${ includeHeader ? this._renderListControls() : nothing }
				${repeat(items, item => item.key, item => html`
					${this._renderListItem(item)}
				`)}
			</d2l-list>
		`;
	}

	_renderListControls() {
		return html`
			<d2l-list-controls slot="controls">
				<d2l-selection-action icon="tier1:bookmark-hollow" text="Bookmark" requires-selection></d2l-selection-action>
				<d2l-selection-action icon="tier1:gear" text="Settings"></d2l-selection-action>
			</d2l-list-controls>
		`;
	}

	_renderListItem(item) {
		return html`
			<d2l-list-item
				draggable
				selectable
				?selected="${item.selected}"
				drag-handle-text="${item.primaryText}"
				key="${item.key}"
				label="${item.primaryText}"
				?expandable="${item.expandable}"
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
