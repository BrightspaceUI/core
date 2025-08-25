import '../menu.js';
import '../menu-item.js';
import '../menu-item-radio.js';
import './custom-slots.js';
import { clickElem, defineCE, expect, fixture, focusElem, html, nextFrame, oneEvent, runConstructor, sendKeys, sendKeysElem, waitUntil } from '@brightspace-ui/testing';
import { createMessage } from '../../../mixins/property-required/property-required-mixin.js';
import { LitElement } from 'lit';
import { MenuItemMixin } from '../menu-item-mixin.js';

describe('d2l-menu', () => {

	describe('accessibility', () => {

		let elem;
		beforeEach(async() => {
			elem = await fixture(html`
				<d2l-menu label="menu label">
					<d2l-menu-item text="item 1"></d2l-menu-item>
					<d2l-menu-item text="item 2"></d2l-menu-item>
				</d2l-menu>
			`);
		});

		it('has role="menu"', () => {
			expect(elem.getAttribute('role')).to.equal('menu');
		});

		it('has "aria-label" equal to label text', () => {
			expect(elem.getAttribute('aria-label')).to.equal('menu label');
		});

	});

	describe('constructor', () => {

		it('should construct menu', () => {
			runConstructor('d2l-menu');
		});

		it('should construct menu-item', () => {
			runConstructor('d2l-menu-item');
		});

	});

	describe('focus management', () => {

		let elem;
		beforeEach(async() => {
			elem = await fixture(html`
				<d2l-menu>
					<d2l-menu-item id="hidden_a" text="a" hidden></d2l-menu-item>
					<d2l-menu-item id="a1" text="a"></d2l-menu-item>
					<d2l-menu-item id="b1" text="b" disabled></d2l-menu-item>
					<d2l-menu-item id="a2" text="a"></d2l-menu-item>
					<d2l-menu-item id="c1" text="C"></d2l-menu-item>
					<d2l-menu-item id="d1" text="d"></d2l-menu-item>
				</d2l-menu>
			`);
			await nextFrame();
		});

		it('sets tabindex equal to 0 for first menu item', () => {
			expect(elem.querySelector('#a1').getAttribute('tabindex')).to.equal('0');
		});

		it('sets tabindex equal to -1 for hidden menu item', () => {
			expect(elem.querySelector('#hidden_a').getAttribute('tabindex')).to.equal('-1');
		});

		it('sets tabindex equal to -1 for menu items after first menu item', () => {
			const items = elem.querySelector('d2l-menu-item');
			for (let i = 1; i < items.length; i++) {
				expect(items[i].getAttribute('tabindex')).to.equal('-1');
			}
		});

		it('focuses on first visible menu item when focus() is called', async() => {
			await focusElem(elem);
			expect(document.activeElement).to.equal(elem.querySelector('#a1'));
		});

		it('moves focus to next focusable item when down arrow is pressed', async() => {
			await sendKeysElem(elem.querySelector('#c1'), 'press', 'ArrowDown');
			expect(elem.querySelector('#a1').getAttribute('tabindex')).to.equal('0');
			expect(elem.querySelector('#c1').getAttribute('tabindex')).to.equal('-1');
			expect(elem.querySelector('#d1').getAttribute('tabindex')).to.equal('0');
			expect(document.activeElement).to.equal(elem.querySelector('#d1'));
		});

		it('moves focus to previous focusable item when up arrow is pressed', async() => {
			await sendKeysElem(elem.querySelector('#d1'), 'press', 'ArrowUp');
			expect(elem.querySelector('#d1').getAttribute('tabindex')).to.equal('-1');
			expect(elem.querySelector('#c1').getAttribute('tabindex')).to.equal('0');
			expect(document.activeElement).to.equal(elem.querySelector('#c1'));
		});

		it('moves focus to first focusable item when down arrow is pressed on last focusable item', async() => {
			await sendKeysElem(elem.querySelector('#d1'), 'press', 'ArrowDown');
			expect(elem.querySelector('#d1').getAttribute('tabindex')).to.equal('-1');
			expect(elem.querySelector('#a1').getAttribute('tabindex')).to.equal('0');
			expect(document.activeElement).to.equal(elem.querySelector('#a1'));
		});

		it('moves focus to last focusable item when up arrow is pressed on first focusable item', async() => {
			await sendKeysElem(elem.querySelector('#a1'), 'press', 'ArrowUp');
			expect(elem.querySelector('#a1').getAttribute('tabindex')).to.equal('-1'); // first item
			expect(elem.querySelector('#d1').getAttribute('tabindex')).to.equal('0');
			expect(document.activeElement).to.equal(elem.querySelector('#d1'));
		});

		it('sets focus to disabled menu items', async() => {
			await sendKeysElem(elem.querySelector('#a1'), 'press', 'ArrowDown');
			expect(elem.querySelector('#a1').getAttribute('tabindex')).to.equal('-1'); // first item
			expect(elem.querySelector('#b1').getAttribute('tabindex')).to.equal('0');
			expect(document.activeElement).to.equal(elem.querySelector('#b1'));
		});

		it('sets focus to next item that starts with character pressed', async() => {
			await sendKeysElem(elem.querySelector('#a1'), 'press', 'c');
			expect(elem.querySelector('#a1').getAttribute('tabindex')).to.equal('-1'); // first item
			expect(elem.querySelector('#c1').getAttribute('tabindex')).to.equal('0');
			expect(document.activeElement).to.equal(elem.querySelector('#c1'));
		});

		it('sets focus to next item that starts with uppercase character pressed', async() => {
			await sendKeysElem(elem.querySelector('#a1'), 'press', 'C');
			expect(elem.querySelector('#a1').getAttribute('tabindex')).to.equal('-1'); // first item
			expect(elem.querySelector('#c1').getAttribute('tabindex')).to.equal('0');
			expect(document.activeElement).to.equal(elem.querySelector('#c1'));
		});

		it('sets focus by rolling over to beginning of menu when searching if necessary', async() => {
			await sendKeysElem(elem.querySelector('#c1'), 'press', 'b');
			expect(elem.querySelector('#c1').getAttribute('tabindex')).to.equal('-1');
			expect(elem.querySelector('#b1').getAttribute('tabindex')).to.equal('0');
			expect(document.activeElement).to.equal(elem.querySelector('#b1'));
		});

		it('focuses on the selected radio menu item when focus() is called', async() => {
			elem = await fixture(html`
				<d2l-menu>
					<d2l-menu-item-radio id="r1" text="1"></d2l-menu-item-radio>
					<d2l-menu-item-radio id="r2" text="2"></d2l-menu-item-radio>
					<d2l-menu-item-radio id="r3" text="3" selected></d2l-menu-item-radio>
					<d2l-menu-item-radio id="r4" text="4"></d2l-menu-item-radio>
				</d2l-menu>
			`);
			await nextFrame();
			await focusElem(elem);
			expect(elem.querySelector('#r3').getAttribute('tabindex')).to.equal('0');
			await expect(document.activeElement).to.equal(elem.querySelector('#r3'));
		});

	});

	describe('nested menu', () => {

		let elem, nestedMenu;
		beforeEach(async() => {
			elem = await fixture(html`
				<d2l-menu id="menu">
					<d2l-menu-item id="a1" text="a1"></d2l-menu-item>
					<d2l-menu-item id="b1" text="b">
						<d2l-menu id="nestedMenu">
							<d2l-menu-item id="a2" text="a2"></d2l-menu-item>
							<d2l-menu-item id="b2" text="b2"></d2l-menu-item>
						</d2l-menu>
					</d2l-menu-item>
					<d2l-menu-item id="c1" text="c1"></d2l-menu-item>
				</d2l-menu>
			`);
			nestedMenu = elem.querySelector('#nestedMenu');
		});

		async function openNestedMenu() {
			setTimeout(() => clickElem(elem.querySelector('#b1')));
			await oneEvent(elem, 'd2l-hierarchical-view-show-complete');
		}

		it('sets label for nested menu to the opener item text', () => {
			expect(nestedMenu.getAttribute('aria-label')).to.equal('b');
		});

		it('shows nested menu when opener is clicked', async() => {
			await openNestedMenu();
			expect(nestedMenu.isActive()).to.be.true;
		});

		it('sets focus to d2l-menu-item-return when nested menu is displayed', async() => {
			await openNestedMenu();
			await waitUntil(() => {
				return (document.activeElement.tagName === 'D2L-MENU-ITEM-RETURN') ||
					(document.activeElement === nestedMenu);
			}, 'Focus on return');
			expect(elem.querySelector('#a1').getAttribute('tabindex')).to.equal('0');
			expect(elem.querySelector('#b1').hasAttribute('tabindex')).to.be.false;
			const returnItem = elem.querySelector('#nestedMenu')._getMenuItemReturn();
			expect(returnItem.getAttribute('tabindex')).to.equal('0');
		});

		it('moves focus to next focusable item when down arrow is pressed', async() => {
			await openNestedMenu();

			const returnItem = elem.querySelector('#nestedMenu')._getMenuItemReturn();
			await sendKeysElem(returnItem, 'press', 'ArrowDown');

			expect(returnItem.getAttribute('tabindex')).to.equal('-1');
			expect(elem.querySelector('#a2').getAttribute('tabindex')).to.equal('0');
			expect(document.activeElement).to.equal(elem.querySelector('#a2'));
		});

		it('shows nested menu when right arrow is pressed on opener', async() => {
			setTimeout(() => sendKeysElem(elem.querySelector('#b1'), 'press', 'ArrowRight'));
			await oneEvent(elem, 'd2l-hierarchical-view-show-complete');
			expect(nestedMenu.isActive()).to.be.true;
		});

		it('hides nested menu when left arrow is pressed in nested menu', async() => {
			await openNestedMenu();
			setTimeout(() => sendKeysElem(elem.querySelector('#b2'), 'press', 'ArrowLeft'));
			await oneEvent(elem, 'd2l-hierarchical-view-hide-complete');
			expect(elem.isActive()).to.be.true;

			expect(elem.querySelector('#a1').getAttribute('tabindex')).to.equal('-1');
			expect(elem.querySelector('#b1').getAttribute('tabindex')).to.equal('0');
		});

		it('hides nested menu when escape is pressed in nested menu', async() => {
			await openNestedMenu();
			setTimeout(() => sendKeysElem(elem.querySelector('#b2'), 'press', 'Escape'));
			await oneEvent(elem, 'd2l-hierarchical-view-hide-complete');
			expect(elem.isActive()).to.be.true;
		});

		it('hides nested menu when d2l-menu-item-return is clicked', async() => {
			await openNestedMenu();
			const returnItem = elem.querySelector('#nestedMenu')._getMenuItemReturn();
			setTimeout(() => clickElem(returnItem));
			await oneEvent(elem, 'd2l-hierarchical-view-hide-complete');
			expect(elem.isActive()).to.be.true;
		});

		it('resets focusables when hiding nested menu', async() => {
			await openNestedMenu();
			await sendKeys('press', 'ArrowDown');
			expect(elem.querySelector('#a2').getAttribute('tabindex')).to.equal('0');
			sendKeys('press', 'Escape');
			await oneEvent(elem, 'd2l-hierarchical-view-hide-complete');
			expect(elem.querySelector('#a2').getAttribute('tabindex')).to.equal('-1');
		});

	});

	describe('slots', () => {

		let elem;
		beforeEach(async() => {
			elem = await fixture(html`
				<d2l-custom-slots>
					<d2l-menu-item id="item1" text="1"></d2l-menu-item>
					<d2l-menu-item id="item2" text="2"></d2l-menu-item>
				</d2l-custom-slots>
			`);
			await nextFrame();
		});

		it('initializes menu items in nested slots', async() => {
			expect(elem.querySelector('#item1').getAttribute('tabindex')).to.equal('0');
			expect(elem.querySelector('#item2').getAttribute('tabindex')).to.equal('-1');
		});

	});

	it('waits for slow menu items to render', async() => {

		let makeReady;
		const delayedUpdateMenuItem = defineCE(
			class extends MenuItemMixin(LitElement) {
				static get properties() {
					return {
						_ready: { type: Boolean, state: true }
					};
				}
				constructor() {
					super();
					this._ready = false;
					this._readyPromise = new Promise((resolve) => makeReady = resolve);
					this._readyPromise.then(() => this._ready = true);
				}
				async getUpdateComplete() {
					await super.getUpdateComplete();
					return this._readyPromise;
				}
				render() {
					return 'i am slow';
				}
				shouldUpdate(changedProperties) {
					if (!this._ready) return false;
					return super.shouldUpdate(changedProperties);
				}
			}
		);

		const elemPromise = fixture(`
			<d2l-menu>
				<d2l-menu-item text="fast"></d2l-menu-item>
				<${delayedUpdateMenuItem}></${delayedUpdateMenuItem}>
				<span>not a menu item</span>
			</d2l-menu>
		`);
		await waitUntil(() => makeReady !== undefined);
		setTimeout(() => makeReady());
		const elem = await elemPromise;

		const items = await elem._getMenuItems();
		expect(items.length).to.equal(2);

	});

	describe('validation', () => {
		it('should throw when label is missing', async() => {
			const elem = await fixture(html`<d2l-menu></d2l-menu>`);
			expect(() => elem.flushRequiredPropertyErrors())
				.to.throw(TypeError, createMessage(elem, 'label'));
		});

		it('should not throw when label is provided', async() => {
			const elem = await fixture(html`<d2l-menu label="options"></d2l-menu>`);
			expect(() => elem.flushRequiredPropertyErrors()).to.not.throw();
		});

		it('should not throw when label is provided as a nested menu', async() => {
			const elem = await fixture(html`
				<d2l-menu label="options">
					<d2l-menu-item text="option 1">
						<d2l-menu>
							<d2l-menu-item text="option 1A"></d2l-menu-item>
						</d2l-menu>
					</d2l-menu-item>
				</d2l-menu>
			`);
			expect(() => elem.flushRequiredPropertyErrors()).to.not.throw();
		});
	});

});
