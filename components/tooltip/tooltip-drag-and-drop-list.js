import './tooltip.js';
import '../list/list.js';
import '../list/list-item.js';
import '../list/list-item-content.js';
import { html, LitElement } from 'lit';
import { NewPositionEventDetails } from '../list/list-item-drag-drop-mixin.js';
import { repeat } from 'lit/directives/repeat.js';

class DemoTooltipDragAndDropList extends LitElement {

	constructor() {
		super();
		this.listItems = [
			{ key: '1', text: 'List item 1', tooltip: 'Tooltip for list item 1' },
			{ key: '2', text: 'List item 2', tooltip: 'Tooltip for list item 2' },
			{ key: '3', text: 'List item 3', tooltip: 'Tooltip for list item 3' }
		];
	}

	render() {
		return html`
			<d2l-list
				id="tooltip-list"
				bordered
				@d2l-list-item-position-change="${this.#onPositionChange}">
				${repeat(this.listItems, item => item.key, item => html`
					<d2l-list-item draggable key="li-${item.key}" id="li-${item.key}">
						<d2l-list-item-content>${item.text}</d2l-list-item-content>
					</d2l-list-item>
					<d2l-tooltip for="li-${item.key}">${item.tooltip}</d2l-tooltip>
				`)}
			</d2l-list>
		`;
	}

	#onPositionChange(e) {
		if (!(e instanceof CustomEvent) && !(e.detail instanceof NewPositionEventDetails)) return;

		e.detail.reorder(this.listItems, { keyFn: item => `li-${item.key}` });
		this.requestUpdate();
	}

}

customElements.define('d2l-demo-tooltip-drag-and-drop-list', DemoTooltipDragAndDropList);
