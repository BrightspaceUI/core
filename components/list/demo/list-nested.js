import '../list-item-content.js';
import '../list-item.js';
import '../list.js';
import { html, LitElement, nothing } from 'lit';
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
			includeActionHref: { type: Boolean, attribute: 'include-action-href' },
			_items: { state: true }
		};
	}

	constructor() {
		super();
		this._items = [];
	}

	render() {
		const renderList = (items, nested) => {
			return html`
				<d2l-list grid drag-multiple slot="${ifDefined(nested ? 'nested' : undefined)}">
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
								${!item.imgSrc ? nothing : html`<img slot="illustration" src="${item.imgSrc}">`}
								<d2l-list-item-content>
									<div>${item.primaryText}</div>
									<div slot="supporting-info">${item.supportingText}</div>
								</d2l-list-item-content>
								${item?.items?.length > 0 ? renderList(item.items, true) : nothing}
						</d2l-list-item>
					`)}
				</d2l-list>
			`;
		};

		return html`
			<div @d2l-list-items-move="${this._handleListItemsMove}">
				${renderList(this._items, false)}
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

}

customElements.define('d2l-demo-list-nested', ListDemoNested);
