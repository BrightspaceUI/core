import { clickElem, expect, fixture, html, nextFrame, oneEvent, runConstructor, sendKeysElem } from '@brightspace-ui/testing';
import {
	createToolbar,
	createToolbarButton,
	createToolbarButtonToggle,
	createToolbarDropdown,
	openDropdown
} from './toolbar-fixtures.js';

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

		it('renders button with type="button"', async() => {
			const elem = await fixture(createToolbarButton());
			const button = elem.shadowRoot.querySelector('button');
			expect(button.getAttribute('type')).to.equal('button');
		});

		it('renders button with aria-label and title using the text', async() => {
			const elem = await fixture(createToolbarButton());
			const button = elem.shadowRoot.querySelector('button');
			expect(button.getAttribute('aria-label')).to.equal('Fancy Button');
			expect(button.getAttribute('title')).to.equal('Fancy Button');
		});

		it('renders button with aria-disabled="true" when disabled', async() => {
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
			await elem.updateComplete;
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

describe('d2l-toolbar-button-toggle', () => {

	describe('constructor', () => {

		it('should construct', () => {
			runConstructor('d2l-toolbar-button-toggle');
		});

	});

	describe('general', () => {

		it('renders button with type="button"', async() => {
			const elem = await fixture(createToolbarButtonToggle());
			const button = elem.shadowRoot.querySelector('button');
			expect(button.getAttribute('type')).to.equal('button');
		});

		it('renders button with aria-label and title using the text', async() => {
			const elem = await fixture(createToolbarButtonToggle());
			const button = elem.shadowRoot.querySelector('button');
			expect(button.getAttribute('aria-label')).to.equal('Fancy Button Toggle');
			expect(button.getAttribute('title')).to.equal('Fancy Button Toggle');
		});

		it('renders button with aria-pressed="false" when not pressed', async() => {
			const elem = await fixture(createToolbarButtonToggle({ pressed: false }));
			const button = elem.shadowRoot.querySelector('button');
			expect(button.getAttribute('aria-pressed')).to.equal('false');
		});

		it('renders button with aria-pressed="true" when pressed', async() => {
			const elem = await fixture(createToolbarButtonToggle({ pressed: true }));
			const button = elem.shadowRoot.querySelector('button');
			expect(button.getAttribute('aria-pressed')).to.equal('true');
		});

		it('renders button with aria-disabled="true" when disabled', async() => {
			const elem = await fixture(createToolbarButtonToggle({ disabled: true }));
			const button = elem.shadowRoot.querySelector('button');
			expect(button.getAttribute('aria-disabled')).to.equal('true');
			expect(button.hasAttribute('disabled')).to.equal(false);
		});

		it('renders button with tabindex="-1" when not active focusable', async() => {
			const elem = await fixture(createToolbarButtonToggle());
			const button = elem.shadowRoot.querySelector('button');
			expect(button.getAttribute('tabindex')).to.equal('-1');
		});

		it('renders button with tabindex="0" when active focusable', async() => {
			const elem = await fixture(createToolbarButtonToggle());
			const button = elem.shadowRoot.querySelector('button');
			elem._activeFocusable = true;
			await elem.updateComplete;
			expect(button.getAttribute('tabindex')).to.equal('0');
		});

		it('renders button without aria-expanded when not expandable', async() => {
			const elem = await fixture(createToolbarButtonToggle());
			const button = elem.shadowRoot.querySelector('button');
			expect(button.hasAttribute('aria-expanded')).to.equal(false);
		});

		it('renders button without aria-pressed when expandable', async() => {
			const elem = await fixture(createToolbarButtonToggle({ expandable: true }));
			const button = elem.shadowRoot.querySelector('button');
			expect(button.hasAttribute('aria-pressed')).to.equal(false);
		});

		it('renders button with aria-expanded="false" when expandable and not expanded', async() => {
			const elem = await fixture(createToolbarButtonToggle({ expandable: true, expanded: false }));
			const button = elem.shadowRoot.querySelector('button');
			expect(button.getAttribute('aria-expanded')).to.equal('false');
		});

		it('renders button with aria-expanded="true" when expandable and expanded', async() => {
			const elem = await fixture(createToolbarButtonToggle({ expandable: true, expanded: true }));
			const button = elem.shadowRoot.querySelector('button');
			expect(button.getAttribute('aria-expanded')).to.equal('true');
		});

		it('dispatches the d2l-toolbar-button-toggle-change event when enabled and clicked', async() => {
			const elem = await fixture(createToolbarButtonToggle());
			clickElem(elem);
			await oneEvent(elem, 'd2l-toolbar-button-toggle-change');
		});

		it('does not dispatch the d2l-toolbar-button-toggle-change event when disabled and clicked', async() => {
			let dispatched = false;
			const elem = await fixture(createToolbarButtonToggle({ disabled: true }));
			elem.addEventListener('click', () => dispatched = true);
			await clickElem(elem);
			expect(dispatched).to.equal(false);
		});

		it('sets pressed to true when when enabled and clicked', async() => {
			const elem = await fixture(createToolbarButtonToggle({ pressed: false }));
			await clickElem(elem);
			expect(elem.pressed).to.equal(true);
		});

		it('does not set pressed to true when when disabled and clicked', async() => {
			const elem = await fixture(createToolbarButtonToggle({ disabled: true, pressed: false }));
			await clickElem(elem);
			expect(elem.pressed).to.equal(false);
		});

		it('sets pressed to false when when enabled and clicked', async() => {
			const elem = await fixture(createToolbarButtonToggle({ pressed: true }));
			await clickElem(elem);
			expect(elem.pressed).to.equal(false);
		});

		it('does not set pressed to false when when disabled and clicked', async() => {
			const elem = await fixture(createToolbarButtonToggle({ disabled: true, pressed: true }));
			await clickElem(elem);
			expect(elem.pressed).to.equal(true);
		});

	});

});

describe('d2l-toolbar-dropdown', () => {

	describe('constructor', () => {

		it('should construct', () => {
			runConstructor('d2l-toolbar-dropdown');
		});

	});

	describe('general', () => {

		it('renders button with type="button"', async() => {
			const elem = await fixture(createToolbarDropdown());
			const button = elem.shadowRoot.querySelector('button');
			expect(button.getAttribute('type')).to.equal('button');
		});

		it('renders button with aria-label and title using the text', async() => {
			const elem = await fixture(createToolbarDropdown());
			const button = elem.shadowRoot.querySelector('button');
			expect(button.getAttribute('aria-label')).to.equal('Fancy Dropdown');
			expect(button.getAttribute('title')).to.equal('Fancy Dropdown');
		});

		it('renders button with aria-describedby when value-text is provided', async() => {
			const elem = await fixture(createToolbarDropdown({ text: 'Color', valueText: 'Amethyst' }));
			const button = elem.shadowRoot.querySelector('button');
			expect(button.getAttribute('aria-describedby')).to.equal('valueText');
		});

		it('renders button with aria-disabled="true" when disabled', async() => {
			const elem = await fixture(createToolbarDropdown({ disabled: true }));
			const button = elem.shadowRoot.querySelector('button');
			expect(button.getAttribute('aria-disabled')).to.equal('true');
			expect(button.hasAttribute('disabled')).to.equal(false);
		});

		it('renders button with tabindex="-1" when not active focusable', async() => {
			const elem = await fixture(createToolbarDropdown());
			const button = elem.shadowRoot.querySelector('button');
			expect(button.getAttribute('tabindex')).to.equal('-1');
		});

		it('renders button with tabindex="0" when active focusable', async() => {
			const elem = await fixture(createToolbarDropdown());
			const button = elem.shadowRoot.querySelector('button');
			elem._activeFocusable = true;
			await elem.updateComplete;
			expect(button.getAttribute('tabindex')).to.equal('0');
		});

		it('opens the dropdown when closed and button is clicked', async() => {
			const elem = await fixture(createToolbarDropdown());
			clickElem(elem);
			await oneEvent(elem, 'd2l-dropdown-open');
			expect(elem.opened).to.equal(true);
		});

		it('closes the dropdown when open and button is clicked', async() => {
			const elem = await fixture(createToolbarDropdown());
			await openDropdown(elem);
			expect(elem.opened).to.equal(true);
			clickElem(elem);
			await oneEvent(elem, 'd2l-dropdown-close');
			expect(elem.opened).to.equal(false);
		});

		it('opens the dropdown when down arrow is pressed', async() => {
			const elem = await fixture(createToolbarDropdown());
			const button = elem.shadowRoot.querySelector('button');
			sendKeysElem(button, 'press', 'ArrowDown');
			await oneEvent(elem, 'd2l-dropdown-open');
			expect(elem.opened).to.equal(true);
		});

		it('does not open the dropdown when disabled and down arrow is pressed', async() => {
			const elem = await fixture(createToolbarDropdown({ disabled: true }));
			const button = elem.shadowRoot.querySelector('button');
			await sendKeysElem(button, 'press', 'ArrowDown');
			expect(elem.opened).to.equal(false);
		});

		it('closes the dropdown when up arrow is pressed', async() => {
			const elem = await fixture(createToolbarDropdown());
			const button = elem.shadowRoot.querySelector('button');
			await openDropdown(elem);
			expect(elem.opened).to.equal(true);
			sendKeysElem(button, 'press', 'ArrowUp');
			await oneEvent(elem, 'd2l-dropdown-close');
			expect(elem.opened).to.equal(false);
		});

		it('closes the dropdown when open and button becomes disabled', async() => {
			const elem = await fixture(createToolbarDropdown());
			await openDropdown(elem);
			expect(elem.opened).to.equal(true);
			elem.disabled = true;
			await oneEvent(elem, 'd2l-dropdown-close');
			expect(elem.opened).to.equal(false);
		});

	});

});

describe('d2l-toolbar-separator', () => {

	describe('constructor', () => {

		it('should construct', () => {
			runConstructor('d2l-toolbar-separator');
		});

	});

});
