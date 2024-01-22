import '../list-item-content.js';
import '../list-item.js';
import '../list-item-button.js';
import '../list.js';
import '../../dropdown/dropdown-menu.js';
import '../../dropdown/dropdown-more.js';
import '../../menu/menu.js';
import '../../menu/menu-item.js';
import '../../paging/pager-load-more.js';
import '../list-controls.js';
import '../../selection/selection-action.js';
import { css, html, LitElement, nothing } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { listDemos } from './list-demo-scenarios.js';
import { moveLocations } from '../list-item-drag-drop-mixin.js';
import { repeat } from 'lit/directives/repeat.js';

class ListDemoNested extends LitElement {

	static get properties() {
		return {
			addButton: { type: Boolean, attribute: 'add-button' },
			demoItemKey: { type: String, attribute: 'demo-item-key' },
			isDraggable: { attribute: 'is-draggable', type: Boolean },
			selectable: { type: Boolean },
			disableExpandFeature: { type: Boolean, attribute: 'disable-expand-feature' },
			expanded: { type: Boolean },
			includeSecondaryActions: { type: Boolean, attribute: 'include-secondary-actions' },
			includeListControls: { type: Boolean, attribute: 'include-list-controls' },
			includeActionHref: { type: Boolean, attribute: 'include-action-href' },
			useButtonListItem: { type: Boolean, attribute: 'use-button-item' },
			showLoadMore: { type: Boolean, attribute: 'show-load-more' },
			noPrimaryAction: { type: Boolean, attribute: 'no-primary-action' },
			disableListGrid: { type: Boolean, attribute: 'disable-list-grid' },
			_items: { state: true },
			_loadedItems: { state: true },
			_remainingItemCount: { state: true },
			_lastItemLoadedIndex: { state: true }
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
		this._loadedItems = [];
		this._remainingItemCount = 0;
		this._lastItemLoadedIndex = 1;
		this._pageSize = 1;
	}

	render() {
		return html`
			<div @d2l-list-items-move="${this._handleListItemsMove}">
				${this._renderList(this._loadedItems, false, this.includeListControls, this.showLoadMore)}
			</div>
		`;
	}

	updated(changedProperties) {
		super.updated(changedProperties);
		if (changedProperties.has('demoItemKey')) {
			this._items = listDemos[this.demoItemKey] ?? [];
			this._loadedItems = this._items;
		}
		if (changedProperties.has('_items') || changedProperties.has('demoItemKey') || changedProperties.has('showLoadMore') || changedProperties.has('_lastItemLoadedIndex')) {
			this._loadedItems = this.showLoadMore ? this._items.slice(0, this._lastItemLoadedIndex + 1) : this._items;
			this._remainingItemCount = this.showLoadMore ? this._items.length - this._loadedItems.length : 0;
		}
	}

	_handleButtonClick(e) {
		// eslint-disable-next-line no-console
		console.log('d2l-list-item-button clicked!', e);
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
			if (info?.owner) {
				info.owner.splice(info.index, 1);
			}
			if (info?.item) {
				dataToMove.push(info.item);
			}
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
			targetItems = targetInfo?.owner;
			if (!targetItems) return;
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

	_handlePagerLoadMore(e) {
		// mock delay consumers might have
		setTimeout(() => {
			this._lastItemLoadedIndex += this._pageSize;
			e.detail.complete();
		}, 1000);
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

	_renderList(items, nested, includeControls = false, showLoadMore = false) {
		return html`
			<d2l-list
				?grid="${!this.disableListGrid}"
				drag-multiple slot="${ifDefined(nested ? 'nested' : undefined)}"
				item-count="${this._items.length}"
				?add-button="${this.addButton}">
				${ includeControls ? this._renderListControls() : nothing }
				${repeat(items, item => item.key, item => html`
					${this._renderListItem(item)}
					${this._renderListItemButton(item)}
				`)}
				${ showLoadMore ? this._renderShowLoadMore() : nothing }
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
		if (this.useButtonListItem) {
			return nothing;
		}
		const hasChildren = item?.items?.length > 0;
		return html`
			<d2l-list-item
				action-href="${this.includeActionHref ? 'http://www.d2l.com' : ''}"
				?draggable="${this.isDraggable}"
				drag-handle-text="${item.primaryText}"
				?drop-nested="${item.dropNested}"
				key="${item.key}"
				label="${item.primaryText}"
				?selectable="${this.selectable}"
				?expandable="${this.disableExpandFeature ? false : hasChildren}"
				?expanded="${this.expanded}"
				?no-primary-action="${this.noPrimaryAction}">
					${this._renderIllustration(item)}
					${this._renderItemContent(item)}
					${this._renderSecondaryActions()}
					${this._renderNestedList(item)}
			</d2l-list-item>
		`;
	}

	_renderListItemButton(item) {
		if (!this.useButtonListItem) {
			return nothing;
		}
		const hasChildren = item?.items?.length > 0;
		return html`
			<d2l-list-item-button
				?draggable="${this.isDraggable}"
				drag-handle-text="${item.primaryText}"
				?drop-nested="${item.dropNested}"
				key="${item.key}"
				label="${item.primaryText}"
				?selectable="${this.selectable}"
				?expandable="${this.disableExpandFeature ? false : hasChildren}"
				?expanded="${this.expanded}"
				@d2l-list-item-button-click="${this._handleButtonClick}">
					${this._renderIllustration(item)}
					${this._renderItemContent(item)}
					${this._renderSecondaryActions()}
					${this._renderNestedList(item)}
			</d2l-list-item-button>
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

	_renderShowLoadMore() {
		return html`
			<d2l-pager-load-more slot="pager"
				@d2l-pager-load-more="${this._handlePagerLoadMore}"
				?has-more="${this._lastItemLoadedIndex < this._items.length - 1}"
				page-size="${this._remainingItemCount < this._pageSize ? this._remainingItemCount : this._pageSize}">
			</d2l-pager-load-more>
		`;
	}

}

customElements.define('d2l-demo-list-nested', ListDemoNested);
