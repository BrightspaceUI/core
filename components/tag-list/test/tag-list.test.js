import './tag-list-item-mixin-consumer.js';
import '../tag-list.js';
import '../tag-list-item.js';
import { clickElem, expect, fixture, html, oneEvent, runConstructor, sendKeysElem } from '@brightspace-ui/testing';
import { getComposedActiveElement, getPreviousFocusable } from '../../../helpers/focus.js';

const basicFixture = html`
	<d2l-tag-list description="Testing Tags">
		<d2l-tag-list-item text="Tag"></d2l-tag-list-item>
		<d2l-tag-list-item text="Another Tag"></d2l-tag-list-item>
		<d2l-tag-list-item text="Another Very Very Very Very Very Long Tag"></d2l-tag-list-item>
		<d2l-tag-list-item-mixin-consumer name="Tag"></d2l-tag-list-item-mixin-consumer>
	</d2l-tag-list>
`;

const clearableFixture = html`
	<d2l-tag-list description="Testing Tags" clearable>
		<d2l-tag-list-item key="tag" text="Tag"></d2l-tag-list-item>
		<d2l-tag-list-item key="another-tag" text="Another Tag"></d2l-tag-list-item>
		<d2l-tag-list-item key="long-tag" text="Another Very Very Very Very Very Long Tag"></d2l-tag-list-item>
		<d2l-tag-list-item-mixin-consumer name="Tag"></d2l-tag-list-item-mixin-consumer>
	</d2l-tag-list>
`;

describe('d2l-tag-list', () => {

	describe('constructor', () => {
		it('should construct list', () => {
			runConstructor('d2l-tag-list');
		});
	});

	describe('keyboard navigation', () => {
		// All iterations tested in the ArrowKeysMixin tests
		[
			{ name: 'Move focus with the arrow keys', key: 'ArrowRight', start: 0, result: 1 },
			{ name: 'Focus wraps', key: 'ArrowUp', start: 0, result: 3 }
		].forEach(testcase => {
			it(testcase.name, async() => {
				const list = await fixture(basicFixture);

				const startItem = list._items[testcase.start];
				await sendKeysElem(startItem, 'press', testcase.key);

				expect(getComposedActiveElement()).to.equal(list._items[testcase.result].shadowRoot.querySelector('.tag-list-item-content'));
			});
		});

		[
			{ name: 'Tab exits list fowards', key: 'Tab', start: 3, result: list => list.shadowRoot.querySelector('.d2l-tag-list-clear-button').shadowRoot.querySelector('button') },
			{ name: 'Shift + tab exists list backwards', key: 'Shift+Tab', start: 3, result: list => getPreviousFocusable(list) }
		].forEach(testcase => {
			it(testcase.name, async() => {
				const list = await fixture(clearableFixture);
				const button = document.createElement('button');
				list.insertAdjacentElement('beforebegin', button);

				const startItem = list._items[testcase.start];
				await sendKeysElem(startItem, 'press', testcase.key);

				expect(getComposedActiveElement()).to.equal(testcase.result(list));
			});
		});

	});

	describe('clearable', () => {
		it('should dispatch expected events when Clear All clicked', async() => {
			const elem = await fixture(clearableFixture);
			const button = elem.shadowRoot.querySelector('d2l-button-subtle.d2l-tag-list-clear-button');

			clickElem(button);

			await oneEvent(elem, 'd2l-tag-list-clear');
		});
	});
});

describe('d2l-tag-list-item', () => {

	describe('constructor', () => {
		it('should construct tag-list-item', () => {
			runConstructor('d2l-tag-list-item');
		});
	});

	describe('plain text', () => {
		it('should be set to item text', async() => {
			const elem = await fixture(basicFixture);

			const child = elem.children[1];
			expect(child._plainText).to.be.equal('Another Tag');
		});
	});

	describe('clearable items', () => {
		it('should dispatch expected event when clicked', async() => {
			const elem = await fixture(clearableFixture);

			const child = elem.children[0];
			const childButtonIcon = child.shadowRoot.querySelector('d2l-button-icon');
			clickElem(childButtonIcon);
			const { detail } = await oneEvent(child, 'd2l-tag-list-item-clear');
			expect(detail.key).to.equal('tag');
		});

		it('should dispatch expected event when backspace pressed', async() => {
			const elem = await fixture(clearableFixture);

			const child = elem._items[1];
			sendKeysElem(child, 'press', 'Backspace');
			const { detail } = await oneEvent(child, 'd2l-tag-list-item-clear');
			expect(detail.key).to.equal('another-tag');
		});

		it('should dispatch expected event when delete pressed', async() => {
			const elem = await fixture(clearableFixture);

			const child = elem._items[2];
			sendKeysElem(child, 'press', 'Delete');
			const { detail } = await oneEvent(child, 'd2l-tag-list-item-clear');
			expect(detail.key).to.equal('long-tag');
		});

		it('should dispatch expected event when removed with no key', async() => {
			const elem = await fixture(clearableFixture);

			const child = elem._items[3];
			expect(child.key).to.be.undefined;
			sendKeysElem(child, 'press', 'Delete');
			const { detail } = await oneEvent(child, 'd2l-tag-list-item-clear');
			expect(detail.key).to.be.undefined;
		});
	});

});

describe('d2l-tag-list-item-mixin-consumer', () => {

	describe('constructor', () => {
		it('should construct tag-list-item-mixin-consumer', () => {
			runConstructor('d2l-tag-list-item-mixin-consumer');
		});
	});

	describe('plain text', () => {
		it('should be set when provided', async() => {
			const elem = await fixture(basicFixture);

			const child = elem.children[3];
			expect(child._plainText).to.be.equal('Tag');
		});
	});
});
