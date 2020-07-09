import { defineCE, expect, fixture, oneEvent } from '@open-wc/testing';
import { dropLocation, ListItemDragDropMixin, NewPositionEventDetails } from '../list-item-drag-mixin.js';
import { html, LitElement } from 'lit-element/lit-element.js';

const tag = defineCE(
	class extends ListItemDragDropMixin(LitElement) {
		render() {
			return html`
				${this._renderTopPlacementMarker(html`<div id="top-placement-marker">----</div>`)}
				${this._renderDropTarget()}
				${this._renderDragHandle()}
				${this._renderDraggableArea()}
				${this._renderBottomPlacementMarker(html`<div id="bottom-placement-marker">----</div>`)}
			`;
		}
	}
);

describe('ListItemDragDropMixin', () => {
	it('Sets draggable to false when no key is given', async() => {
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

		it('Will listen to dragEnter on host and show the real drop spots.', async() => {
			setTimeout(() => {
				element.dispatchEvent(new DragEvent('dragenter', {dataTransfer}));
			});
			await oneEvent(element, 'dragenter');
			await element.updateComplete;
			dropGrid = element.shadowRoot.querySelector('.d2l-list-item-drag-drop-grid');
			expect(dropGrid).not.be.null;
		});

		it('Will show the top placement marker after entering the top of the element.', async() => {
			const topDropTarget = dropGrid.querySelectorAll('div')[0];
			setTimeout(() => {
				topDropTarget.dispatchEvent(new DragEvent('dragenter', {dataTransfer}));
			});
			await oneEvent(topDropTarget, 'dragenter');
			await element.updateComplete;
			const topPlacementMarker = element.shadowRoot.querySelector('#top-placement-marker');
			expect(topPlacementMarker).not.be.null;
		});

		it('Will show the bottom placement marker after entering the top half of the element coming from the top.', async() => {
			const topHalfDropTarget = dropGrid.querySelectorAll('div')[1];
			setTimeout(() => {
				topHalfDropTarget.dispatchEvent(new DragEvent('dragenter', {dataTransfer}));
			});
			await oneEvent(topHalfDropTarget, 'dragenter');
			await element.updateComplete;
			const topPlacementMarker = element.shadowRoot.querySelector('#top-placement-marker');
			expect(topPlacementMarker).be.null;
			const bottomPlacementMarker = element.shadowRoot.querySelector('#bottom-placement-marker');
			expect(bottomPlacementMarker).not.be.null;
		});

		it('Will show the bottom placement marker after entering the bottom half of the element coming from the top.', async() => {
			const topHalfDropTarget = dropGrid.querySelectorAll('div')[2];
			setTimeout(() => {
				topHalfDropTarget.dispatchEvent(new DragEvent('dragenter', {dataTransfer}));
			});
			await oneEvent(topHalfDropTarget, 'dragenter');
			await element.updateComplete;
			const topPlacementMarker = element.shadowRoot.querySelector('#top-placement-marker');
			expect(topPlacementMarker).be.null;
			const bottomPlacementMarker = element.shadowRoot.querySelector('#bottom-placement-marker');
			expect(bottomPlacementMarker).not.be.null;
		});

		it('Will show the bottom placement marker after entering the bottom of the element coming from the top.', async() => {
			const topHalfDropTarget = dropGrid.querySelectorAll('div')[3];
			setTimeout(() => {
				topHalfDropTarget.dispatchEvent(new DragEvent('dragenter', {dataTransfer}));
			});
			await oneEvent(topHalfDropTarget, 'dragenter');
			await element.updateComplete;
			const topPlacementMarker = element.shadowRoot.querySelector('#top-placement-marker');
			expect(topPlacementMarker).be.null;
			const bottomPlacementMarker = element.shadowRoot.querySelector('#bottom-placement-marker');
			expect(bottomPlacementMarker).not.be.null;
		});

		it('Will show the top placement marker after entering the bottom half of the element coming from the bottom.', async() => {
			const topHalfDropTarget = dropGrid.querySelectorAll('div')[2];
			setTimeout(() => {
				topHalfDropTarget.dispatchEvent(new DragEvent('dragenter', {dataTransfer}));
			});
			await oneEvent(topHalfDropTarget, 'dragenter');
			await element.updateComplete;
			const topPlacementMarker = element.shadowRoot.querySelector('#top-placement-marker');
			expect(topPlacementMarker).not.be.null;
			const bottomPlacementMarker = element.shadowRoot.querySelector('#bottom-placement-marker');
			expect(bottomPlacementMarker).be.null;
		});

		it('Will show the top placement marker after entering the top half of the element coming from the bottom.', async() => {
			const topHalfDropTarget = dropGrid.querySelectorAll('div')[2];
			setTimeout(() => {
				topHalfDropTarget.dispatchEvent(new DragEvent('dragenter', {dataTransfer}));
			});
			await oneEvent(topHalfDropTarget, 'dragenter');
			await element.updateComplete;
			const topPlacementMarker = element.shadowRoot.querySelector('#top-placement-marker');
			expect(topPlacementMarker).not.be.null;
			const bottomPlacementMarker = element.shadowRoot.querySelector('#bottom-placement-marker');
			expect(bottomPlacementMarker).be.null;
		});

		it('Will have the list item go back to normal when dragging ends.', async() => {
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
			description: 'throws an error when dragTargetKey does not exist',
			input: {
				dragTargetKey: 'foo',
				dropTargetKey: 'one'
			}
		},
		{
			description: 'throws an error when dropTargetKey does not exist',
			input: {
				dragTargetKey: 'one',
				dropTargetKey: 'foo'
			}
		}
	];

	describe('announceMove', () => {
		const list = ['one', 'two', 'three'].map(x => ({key : x }));
		it('announces when given required arguments', () => {
			const event = new NewPositionEventDetails({
				dragTargetKey: 'one',
				dropTargetKey: 'three'
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
				description: 'does nothing when dragTargetKey and dropTargetKey are the same',
				input: {
					array: ['one', 'two', 'three'],
					dragTargetKey: 'one',
					dropTargetKey: 'one',
					dropLocation: dropLocation.below
				},
				expected: ['one', 'two', 'three']
			},
			{
				description: 'moves item forward in the middle of an array',
				input: {
					array: ['one', 'two', 'three', 'four', 'five'],
					dragTargetKey: 'two',
					dropTargetKey: 'four',
					dropLocation: dropLocation.below
				},
				expected: ['one', 'three', 'four', 'two', 'five']
			},
			{
				description: 'moves item backward in the middle of an array',
				input: {
					array: ['one', 'two', 'three', 'four', 'five'],
					dragTargetKey: 'four',
					dropTargetKey: 'two',
					dropLocation: dropLocation.above
				},
				expected: ['one', 'four', 'two', 'three', 'five']
			},
			{
				description: 'moves item backward to beginning of an array',
				input: {
					array: ['one', 'two', 'three', 'four', 'five'],
					dragTargetKey: 'four',
					dropTargetKey: 'one',
					dropLocation: dropLocation.above
				},
				expected: ['four', 'one', 'two', 'three', 'five']
			},
			{
				description: 'moves item forward to end of an array',
				input: {
					array: ['one', 'two', 'three', 'four', 'five'],
					dragTargetKey: 'two',
					dropTargetKey: 'five',
					dropLocation: dropLocation.below
				},
				expected: ['one', 'three', 'four', 'five', 'two']
			},
			{
				description: 'moves last item to beginning of an array',
				input: {
					array: ['one', 'two', 'three', 'four', 'five'],
					dragTargetKey: 'five',
					dropTargetKey: 'one',
					dropLocation: dropLocation.above
				},
				expected: ['five', 'one', 'two', 'three', 'four']
			},
			{
				description: 'moves first item to end of an array',
				input: {
					array: ['one', 'two', 'three', 'four', 'five'],
					dragTargetKey: 'one',
					dropTargetKey: 'five',
					dropLocation: dropLocation.below
				},
				expected: ['two', 'three', 'four', 'five', 'one']
			},
			{
				description: 'moves last item to second position of an array',
				input: {
					array: ['one', 'two', 'three', 'four', 'five'],
					dragTargetKey: 'five',
					dropTargetKey: 'one',
					dropLocation: dropLocation.below
				},
				expected: ['one', 'five', 'two', 'three', 'four']
			},
			{
				description: 'moves first item to second last position of an array',
				input: {
					array: ['one', 'two', 'three', 'four', 'five'],
					dragTargetKey: 'one',
					dropTargetKey: 'five',
					dropLocation: dropLocation.above
				},
				expected: ['two', 'three', 'four', 'one', 'five']
			}
		];

		for (const test of tests) {
			it(`${test.description}`, () => {
				const event = new NewPositionEventDetails({
					dragTargetKey: test.input.dragTargetKey,
					dropTargetKey: test.input.dropTargetKey,
					dropLocation: test.input.dropLocation
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
