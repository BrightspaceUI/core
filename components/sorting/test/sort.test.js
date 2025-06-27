import { clickElem, expect, fixture, focusElem, html, oneEvent, runConstructor } from '@brightspace-ui/testing';
import { getComposedActiveElement } from '../../../helpers/focus.js';
import { sortFixtures } from './sort-fixtures.js';

function createItems(selected) {
	return html`
		<d2l-sort>
		${[0, 1, 2].map(i => html`
			<d2l-sort-item
				text="Item ${i + 1}"
				value="item${i + 1}"
				?selected="${selected[i]}"></d2l-sort-item>
		`)}
		</d2l-sort>
	`;
}

describe('d2l-sort', () => {

	it('should construct', () => {
		runConstructor('d2l-sort');
		runConstructor('d2l-sort-item');
	});

	it('selects the first item when none are explicitly selected', async() => {
		const elem = await fixture(createItems([false, false, false]));
		expect(elem.querySelector('d2l-sort-item[value="item1"]').selected).to.be.true;
		expect(elem.querySelector('d2l-sort-item[value="item2"]').selected).to.be.false;
		expect(elem.querySelector('d2l-sort-item[value="item3"]').selected).to.be.false;
	});

	it('treats only the last selected item as selected', async() => {
		const elem = await fixture(createItems([true, true, true]));
		expect(elem.querySelector('d2l-sort-item[value="item1"]').selected).to.be.false;
		expect(elem.querySelector('d2l-sort-item[value="item2"]').selected).to.be.false;
		expect(elem.querySelector('d2l-sort-item[value="item3"]').selected).to.be.true;
	});

	it('handles non-first selected items', async() => {
		const elem = await fixture(createItems([false, true, false]));
		expect(elem._selectedItemText).to.equal('Item 2');
	});

	it('dispatches change event', async() => {
		const elem = await fixture(sortFixtures.opened);
		clickElem(elem.querySelector('d2l-sort-item[value="updated"]'));
		const e = await oneEvent(elem, 'd2l-sort-change');
		expect(e.detail.value).to.equal('updated');
	});

	it('delegates focus to underlying focusable', async() => {
		const elem = await fixture(sortFixtures.closed);
		const innerButton = elem
			.shadowRoot.querySelector('d2l-dropdown-button-subtle')
			.shadowRoot.querySelector('d2l-button-subtle')
			.shadowRoot.querySelector('button');
		await focusElem(elem);
		const activeElement = getComposedActiveElement();
		expect(activeElement).to.equal(innerButton);
	});

	it('updates selected item text when it changes', async() => {
		const elem = await fixture(sortFixtures.closed);
		const item = elem.querySelector('d2l-sort-item[value="relevant"]');
		item.text = 'Irrelevant';
		await item.updateComplete;
		expect(elem._selectedItemText).to.equal('Irrelevant');
	});

});
