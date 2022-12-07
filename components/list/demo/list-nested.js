import '../list-item-content.js';
import '../list-item.js';
import '../list.js';
import '../../dropdown/dropdown-menu.js';
import '../../dropdown/dropdown-more.js';
import '../../menu/menu.js';
import '../../menu/menu-item.js';
import '../list-header.js';
import '../../selection/selection-action.js';
import { css, html, LitElement, nothing } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { listDemos } from './list-demo-scenarios.js';
import { moveLocations } from '../list-item-drag-drop-mixin.js';
import { repeat } from 'lit/directives/repeat.js';

class ListDemoNested extends LitElement {

	static get properties() {
		return {
			demoItemKey: { type: String, attribute: 'demo-item-key' },
			draggable: { type: Boolean },
			selectable: { type: Boolean },
			expandable: { type: Boolean },
			expanded: { type: Boolean },
			includeSecondaryActions: { type: Boolean, attribute: 'include-secondary-actions' },
			includeListHeader: { type: Boolean, attribute: 'include-list-header' },
			includeActionHref: { type: Boolean, attribute: 'include-action-href' },
			_items: { state: true }
		};
	}

	static get styles() {
		return [
			css`
				.secondary-actions {
					padding-right: 6px;
				}
			`
		];
	}

	constructor() {
		super();
		this._items = [];
	}

	render() {
		return html`
			<div @d2l-list-items-move="${this._handleListItemsMove}">
				${this._renderList(this._items, false, this.includeListHeader)}
			</div>
		`;
	}

	updated(changedProperties) {
		super.updated(changedProperties);
		if (changedProperties.has('demoItemKey')) {
			this._items = listDemos[this.demoItemKey] ?? [];
		}
	}

	async _handleListItemsMove(e) {

		const sourceListItems = e.detail.sourceItems;
		const target = e.detail.target;

		// helper that gets the array containing item data, the item data, and the index within the array
		const getItemInfo = (items, key) => {
			for (let i = 0; i < items.length; i++) {
				if (items[i].key === key) {
					return { owner: items, item: items[i], index: i };
				}
				if (items[i].items && items[i].items.length > 0) {
					const tempItemData = getItemInfo(items[i].items, key);
					if (tempItemData) return tempItemData;
				}
			}
		};

		const dataToMove = [];

		// remove data elements from original locations
		sourceListItems.forEach(sourceListItem => {
			const info = getItemInfo(this._items, sourceListItem.key);
			info.owner.splice(info.index, 1);
			dataToMove.push(info.item);
		});

		// append data elements to new location
		const targetInfo = getItemInfo(this._items, target.item.key);
		let targetItems;
		let targetIndex;
		if (target.location === moveLocations.nest) {
			if (!targetInfo.item.items) targetInfo.item.items = [];
			targetItems = targetInfo.item.items;
			targetIndex = targetItems.length;
		} else {
			targetItems = targetInfo.owner;
			if (target.location === moveLocations.above) targetIndex = targetInfo.index;
			else if (target.location === moveLocations.below) targetIndex = targetInfo.index + 1;
		}
		for (let i = dataToMove.length - 1; i >= 0; i--) {
			targetItems.splice(targetIndex, 0, dataToMove[i]);
		}

		this.requestUpdate();
		await this.updateComplete;

		if (e.detail.keyboardActive) {
			setTimeout(() => {
				if (!this.shadowRoot) return;
				const newItem = this.shadowRoot.querySelector('d2l-list').getListItemByKey(sourceListItems[0].key);
				newItem.activateDragHandle();
			});
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
				${ includeHeader ? this._renderListHeader() : nothing }
				${repeat(items, item => item.key, item => html`
					<d2l-list-item
						action-href="${this.includeActionHref ? 'http://www.d2l.com' : ''}"
						?draggable="${this.draggable}"
						drag-handle-text="${item.primaryText}"
						?drop-nested="${item.dropNested}"
						key="${item.key}"
						label="${item.primaryText}"
						?selectable="${this.selectable}"
						?expandable="${this.expandable}"
						?expanded="${this.expanded}">
							${this._renderIllustration(item)}
							${this._renderItemContent(item)}
							${this._renderSecondaryActions()}
							${this._renderNestedList(item)}
					</d2l-list-item>
				`)}
			</d2l-list>
		`;
	}

	_renderListHeader() {
		return html`
			<d2l-list-header slot="header">
				<d2l-selection-action icon="tier1:bookmark-hollow" text="Bookmark" requires-selection></d2l-selection-action>
				<d2l-selection-action icon="tier1:gear" text="Settings"></d2l-selection-action>
			</d2l-list-header>
		`;
	}

	_renderNestedList(item) {
		if (item?.items?.length <= 0) {
			return nothing;
		}
		return this._renderList(item.items, true);
	}

	_renderSecondaryActions() {
		if (!this.includeSecondaryActions) {
			return nothing;
		}
		return html`
			<div slot="actions" class="secondary-actions">
				<d2l-dropdown-more text="Open!">
					<d2l-dropdown-menu>
						<d2l-menu label="More Actions">
							<d2l-menu-item text="Action 1"></d2l-menu-item>
							<d2l-menu-item text="Action 2"></d2l-menu-item>
						</d2l-menu>
					</d2l-dropdown-menu>
				</d2l-dropdown-more>
			</div>
		`;
	}

}

customElements.define('d2l-demo-list-nested', ListDemoNested);
