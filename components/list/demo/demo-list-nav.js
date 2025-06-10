import '../../icons/icon.js';
import '../list-item-content.js';
import '../list-item-nav.js';
import '../list.js';
import '../../tooltip/tooltip-help.js';
import { css, html, LitElement, nothing } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { listDemos } from './list-demo-scenarios.js';
import { moveLocations } from '../list-item-drag-drop-mixin.js';
import { repeat } from 'lit/directives/repeat.js';

class ListDemoNav extends LitElement {

	static get properties() {
		return {
			addButton: { type: Boolean, attribute: 'add-button' },
			_currentItem: { state: true }
		};
	}

	static get styles() {
		return [
			css`
				:host {
					display: block;
					max-width: 400px;
				}
				d2l-icon {
					margin-right: 0.7rem;
				}
				d2l-tooltip-help {
					padding: 5px;
				}
			`
		];
	}

	constructor() {
		super();
		this.addButton = false;
		this._currentItem = null;
	}

	render() {
		return html`
			<div @d2l-list-items-move="${this._handleListItemsMove}">
				<d2l-list 
					?add-button="${this.addButton}"
					grid 
					drag-multiple
					@d2l-list-item-link-click="${this._handleItemClick}">
					${repeat(this.#list, (item) => item.key, (item) => this._renderItem(item))}
				</d2l-list>
			</div>
		`;
	}

	#list = listDemos.nav;

	_handleItemClick(e) {
		if (!e.target.expandable) {
			this._currentItem = e.target;
			return;
		}

		if (this._currentItem !== e.target) {
			e.target.expanded = true;
			this._currentItem = e.target;
		} else {
			e.target.expanded = !e.target.expanded;
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
			const info = getItemInfo(this.#list, sourceListItem.key);
			if (info?.owner) {
				info.owner.splice(info.index, 1);
			}
			if (info?.item) {
				dataToMove.push(info.item);
			}
		});

		// append data elements to new location
		const targetInfo = getItemInfo(this.#list, target.item.key);
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

	_renderItem(item) {
		const hasSubList = item.items && item.items.length > 0;
		return html`
			<d2l-list-item-nav
				key="${ifDefined(item.key)}"
				action-href="https://d2l.com"
				draggable
				drag-handle-text="${item.primaryText}"
				color="${ifDefined(item.color)}"
				?expandable="${hasSubList}"
				?expanded="${hasSubList}"
				drop-nested
				label="${item.primaryText}"
				prevent-navigation>
				<d2l-list-item-content>
					<div>${item.hasIcon ? html`<d2l-icon icon="tier2:file-document"></d2l-icon>` : nothing}${item.primaryText}</div>
					${item.tooltipOpenerText && item.tooltipText
							? html`<div slot="secondary"><d2l-tooltip-help text="${item.tooltipOpenerText}">${item.tooltipText}</d2l-tooltip-help></div>`
							: nothing
					}
				</d2l-list-item-content>
				${hasSubList ? html`
					<d2l-list slot="nested" grid ?add-button="${this.addButton}">
						${repeat(item.items, (subItem) => subItem.key, (subItem) => this._renderItem(subItem))}
					</d2l-list>`
						: nothing
				}
			</d2l-list-item-nav>
		`;
	}
}

customElements.define('d2l-demo-list-nav', ListDemoNav);
