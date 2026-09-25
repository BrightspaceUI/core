import { clickElem, expect, fixture, html, nextFrame, oneEvent, runConstructor, sendKeysElem } from '@brightspace-ui/testing';
import { createToolbar, createToolbarButton } from './toolbar-fixtures.js';

describe('d2l-toolbar', () => {

	describe('constructor', () => {

		it('should construct', () => {
			runConstructor('d2l-toolbar');
		});

	});

	describe('general', () => {

		it('renders the toolbar role', async() => {
			const elem = (await fixture(createToolbar())).querySelector('d2l-toolbar');
			expect(elem.shadowRoot.querySelector('[role]').role).to.equal('toolbar');
		});

		it('renders the label', async() => {
			const elem = (await fixture(createToolbar())).querySelector('d2l-toolbar');
			expect(elem.shadowRoot.querySelector('[role="toolbar"]').getAttribute('aria-label')).to.equal('Fancy Toolbar');
		});

	});

	describe('focus management', () => {

		it('initializes first focusable as active focusable', async() => {
			const elem = (await fixture(createToolbar())).querySelector('d2l-toolbar');
			const firstFocusable = elem.firstElementChild;
			expect(firstFocusable._activeFocusable).to.equal(true);
		});

		it('focuses the active focusable when moving focus into the toolbar', async() => {
			const elem = await fixture(html`
				<div>
					<div tabindex="0">before</div>
					${createToolbar()}
				</div>
			`);
			const initialFocusable = elem.querySelector('div[tabindex]');
			const toolbar = elem.querySelector('d2l-toolbar');
			const expectedFocusable = toolbar.children[1];

			toolbar.setActiveFocusable(expectedFocusable);
			initialFocusable.focus();

			await sendKeysElem(initialFocusable, 'press', 'Tab');
			expect(document.activeElement).to.equal(expectedFocusable);
		});

		it('does not change the active focsuable when focus moves out of the toolbar', async() => {
			const elem = await fixture(html`
				<div>
					${createToolbar()}
					<div tabindex="0">after</div>
				</div>
			`);
			const expectedFocusable = elem.querySelector('div[tabindex]');
			const toolbar = elem.querySelector('d2l-toolbar');
			const initialFocusable = toolbar.children[2];

			toolbar.setActiveFocusable(initialFocusable);
			initialFocusable.focus();

			await sendKeysElem(initialFocusable, 'press', 'Tab');
			expect(initialFocusable._activeFocusable).to.equal(true);
			expect(document.activeElement).to.equal(expectedFocusable);
		});

		[
			{ name: 'right arrow moves focus next', initialIndex: 1, key: 'ArrowRight', expectedIndex: 2 },
			{ name: 'left arrow moves focus previous', initialIndex: 2, key: 'ArrowLeft', expectedIndex: 1 },
			{ name: 'right arrow wraps focus first', initialIndex: 3, key: 'ArrowRight', expectedIndex: 0 },
			{ name: 'left arrow wraps focus last', initialIndex: 0, key: 'ArrowLeft', expectedIndex: 3 },
			{ name: 'home moves focus first', initialIndex: 2, key: 'Home', expectedIndex: 0 },
			{ name: 'end moves focus last', initialIndex: 1, key: 'End', expectedIndex: 3 },
			{ name: 'right arrow moves focus previous when rtl', rtl: true, initialIndex: 2, key: 'ArrowRight', expectedIndex: 1 },
			{ name: 'left arrow moves focus next when rtl', rtl: true, initialIndex: 1, key: 'ArrowLeft', expectedIndex: 2 },
			{ name: 'right arrow wraps focus last when rtl', rtl: true, initialIndex: 0, key: 'ArrowRight', expectedIndex: 3 },
			{ name: 'left arrow wraps focus first when rtl', rtl: true, initialIndex: 3, key: 'ArrowLeft', expectedIndex: 0 },
			{ name: 'home moves focus first when rtl', rtl: true, initialIndex: 2, key: 'Home', expectedIndex: 0 },
			{ name: 'end moves focus last when rtl', rtl: true, initialIndex: 1, key: 'End', expectedIndex: 3 }
		].forEach(({ name, rtl, initialIndex, key, expectedIndex }) => {
			it(name, async() => {
				const elem = await fixture(createToolbar(), { rtl });
				const toolbar = elem.querySelector('d2l-toolbar');
				const initialElem = toolbar.children[initialIndex];

				toolbar.setActiveFocusable(initialElem);
				await sendKeysElem(initialElem, 'press', key);
				await nextFrame();
				expect(toolbar.children[expectedIndex]._activeFocusable).to.equal(true);
				expect(document.activeElement).to.equal(toolbar.children[expectedIndex]);
			});
		});

	});

});

describe('d2l-toolbar-button', () => {

	describe('constructor', () => {

		it('should construct', () => {
			runConstructor('d2l-toolbar-button');
		});

	});

	describe('general', () => {

		it('renders button with aria-label and title using the text', async() => {
			const elem = await fixture(createToolbarButton());
			const button = elem.shadowRoot.querySelector('button');
			expect(button.getAttribute('aria-label')).to.equal('Fancy Button');
			expect(button.getAttribute('title')).to.equal('Fancy Button');
		});

		it('renders button with aria-disabled when disabled', async() => {
			const elem = await fixture(createToolbarButton({ disabled: true }));
			const button = elem.shadowRoot.querySelector('button');
			expect(button.getAttribute('aria-disabled')).to.equal('true');
			expect(button.hasAttribute('disabled')).to.equal(false);
		});

		it('renders button with tabindex="-1" when not active focusable', async() => {
			const elem = await fixture(createToolbarButton());
			const button = elem.shadowRoot.querySelector('button');
			expect(button.getAttribute('tabindex')).to.equal('-1');
		});

		it('renders button with tabindex="0" when active focusable', async() => {
			const elem = await fixture(createToolbarButton());
			const button = elem.shadowRoot.querySelector('button');
			elem._activeFocusable = true;
			await button.updateComplete;
			expect(button.getAttribute('tabindex')).to.equal('0');
		});

		it('dispatches the click event when enabled and clicked', async() => {
			const elem = await fixture(createToolbarButton());
			clickElem(elem);
			await oneEvent(elem, 'click');
		});

		it('does not dispatch the click event when disabled and clicked', async() => {
			let dispatched = false;
			const elem = await fixture(createToolbarButton({ disabled: true }));
			elem.addEventListener('click', () => dispatched = true);
			await clickElem(elem);
			expect(dispatched).to.equal(false);
		});

	});

});
