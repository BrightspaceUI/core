import '../../status-indicator/status-indicator.js';
import '../object-property-list.js';
import '../object-property-list-item.js';
import '../object-property-list-item-link.js';
import { expect, fixture, focusElem, html } from '@brightspace-ui/testing';
import { nothing } from 'lit';

function createObjectPropertyList(opts) {
	const { skeleton, statusIndicator } =  { skeleton: false, statusIndicator: false, ...opts };
	return html`
		<d2l-object-property-list>
			${statusIndicator ? html`<d2l-status-indicator slot="status" state="default" text="Status"></d2l-status-indicator>` : nothing}
			<d2l-object-property-list-item text="Example item" ?skeleton="${skeleton}"></d2l-object-property-list-item>
			<d2l-object-property-list-item text="Example item with icon" icon="tier1:grade" ?skeleton="${skeleton}"></d2l-object-property-list-item>
			<d2l-object-property-list-item-link text="Example link" href="https://www.d2l.com/" ?skeleton="${skeleton}"></d2l-object-property-list-item-link>
			<d2l-object-property-list-item-link text="Example link with icon" href="https://www.d2l.com/" icon="tier1:alert" ?skeleton="${skeleton}"></d2l-object-property-list-item-link>
		</d2l-object-property-list>
	`;
}

describe('object-property-list', () => {
	[
		{ name: 'single', template: html`
			<d2l-object-property-list>
				<d2l-object-property-list-item text="Example item"></d2l-object-property-list-item>
			</d2l-object-property-list>
		` },
		{ name: 'all-types', template: createObjectPropertyList({ statusIndicator: true }) },
		{ name: 'word-wrap', template: html`
			<d2l-object-property-list>
				<d2l-object-property-list-item icon="tier1:grade" text="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci repellat cum totam! Enim, sunt."></d2l-object-property-list-item>
				<d2l-object-property-list-item icon="tier1:alert" text="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci repellat cum totam! Enim, sunt."></d2l-object-property-list-item>
			</d2l-object-property-list>
		` },
		{ name: 'focus', template: createObjectPropertyList({ statusIndicator: true }), action: elem => focusElem(elem.querySelector('d2l-object-property-list-item-link')) },
		{ name: 'rtl', rtl: true, template: createObjectPropertyList({ statusIndicator: true }) },
		{ name: 'list-skeleton', template: html`<d2l-object-property-list skeleton skeleton-count="3"></d2l-object-property-list>` },
		{ name: 'item-skeleton', template: createObjectPropertyList({ skeleton: true })  },
		{ name: 'hidden-items', template: html`
			<d2l-object-property-list>
				<d2l-object-property-list-item text="Item 1"></d2l-object-property-list-item>
				<d2l-object-property-list-item text="Item 2 (Hidden)" hidden></d2l-object-property-list-item>
				<d2l-object-property-list-item text="Item 3"></d2l-object-property-list-item>
				<d2l-object-property-list-item text="Item 4 (Hidden)" hidden></d2l-object-property-list-item>
			</d2l-object-property-list>
		` }
	].forEach(({ name, rtl, template, action }) => {
		it(name, async() => {
			const elem = await fixture(html`<div style="width: 300px;">${template}</div>`, { rtl });
			if (action) await action(elem);
			await expect(elem).to.be.golden();
		});
	});
});
