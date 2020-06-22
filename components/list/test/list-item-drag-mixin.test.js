import { defineCE, expect, fixture } from '@open-wc/testing';
import { html, LitElement } from 'lit-element/lit-element.js';
import { ListItemDragMixin, NewPositionEventDetails } from '../list-item-drag-mixin.js';

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
});

describe('NewPositionEventDetails', () => {
	describe('reorder', () => {
		const tests = [
			{
				description: 'does nothing when new and old key are the same',
				input: {
					array: ['one', 'two', 'three'],
					targetKey: 'one',
					destinationKey: 'one'
				},
				expected: ['one', 'two', 'three']
			},
			{
				description: 'moves item forward in the middle of an array',
				input: {
					array: ['one', 'two', 'three', 'four', 'five'],
					targetKey: 'two',
					destinationKey: 'four'
				},
				expected: ['one', 'three', 'four', 'two', 'five']
			},
			{
				description: 'moves item backward in the middle of an array',
				input: {
					array: ['one', 'two', 'three', 'four', 'five'],
					targetKey: 'four',
					destinationKey: 'two'
				},
				expected: ['one', 'four', 'two', 'three', 'five']
			},
			{
				description: 'moves item backward to beginning of an array',
				input: {
					array: ['one', 'two', 'three', 'four', 'five'],
					targetKey: 'four',
					destinationKey: 'one'
				},
				expected: ['four', 'one', 'two', 'three', 'five']
			},
			{
				description: 'moves item forward to end of an array',
				input: {
					array: ['one', 'two', 'three', 'four', 'five'],
					targetKey: 'two',
					destinationKey: 'five'
				},
				expected: ['one', 'three', 'four', 'five', 'two']
			},
			{
				description: 'moves last item to beginning of an array',
				input: {
					array: ['one', 'two', 'three', 'four', 'five'],
					targetKey: 'five',
					destinationKey: 'one'
				},
				expected: ['five', 'one', 'two', 'three', 'four']
			},
			{
				description: 'moves first item to end of an array',
				input: {
					array: ['one', 'two', 'three', 'four', 'five'],
					targetKey: 'one',
					destinationKey: 'five'
				},
				expected: ['two', 'three', 'four', 'five', 'one']
			}
		];

		for (const test of tests) {
			it(`${test.description}`, () => {
				const event = new NewPositionEventDetails({
					targetKey: test.input.targetKey,
					destinationKey: test.input.destinationKey
				});
				const objects = test.input.array.map(x => ({key : x }));
				event.reorder(objects);
				expect(objects.map(x => x.key)).to.deep.equal(test.expected);
			});
		}

		it('throws an error when a position does not exist', () => {
			const event = new NewPositionEventDetails({
				targetKey: 'bar',
				destinationKey: 'foo'
			});
			expect(() => event.reorder([{ key: 'key' }])).to.throw(Error);

		});
	});
});
