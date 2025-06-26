import '../sort.js';
import '../sort-item.js';
import { clickElem, expect, fixture, focusElem, html, oneEvent, runConstructor } from '@brightspace-ui/testing';
import { getComposedActiveElement } from '../../../helpers/focus.js';

const closedFixture = html`
	<d2l-sort>
		<d2l-sort-item text="Name" value="name" selected></d2l-sort-item>
		<d2l-sort-item text="Votes" value="votes"></d2l-sort-item>
		<d2l-sort-item text="Creation Date" value="creation"></d2l-sort-item>
	</d2l-sort>
`;
const openedFixture = html`
	<d2l-sort opened>
		<d2l-sort-item text="Name" value="name" selected></d2l-sort-item>
		<d2l-sort-item text="Votes" value="votes"></d2l-sort-item>
		<d2l-sort-item text="Creation Date" value="creation"></d2l-sort-item>
	</d2l-sort>
`;

describe('d2l-sort', () => {

	it('should construct', () => {
		runConstructor('d2l-sort');
		runConstructor('d2l-sort-item');
	});

	it('selects the first item by default', async() => {
		const elem = await fixture(html`
			<d2l-sort>
				<d2l-sort-item text="Item 1" value="item1"></d2l-sort-item>
				<d2l-sort-item text="Item 2" value="item2"></d2l-sort-item>
				<d2l-sort-item text="Item 3" value="item3"></d2l-sort-item>
			</d2l-sort>
		`);
		expect(elem.querySelector('d2l-sort-item[value="item1"]').selected).to.be.true;
		expect(elem.querySelector('d2l-sort-item[value="item2"]').selected).to.be.false;
		expect(elem.querySelector('d2l-sort-item[value="item3"]').selected).to.be.false;
	});

	it('treats only the last selected item as selected', async() => {
		const elem = await fixture(html`
			<d2l-sort>
				<d2l-sort-item text="Item 1" value="item1" selected></d2l-sort-item>
				<d2l-sort-item text="Item 2" value="item2" selected></d2l-sort-item>
				<d2l-sort-item text="Item 3" value="item3" selected></d2l-sort-item>
			</d2l-sort>
		`);
		expect(elem.querySelector('d2l-sort-item[value="item1"]').selected).to.be.false;
		expect(elem.querySelector('d2l-sort-item[value="item2"]').selected).to.be.false;
		expect(elem.querySelector('d2l-sort-item[value="item3"]').selected).to.be.true;
	});

	it('dispatches change event', async() => {
		const elem = await fixture(openedFixture);
		clickElem(elem.querySelector('d2l-sort-item[value="votes"]'));
		const e = await oneEvent(elem, 'd2l-sort-change');
		expect(e.detail.value).to.equal('votes');
	});

	it('delegates focus to underlying focusable', async() => {
		const elem = await fixture(closedFixture);
		const innerButton = elem
			.shadowRoot.querySelector('d2l-dropdown-button-subtle')
			.shadowRoot.querySelector('d2l-button-subtle')
			.shadowRoot.querySelector('button');
		await focusElem(elem);
		const activeElement = getComposedActiveElement();
		expect(activeElement).to.equal(innerButton);
	});

	it('updates selected item text when it changes', async() => {
		const elem = await fixture(closedFixture);
		const item = elem.querySelector('d2l-sort-item[value="name"]');
		item.text = 'Name (updated)';
		await item.updateComplete;
		expect(elem._selectedItemText).to.equal('Name (updated)');
	});

});
