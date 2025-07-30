import '../list.js';
import '../list-item.js';
import '../list-item-content.js';
import { expect, fixture, focusElem, hoverElem, html } from '@brightspace-ui/testing';
import { ifDefined } from 'lit/directives/if-defined.js';

describe('list', () => {
	describe('draggable', () => {
		function createDraggableList(opts) {
			const { color1, color2, extendSeparators, handleOnly } = { handleOnly: false, extendSeparators: false, ...opts };
			return html`
				<d2l-list style="width: 400px;" ?extend-separators="${extendSeparators}">
					<d2l-list-item label="Item 1" color="${ifDefined(color1)}" draggable ?drag-target-handle-only="${handleOnly}" key="1">Item 1</d2l-list-item>
					<d2l-list-item label="Item 2" color="${ifDefined(color2)}" draggable ?drag-target-handle-only="${handleOnly}" key="2">Item 2</d2l-list-item>
				</d2l-list>
			`;
		}

		[
			{ name: 'default', template: createDraggableList() },
			{ name: 'color hover', template: createDraggableList({ color1: '#ff0000' }), action: elem => hoverElem(elem.querySelector('[key="1"]')), margin: 24 },
			{ name: 'focus list item', template: createDraggableList(), action: elem => focusElem(elem.querySelector('[key="1"]')), margin: 24 },
			{ name: 'hover list item', template: createDraggableList(), action: elem => hoverElem(elem.querySelector('[key="1"]')), margin: 24 },
			{ name: 'hover outside control', template: createDraggableList(), action: elem => hoverElem(elem.querySelector('[key="1"]').shadowRoot.querySelector('[slot="outside-control"]')), margin: 24 },
			{ name: 'drag-target-handle-only hover list item', template: createDraggableList({ handleOnly: true }), action: elem => hoverElem(elem.querySelector('[key="1"]')) },
			{ name: 'drag-target-handle-only hover outside control', template: createDraggableList({ handleOnly: true }), action: elem => hoverElem(elem.querySelector('[key="1"]').shadowRoot.querySelector('[slot="outside-control"]')) },
			{ name: 'extended separators', template: createDraggableList({ color2: '#00ff00', extendSeparators: true }) },
			{ name: 'extended separators hover', template: createDraggableList({ color2: '#00ff00', extendSeparators: true }), action: elem => hoverElem(elem.querySelector('[key="2"]')) },
		].forEach(({ name, template, action, margin = undefined }) => {
			it(name, async() => {
				const elem = await fixture(template);
				if (action) await action(elem);
				await expect(elem).to.be.golden({ margin });
			});
		});
	});
});
