import { defineCE, expect, fixture } from '@open-wc/testing';
import { html, LitElement } from 'lit-element/lit-element.js';
import { ListItemDragMixin } from '../list-item-drag-mixin.js';

const tag = defineCE(
	class extends ListItemDragMixin(LitElement) {
		render() {
			return html`
				${this._renderDragHandle()}
				${this._renderDragAction()}
			`;
		}
	}
);

describe('ListItemDragMixin', () => {
	it('Sets checked status to false when no key is given', async() => {
		const element = await fixture(`<${tag} draggable="true"></${tag}>`);
		expect(element.draggable).to.be.false;
	});

	// describe('Events', () => {
	// 	let element;
	// 	beforeEach(async() => {
	// 		element = await fixture(`<${tag} key="1234" draggable="true"></${tag}>`);
	// 	});

	// 	it('dispatches "d2l-list-item-position" when area is dragged', async() => {
	// 		let dispatched = false;
	// 		element.addEventListener('d2l-list-item-positiond', () => dispatched = true);
	// 		await element.updateComplete;
	// 		const dragArea = element.shadowRoot.querySelector('.d2l-list-item-drag');
	// 		setTimeout(() => {
	// 			dragArea.dispatchEvent(new Event('dragover'));
	// 		});
	// 		await oneEvent(dragArea, 'dragover');

	// 		expect(dispatched).to.equal(true);
	// 	});

	// 	it('dispatches "d2l-list-item-position" when area is dropped', async() => {
	// 		let dispatched = false;
	// 		element.addEventListener('d2l-list-item-positiond', () => dispatched = true);
	// 		await element.updateComplete;
	// 		const dragArea = element.shadowRoot.querySelector('.d2l-list-item-drag');
	// 		setTimeout(() => {
	// 			dragArea.dispatchEvent(new Event('drop'));
	// 		});
	// 		await oneEvent(dragArea, 'drop');
	// 		expect(dispatched).to.equal(true);
	// 	});

	// });
});
