import './tag-list-item-mixin-consumer.js';
import '../tag-list.js';
import '../tag-list-item.js';
import { expect, fixture, html } from '@open-wc/testing';
import { getComposedActiveElement } from '../../../helpers/focus.js';
import { runConstructor } from '../../../tools/constructor-test-helper.js';

const basicFixture = html`
	<d2l-tag-list description="Testing Tags">
		<d2l-tag-list-item text="Tag"></d2l-tag-list-item>
		<d2l-tag-list-item text="Another Tag"></d2l-tag-list-item>
		<d2l-tag-list-item text="Another Very Very Very Very Very Long Tag"></d2l-tag-list-item>
		<d2l-tag-list-item-mixin-consumer name="Tag"></d2l-tag-list-item-mixin-consumer>
	</d2l-tag-list>
`;

const keyCodes = {
	RIGHT: 39,
	UP: 38
};

const dispatchKeydownEvent = (element, keycode) => {
	const event = new CustomEvent('keydown', {
		detail: 0,
		bubbles: true,
		cancelable: true,
		composed: true
	});
	event.keyCode = keycode;
	event.code = keycode;
	element.dispatchEvent(event);
};

describe('d2l-tag-list', () => {

	describe('constructor', () => {
		it('should construct list', () => {
			runConstructor('d2l-tag-list');
		});
	});

	describe('keyboard navigation', () => {
		// All iterations tested in the ArrowKeysMixin tests
		[
			{ name: 'Move focus with the arrow keys', key: keyCodes.RIGHT, start: 0, result: 1 },
			{ name: 'Focus wraps', key: keyCodes.UP, start: 0, result: 3 }
		].forEach(testcase => {
			it(testcase.name, async() => {
				const list = await fixture(basicFixture);
				await list.updateComplete;
				await new Promise(resolve => requestAnimationFrame(resolve));

				const startItem = list._items[testcase.start];
				await startItem.updateComplete;

				startItem.focus();
				dispatchKeydownEvent(startItem, testcase.key);

				await new Promise(resolve => requestAnimationFrame(resolve));
				expect(getComposedActiveElement()).to.equal(list._items[testcase.result]);
			});
		});
	});
});

describe('d2l-tag-list-item', () => {

	describe('constructor', () => {
		it('should construct tag-list-item', () => {
			runConstructor('d2l-tag-list-item');
		});
	});

});
