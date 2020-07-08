import { defineCE, expect, fixture, oneEvent } from '@open-wc/testing';
import { html, LitElement } from 'lit-element/lit-element.js';
import { ListItemDragMixin, NewPositionEventDetails } from '../list-item-drag-mixin.js';

const tag = defineCE(
	class extends ListItemDragMixin(LitElement) {
		render() {
			return html`
				${this._renderTopPlacementMarker(html`<div id="top-placement-marker">----</div>`)}
				${this._renderDropArea()}
				${this._renderDragHandle()}
				${this._renderDraggableArea()}
				${this._renderBottomPlacementMarker(html`<div id="bottom-placement-marker">----</div>`)}
			`;
		}
	}
);

describe('ListItemDragMixin', () => {
	it('It sets draggable to false when no key is given', async() => {
		const element = await fixture(`<${tag} draggable></${tag}>`);
		await element.updateComplete;
		expect(element.draggable).to.be.false;
	});

	describe('Track placement as item is being moved', () => {
		let element;
		let dropGrid;
		let dataTransfer;
		before(async() => {
			element = await fixture(`<${tag} draggable key="1"></${tag}>`);
			dataTransfer = new DataTransfer();
			dataTransfer.setData('text/plain', 'test');
			dataTransfer.effectAllowed = 'move';
		});

		it('It will listen to dragEnter on host and show the real drop spots.', async() => {
			setTimeout(() => {
				element.dispatchEvent(new DragEvent('dragenter', {dataTransfer}));
			});
			await oneEvent(element, 'dragenter');
			await element.updateComplete;
			dropGrid = element.shadowRoot.querySelector('.d2l-list-item-drag-drop-grid');
			expect(dropGrid).not.be.null;
		});

		it('It will show the top placement marker after entering the top of the element.', async() => {
			const topDropArea = dropGrid.querySelectorAll('div')[0];
			setTimeout(() => {
				topDropArea.dispatchEvent(new DragEvent('dragenter', {dataTransfer}));
			});
			await oneEvent(topDropArea, 'dragenter');
			await element.updateComplete;
			const topPlacementMarker = element.shadowRoot.querySelector('#top-placement-marker');
			expect(topPlacementMarker).not.be.null;
		});

		it('It will show the bottom placement marker after entering the top half of the element coming from the top.', async() => {
			const topHalfDropArea = dropGrid.querySelectorAll('div')[1];
			setTimeout(() => {
				topHalfDropArea.dispatchEvent(new DragEvent('dragenter', {dataTransfer}));
			});
			await oneEvent(topHalfDropArea, 'dragenter');
			await element.updateComplete;
			const topPlacementMarker = element.shadowRoot.querySelector('#top-placement-marker');
			expect(topPlacementMarker).be.null;
			const bottomPlacementMarker = element.shadowRoot.querySelector('#bottom-placement-marker');
			expect(bottomPlacementMarker).not.be.null;
		});

		it('It will show the bottom placement marker after entering the bottom half of the element coming from the top.', async() => {
			const topHalfDropArea = dropGrid.querySelectorAll('div')[2];
			setTimeout(() => {
				topHalfDropArea.dispatchEvent(new DragEvent('dragenter', {dataTransfer}));
			});
			await oneEvent(topHalfDropArea, 'dragenter');
			await element.updateComplete;
			const topPlacementMarker = element.shadowRoot.querySelector('#top-placement-marker');
			expect(topPlacementMarker).be.null;
			const bottomPlacementMarker = element.shadowRoot.querySelector('#bottom-placement-marker');
			expect(bottomPlacementMarker).not.be.null;
		});

		it('It will show the bottom placement marker after entering the bottom of the element coming from the top.', async() => {
			const topHalfDropArea = dropGrid.querySelectorAll('div')[3];
			setTimeout(() => {
				topHalfDropArea.dispatchEvent(new DragEvent('dragenter', {dataTransfer}));
			});
			await oneEvent(topHalfDropArea, 'dragenter');
			await element.updateComplete;
			const topPlacementMarker = element.shadowRoot.querySelector('#top-placement-marker');
			expect(topPlacementMarker).be.null;
			const bottomPlacementMarker = element.shadowRoot.querySelector('#bottom-placement-marker');
			expect(bottomPlacementMarker).not.be.null;
		});

		it('It will show the top placement marker after entering the bottom half of the element coming from the bottom.', async() => {
			const topHalfDropArea = dropGrid.querySelectorAll('div')[2];
			setTimeout(() => {
				topHalfDropArea.dispatchEvent(new DragEvent('dragenter', {dataTransfer}));
			});
			await oneEvent(topHalfDropArea, 'dragenter');
			await element.updateComplete;
			const topPlacementMarker = element.shadowRoot.querySelector('#top-placement-marker');
			expect(topPlacementMarker).not.be.null;
			const bottomPlacementMarker = element.shadowRoot.querySelector('#bottom-placement-marker');
			expect(bottomPlacementMarker).be.null;
		});

		it('It will show the top placement marker after entering the top half of the element coming from the bottom.', async() => {
			const topHalfDropArea = dropGrid.querySelectorAll('div')[2];
			setTimeout(() => {
				topHalfDropArea.dispatchEvent(new DragEvent('dragenter', {dataTransfer}));
			});
			await oneEvent(topHalfDropArea, 'dragenter');
			await element.updateComplete;
			const topPlacementMarker = element.shadowRoot.querySelector('#top-placement-marker');
			expect(topPlacementMarker).not.be.null;
			const bottomPlacementMarker = element.shadowRoot.querySelector('#bottom-placement-marker');
			expect(bottomPlacementMarker).be.null;
		});

		it('It will have the list item go back to normal when dragging ends.', async() => {
			const dragArea = element.shadowRoot.querySelector('.d2l-list-item-drag-area');
			setTimeout(() => {
				dragArea.dispatchEvent(new DragEvent('dragend', {dataTransfer}));
			});
			await oneEvent(dragArea, 'dragend');
			await element.updateComplete;
			dropGrid = element.shadowRoot.querySelector('.d2l-list-item-drag-drop-grid');
			expect(dropGrid).be.null;
		});
	});
});

describe('NewPositionEventDetails', () => {
	const keyFn = (item) => item.key;

	const errorTests = [
		{
			description: 'throws an error when targetKey does not exist',
			input: {
				targetKey: 'foo',
				destinationKey: 'one'
			}
		},
		{
			description: 'throws an error when destinationKey does not exist',
			input: {
				targetKey: 'one',
				destinationKey: 'foo'
			}
		}
	];

	describe('announceMove', () => {
		const list = ['one', 'two', 'three'].map(x => ({key : x }));
		it('announces when given required arguments', () => {
			const event = new NewPositionEventDetails({
				targetKey: 'one',
				destinationKey: 'three'
			});
			let msg = '';
			const fn = (item, index) => {
				msg = `${item.key} has moved to position ${index + 1}`;
				return msg;
			};
			event.announceMove(list, {
				announceFn: fn,
				keyFn: keyFn
			});
			expect(msg).to.equal('one has moved to position 3');
		});

		for (const test of errorTests) {
			it(test.description, () => {
				const event = new NewPositionEventDetails(test.input);
				expect(() => event.announceMove(list, {
					announceFn: () => {},
					keyFn: keyFn
				})).to.throw(Error);
			});
		}
	});

	describe('reorder', () => {
		const tests = [
			{
				description: 'does nothing when targetKey and destinationKey are the same',
				input: {
					array: ['one', 'two', 'three'],
					targetKey: 'one',
					destinationKey: 'one',
					insertBefore: false
				},
				expected: ['one', 'two', 'three']
			},
			{
				description: 'moves item forward in the middle of an array',
				input: {
					array: ['one', 'two', 'three', 'four', 'five'],
					targetKey: 'two',
					destinationKey: 'four',
					insertBefore: false
				},
				expected: ['one', 'three', 'four', 'two', 'five']
			},
			{
				description: 'moves item backward in the middle of an array',
				input: {
					array: ['one', 'two', 'three', 'four', 'five'],
					targetKey: 'four',
					destinationKey: 'two',
					insertBefore: true
				},
				expected: ['one', 'four', 'two', 'three', 'five']
			},
			{
				description: 'moves item backward to beginning of an array',
				input: {
					array: ['one', 'two', 'three', 'four', 'five'],
					targetKey: 'four',
					destinationKey: 'one',
					insertBefore: true
				},
				expected: ['four', 'one', 'two', 'three', 'five']
			},
			{
				description: 'moves item forward to end of an array',
				input: {
					array: ['one', 'two', 'three', 'four', 'five'],
					targetKey: 'two',
					destinationKey: 'five',
					insertBefore: false
				},
				expected: ['one', 'three', 'four', 'five', 'two']
			},
			{
				description: 'moves last item to beginning of an array',
				input: {
					array: ['one', 'two', 'three', 'four', 'five'],
					targetKey: 'five',
					destinationKey: 'one',
					insertBefore: true
				},
				expected: ['five', 'one', 'two', 'three', 'four']
			},
			{
				description: 'moves first item to end of an array',
				input: {
					array: ['one', 'two', 'three', 'four', 'five'],
					targetKey: 'one',
					destinationKey: 'five',
					insertBefore: false
				},
				expected: ['two', 'three', 'four', 'five', 'one']
			},
			{
				description: 'moves last item to second position of an array',
				input: {
					array: ['one', 'two', 'three', 'four', 'five'],
					targetKey: 'five',
					destinationKey: 'one',
					insertBefore: false
				},
				expected: ['one', 'five', 'two', 'three', 'four']
			},
			{
				description: 'moves first item to second last position of an array',
				input: {
					array: ['one', 'two', 'three', 'four', 'five'],
					targetKey: 'one',
					destinationKey: 'five',
					insertBefore: true
				},
				expected: ['two', 'three', 'four', 'one', 'five']
			}
		];

		for (const test of tests) {
			it(`${test.description}`, () => {
				const event = new NewPositionEventDetails({
					targetKey: test.input.targetKey,
					destinationKey: test.input.destinationKey,
					insertBefore: test.input.insertBefore
				});
				const objects = test.input.array.map(x => ({key : x }));
				event.reorder(objects, {keyFn: keyFn});
				expect(objects.map(x => x.key)).to.deep.equal(test.expected);
			});
		}

		for (const test of errorTests) {
			it(test.description, () => {
				const event = new NewPositionEventDetails(test.input);
				expect(() => event.reorder([{ key: 'one' }], {keyFn: keyFn})).to.throw(Error);
			});
		}

		it('throws an error when keys are missing', () => {
			expect(() => new NewPositionEventDetails({})).to.throw(Error);
		});
	});
});
