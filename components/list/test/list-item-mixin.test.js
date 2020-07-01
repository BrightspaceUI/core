import '../list.js';
import { defineCE, expect, fixture } from '@open-wc/testing';
import { ListItemMixin } from '../list-item-mixin.js';
import { LitElement } from 'lit-element/lit-element.js';

const tag = defineCE(
	class extends ListItemMixin(LitElement) {
	}
);

describe('ListItemMixin', () => {
	it('leaves role as undefined if not a child of d2l-list', async() => {
		const el = await fixture(`<div><${tag}></${tag}></div>`);
		expect(el.querySelector(tag).role).to.be.undefined;
	});

	it('changes role to rowgroup when list parent has grid enabled', async() => {
		const el = await fixture(`<d2l-list grid><${tag}></${tag}></d2l-list>`);
		expect(el.querySelector(tag).role).to.equal('rowgroup');
	});

	it('changes role to listitem when list parent has grid disabled', async() => {
		const el = await fixture(`<d2l-list><${tag}></${tag}></d2l-list>`);
		expect(el.querySelector(tag).role).to.equal('listitem');
	});
});
