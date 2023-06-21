import './tag-list-item-mixin-consumer.js';
import '../tag-list.js';
import '../tag-list-item.js';
import { expect, fixture, html, nextFrame, oneEvent, waitUntil } from '@brightspace-ui/testing';
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

const clearableFixture = html`
	<d2l-tag-list description="Testing Tags" clearable>
		<d2l-tag-list-item key="tag" text="Tag"></d2l-tag-list-item>
		<d2l-tag-list-item key="another-tag" text="Another Tag"></d2l-tag-list-item>
		<d2l-tag-list-item key="long-tag" text="Another Very Very Very Very Very Long Tag"></d2l-tag-list-item>
		<d2l-tag-list-item-mixin-consumer name="Tag"></d2l-tag-list-item-mixin-consumer>
	</d2l-tag-list>
`;

const keyCodes = {
	BACKSPACE: 8,
	DELETE: 46,
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
				await waitUntil(() => list._items, 'List items did not become ready');

				const startItem = list._items[testcase.start];
				startItem.focus();
				dispatchKeydownEvent(startItem, testcase.key);

				await nextFrame();
				expect(getComposedActiveElement()).to.equal(list._items[testcase.result].shadowRoot.querySelector('.tag-list-item-content'));
			});
		});
	});

	describe('clearable', () => {
		it('should dispatch expected events when Clear All clicked', async() => {
			const elem = await fixture(clearableFixture);
			await waitUntil(() => elem._items, 'List items did not become ready');
			const button = elem.shadowRoot.querySelector('d2l-button-subtle.d2l-tag-list-clear-button');

			setTimeout(() => button.click());

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

	describe('display text', () => {
		it('should default to tagContent', async() => {
			const elem = await fixture(basicFixture);
			await waitUntil(() => elem._items, 'List items did not become ready');

			const child = elem.children[1];
			expect(child._displayText).to.be.equal('Another Tag');
		});

		it('should be set when provided', async() => {
			const elem = await fixture(basicFixture);
			await waitUntil(() => elem._items, 'List items did not become ready');

			const child = elem.children[3];
			expect(child._displayText).to.be.equal('Tag');
		});
	});

	describe('clearable items', () => {
		it('should dispatch expected event when clicked', async() => {
			const elem = await fixture(clearableFixture);
			await waitUntil(() => elem._items, 'List items did not become ready');

			const child = elem.children[0];
			const childButtonIcon = child.shadowRoot.querySelector('d2l-button-icon');
			setTimeout(() => childButtonIcon.click());
			const { detail } = await oneEvent(child, 'd2l-tag-list-item-clear');
			expect(detail.key).to.equal('tag');
		});

		it('should dispatch expected event when backspace pressed', async() => {
			const elem = await fixture(clearableFixture);
			await waitUntil(() => elem._items, 'List items did not become ready');

			const child = elem._items[1];
			child.focus();
			setTimeout(() => dispatchKeydownEvent(child, keyCodes.BACKSPACE));
			const { detail } = await oneEvent(child, 'd2l-tag-list-item-clear');
			expect(detail.key).to.equal('another-tag');
		});

		it('should dispatch expected event when delete pressed', async() => {
			const elem = await fixture(clearableFixture);
			await waitUntil(() => elem._items, 'List items did not become ready');

			const child = elem._items[2];
			child.focus();
			setTimeout(() => dispatchKeydownEvent(child, keyCodes.DELETE));
			const { detail } = await oneEvent(child, 'd2l-tag-list-item-clear');
			expect(detail.key).to.equal('long-tag');
		});

		it('should dispatch expected event when removed with no key', async() => {
			const elem = await fixture(clearableFixture);
			await waitUntil(() => elem._items, 'List items did not become ready');

			const child = elem._items[3];
			expect(child.key).to.be.undefined;
			child.focus();
			setTimeout(() => dispatchKeydownEvent(child, keyCodes.DELETE));
			const { detail } = await oneEvent(child, 'd2l-tag-list-item-clear');
			expect(detail.key).to.be.undefined;
		});
	});

});
