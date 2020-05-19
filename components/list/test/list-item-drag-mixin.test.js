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
});
