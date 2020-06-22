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
				description: 'does nothing when new and old position are the same',
				input: {
					array: [1, 2, 3],
					oldPosition: 1,
					newPosition: 1
				},
				expected: [1, 2, 3]
			},
			{
				description: 'moves item forward in the middle of an array',
				input: {
					array: [1, 2, 3, 4, 5, 6],
					oldPosition: 2,
					newPosition: 4
				},
				expected: [1, 2, 4, 5, 3, 6]
			},
			{
				description: 'moves item backward in the middle of an array',
				input: {
					array: [1, 2, 3, 4, 5, 6],
					oldPosition: 4,
					newPosition: 2
				},
				expected: [1, 2, 5, 3, 4, 6]
			},
			{
				description: 'moves item backward to beginning of an array',
				input: {
					array: [1, 2, 3, 4, 5, 6],
					oldPosition: 4,
					newPosition: 0
				},
				expected: [5, 1, 2, 3, 4, 6]
			},
			{
				description: 'moves item forward to end of an array',
				input: {
					array: [1, 2, 3, 4, 5, 6],
					oldPosition: 2,
					newPosition: 5
				},
				expected: [1, 2, 4, 5, 6, 3]
			},
			{
				description: 'moves last item to beginning of an array',
				input: {
					array: [1, 2, 3, 4, 5, 6],
					oldPosition: 5,
					newPosition: 0
				},
				expected: [6, 1, 2, 3, 4, 5]
			},
			{
				description: 'moves first item to end of an array',
				input: {
					array: [1, 2, 3, 4, 5, 6],
					oldPosition: 0,
					newPosition: 5
				},
				expected: [2, 3, 4, 5, 6, 1]
			}
		];

		for (const test of tests) {
			it(`${test.description}`, () => {
				const event = new NewPositionEventDetails({
					oldPosition: test.input.oldPosition,
					position: test.input.newPosition
				});
				event.reorder(test.input.array);
				expect(test.input.array).to.deep.equal(test.expected);
			});
		}

		it('throws an error when a position does not exist', () => {
			const event = new NewPositionEventDetails({
				oldPosition: 1,
				position: 10
			});
			expect(() => event.reorder([1, 2, 3])).to.throw(Error);

		});
	});
});
