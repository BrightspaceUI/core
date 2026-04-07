import './tooltip.js';
import '../list/list.js';
import '../list/list-item.js';
import '../list/list-item-content.js';
import { html, LitElement } from 'lit';
import { repeat } from 'lit/directives/repeat.js';

class DemoTooltipDragAndDropList extends LitElement {

	constructor() {
		super();
		this.listItems = [
			{ key: '1', id: 'li-1', text: 'List item 1', tooltip: 'Tooltip for list item 1' },
			{ key: '2', id: 'li-2', text: 'List item 2', tooltip: 'Tooltip for list item 2' },
			{ key: '3', id: 'li-3', text: 'List item 3', tooltip: 'Tooltip for list item 3' }
		];
	}

	render() {
		return html`
			<d2l-list
				id="tooltip-list"
				@d2l-list-items-move="${this.#onPositionChange}">
				${repeat(this.listItems, item => item.key, item => html`
					<d2l-list-item draggable key="${item.key}" id="${item.id}">
						<d2l-list-item-content>${item.text}</d2l-list-item-content>
					</d2l-list-item>
					<d2l-tooltip for="${item.id}">${item.tooltip}</d2l-tooltip>
				`)}
			</d2l-list>
		`;
	}

	#onPositionChange(e) {
		if (!(e instanceof CustomEvent)) return;
		const { item: targetItem, location } = e.detail.target;
		const targetIndex = this.listItems.findIndex(item => item.id === targetItem.id);
		if (targetIndex === -1) return;
		const sourceItem = e.detail.sourceItems[0];
		const sourceIndex = this.listItems.findIndex(item => item.id === sourceItem.id);

		const [movedItem] = this.listItems.splice(sourceIndex, 1);
		if (location === 1) {
			// move before the element
			this.listItems.splice(targetIndex, 0, movedItem);
		} else if (location === 2) {
			// move after the element
			this.listItems.splice(targetIndex + 1, 0, movedItem);
		}
		this.requestUpdate();
	}

}

customElements.define('d2l-demo-tooltip-drag-and-drop-list', DemoTooltipDragAndDropList);
