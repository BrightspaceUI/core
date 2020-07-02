import { defineCE, expect, fixture } from '@open-wc/testing';
import { html, LitElement } from 'lit-element/lit-element.js';
import { ListItemDragMixin, NewPositionEventDetails } from '../list-item-drag-mixin.js';

const tag = defineCE(
	class extends ListItemDragMixin(LitElement) {
		render() {
			return html`
				${this._renderTopPlacementMarker(html`----`)}
				${this._renderDragHandle()}
				${this._renderDraggableArea()}
				${this._renderBottomPlacementMarker(html`----`)}
			`;
		}
	}
);

describe('ListItemDragMixin', () => {
	it('sets draggable status to false when no key is given', async() => {
		const element = await fixture(`<${tag} draggable="true"></${tag}>`);
		await element.updateComplete;
		expect(element.draggable).to.be.false;
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
					moveBeforeDestination: false
				},
				expected: ['one', 'two', 'three']
			},
			{
				description: 'moves item forward in the middle of an array',
				input: {
					array: ['one', 'two', 'three', 'four', 'five'],
					targetKey: 'two',
					destinationKey: 'four',
					moveBeforeDestination: false
				},
				expected: ['one', 'three', 'four', 'two', 'five']
			},
			{
				description: 'moves item backward in the middle of an array',
				input: {
					array: ['one', 'two', 'three', 'four', 'five'],
					targetKey: 'four',
					destinationKey: 'two',
					moveBeforeDestination: true
				},
				expected: ['one', 'four', 'two', 'three', 'five']
			},
			{
				description: 'moves item backward to beginning of an array',
				input: {
					array: ['one', 'two', 'three', 'four', 'five'],
					targetKey: 'four',
					destinationKey: 'one',
					moveBeforeDestination: true
				},
				expected: ['four', 'one', 'two', 'three', 'five']
			},
			{
				description: 'moves item forward to end of an array',
				input: {
					array: ['one', 'two', 'three', 'four', 'five'],
					targetKey: 'two',
					destinationKey: 'five',
					moveBeforeDestination: false
				},
				expected: ['one', 'three', 'four', 'five', 'two']
			},
			{
				description: 'moves last item to beginning of an array',
				input: {
					array: ['one', 'two', 'three', 'four', 'five'],
					targetKey: 'five',
					destinationKey: 'one',
					moveBeforeDestination: true
				},
				expected: ['five', 'one', 'two', 'three', 'four']
			},
			{
				description: 'moves first item to end of an array',
				input: {
					array: ['one', 'two', 'three', 'four', 'five'],
					targetKey: 'one',
					destinationKey: 'five',
					moveBeforeDestination: false
				},
				expected: ['two', 'three', 'four', 'five', 'one']
			},
			{
				description: 'moves last item to second position of an array',
				input: {
					array: ['one', 'two', 'three', 'four', 'five'],
					targetKey: 'five',
					destinationKey: 'one',
					moveBeforeDestination: false
				},
				expected: ['one', 'five', 'two', 'three', 'four']
			},
			{
				description: 'moves first item to second last position of an array',
				input: {
					array: ['one', 'two', 'three', 'four', 'five'],
					targetKey: 'one',
					destinationKey: 'five',
					moveBeforeDestination: true
				},
				expected: ['two', 'three', 'four', 'one', 'five']
			}
		];

		for (const test of tests) {
			it(`${test.description}`, () => {
				const event = new NewPositionEventDetails({
					targetKey: test.input.targetKey,
					destinationKey: test.input.destinationKey,
					moveBeforeDestination: test.input.moveBeforeDestination
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
