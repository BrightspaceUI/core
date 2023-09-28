import '../list.js';
import '../list-controls.js';
import '../list-item.js';
import '../list-item-button.js';
import '../list-item-content.js';

import { expect, fixture, hoverElem, html } from '@brightspace-ui/testing';

const draggableListTemplate = html`
	<d2l-list>
		<d2l-list-item label="Item 1" draggable key="1">Item 1</d2l-list-item>
		<d2l-list-item label="Item 2" draggable key="2">Item 2</d2l-list-item>
	</d2l-list>
`;

const draggableListTemplateHandleOnly = html`
	<d2l-list>
		<d2l-list-item label="Item 1" drag-target-handle-only draggable key="1">Item 1</d2l-list-item>
		<d2l-list-item label="Item 2" drag-target-handle-only draggable key="2">Item 2</d2l-list-item>
	</d2l-list>
`;

describe('list', () => {
	describe('draggable', () => {
		it('displays drag handle when hovering list item', async() => {
			const elem = await fixture(draggableListTemplate);
			const listItem = elem.querySelector('d2l-list-item');
			await hoverElem(listItem);
			await expect(elem).to.be.golden();
		});

		it('displays drag handle when hovering outside control', async() => {
			const elem = await fixture(draggableListTemplate);
			const listItem = elem.querySelector('d2l-list-item');
			const outsideControl = listItem.shadowRoot.querySelector('[slot="outside-control"]');
			await hoverElem(outsideControl);
			await expect(elem).to.be.golden();
		});

		describe('drag-target-handle-only', () => {
			it('displays drag handle when hovering list item', async() => {
				const elem = await fixture(draggableListTemplateHandleOnly);
				const listItem = elem.querySelector('d2l-list-item');
				await hoverElem(listItem);
				await expect(elem).to.be.golden();
			});

			it('displays drag handle when hovering outside control', async() => {
				const elem = await fixture(draggableListTemplateHandleOnly);
				const listItem = elem.querySelector('d2l-list-item');
				const outsideControl = listItem.shadowRoot.querySelector('[slot="outside-control"]');
				await hoverElem(outsideControl);
				await expect(elem).to.be.golden();
			});
		});
	});
});
