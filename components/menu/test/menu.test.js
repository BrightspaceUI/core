import '../menu.js';
import '../menu-item.js';
import { expect, fixture, html, nextFrame, oneEvent } from '@open-wc/testing';

function dispatchKeyEvent(elem, key) {
	const eventObj = document.createEvent('Events');
	eventObj.initEvent('keydown', true, true);
	eventObj.keyCode = key;
	elem.dispatchEvent(eventObj);
}

describe('d2l-menu', () => {

	describe('accessibility', () => {

		let elem;
		beforeEach(async() => {
			elem = await fixture(html`
				<d2l-menu label="menu label">
					<d2l-menu-item></d2l-menu-item>
					<d2l-menu-item></d2l-menu-item>
				</d2l-menu>
			`);
		});

		it('should pass all aXe tests', async() => {
			await expect(elem).to.be.accessible;
		});

		it('has role="menu"', () => {
			expect(elem.getAttribute('role')).to.equal('menu');
		});

		it('has "aria-label" equal to label text', () => {
			expect(elem.getAttribute('aria-label')).to.equal('menu label');
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
					<d2l-menu-item id="c1" text="c"></d2l-menu-item>
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

		it('focuses on first visible menu item when focus() is called', () => {
			elem.focus();
			expect(document.activeElement).to.equal(elem.querySelector('#a1'));
		});

		it('moves focus to next focusable item when down arrow is pressed', () => {
			dispatchKeyEvent(elem.querySelector('#c1'), 40);
			expect(document.activeElement).to.equal(elem.querySelector('#d1'));
		});

		it('moves focus to previous focusable item when up arrow is pressed', () => {
			dispatchKeyEvent(elem.querySelector('#d1'), 38);
			expect(document.activeElement).to.equal(elem.querySelector('#c1'));
		});

		it('moves focus to first focusable item when down arrow is pressed on last focusable item', () => {
			dispatchKeyEvent(elem.querySelector('#d1'), 40);
			expect(document.activeElement).to.equal(elem.querySelector('#a1'));
		});

		it('moves focus to last focusable item when up arrow is pressed on first focusable item', () => {
			dispatchKeyEvent(elem.querySelector('#a1'), 38);
			expect(document.activeElement).to.equal(elem.querySelector('#d1'));
		});

		it('sets focus to disabled menu items', () => {
			dispatchKeyEvent(elem.querySelector('#a1'), 40);
			expect(document.activeElement).to.equal(elem.querySelector('#b1'));
		});

		it('sets focus to next item that starts with character pressed', () => {
			const eventObj = document.createEvent('Events');
			eventObj.initEvent('keypress', true, true);
			eventObj.charCode = 99;
			elem.querySelector('#a1').dispatchEvent(eventObj);
			expect(document.activeElement).to.equal(elem.querySelector('#c1'));
		});

		it('sets focus by rolling over to beginning of menu when searching if necessary', () => {
			const eventObj = document.createEvent('Events');
			eventObj.initEvent('keypress', true, true);
			eventObj.charCode = 98;
			elem.querySelector('#c1').dispatchEvent(eventObj);
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
			elem.focus();
			await expect(document.activeElement).to.equal(elem.querySelector('#r3'));
		});

	});

	describe('nested menu', () => {

		let elem, nestedMenu;
		beforeEach(async() => {
			elem = await fixture(html`
				<d2l-menu id="menu">
					<d2l-menu-item id="a1"></d2l-menu-item>
					<d2l-menu-item id="b1" text="b">
						<d2l-menu id="nestedMenu">
							<d2l-menu-item id="a2"></d2l-menu-item>
							<d2l-menu-item id="b2"></d2l-menu-item>
						</d2l-menu>
					</d2l-menu-item>
					<d2l-menu-item id="c1"></d2l-menu-item>
				</d2l-menu>
			`);
			nestedMenu = elem.querySelector('#nestedMenu');
		});

		it('sets label for nested menu to the opener item text', () => {
			expect(nestedMenu.getAttribute('aria-label')).to.equal('b');
		});

		it('shows nested menu when opener is clicked', async() => {
			setTimeout(() => elem.querySelector('#b1').click());
			await oneEvent(elem, 'd2l-hierarchical-view-show-complete');
			expect(nestedMenu.isActive()).to.be.true;
		});

		it('sets focus to d2l-menu-item-return when nested menu is displayed', async() => {
			setTimeout(() => elem.querySelector('#b1').click());
			await oneEvent(elem, 'd2l-hierarchical-view-show-complete');
			let focused = (document.activeElement.tagName === 'D2L-MENU-ITEM-RETURN');
			if (!focused) {
				focused = (document.activeElement === nestedMenu);
			}
			expect(focused).to.be.true;
		});

		it('shows nested menu when right arrow is pressed on opener', async() => {
			setTimeout(() => dispatchKeyEvent(elem.querySelector('#b1'), 39));
			await oneEvent(elem, 'd2l-hierarchical-view-show-complete');
			expect(nestedMenu.isActive()).to.be.true;
		});

		it('hides nested menu when left arrow is pressed in nested menu', async() => {
			setTimeout(() => elem.querySelector('#b1').click());
			await oneEvent(elem, 'd2l-hierarchical-view-show-complete');
			setTimeout(() => dispatchKeyEvent(elem.querySelector('#b2'), 37));
			await oneEvent(elem, 'd2l-hierarchical-view-hide-complete');
			expect(elem.isActive()).to.be.true;
		});

		it('hides nested menu when escape is pressed in nested menu', async() => {
			setTimeout(() => elem.querySelector('#b1').click());
			await oneEvent(elem, 'd2l-hierarchical-view-show-complete');
			const eventObj = document.createEvent('Events');
			eventObj.initEvent('keyup', true, true);
			eventObj.keyCode = 27;
			setTimeout(() => elem.querySelector('#b2').dispatchEvent(eventObj));
			await oneEvent(elem, 'd2l-hierarchical-view-hide-complete');
			expect(elem.isActive()).to.be.true;
		});

		it('hides nested menu when d2l-menu-item-return is clicked', async() => {
			setTimeout(() => elem.querySelector('#b1').click());
			await oneEvent(elem, 'd2l-hierarchical-view-show-complete');
			const returnItem = elem.querySelector('#nestedMenu')._getMenuItemReturn();
			setTimeout(() => returnItem.click());
			await oneEvent(elem, 'd2l-hierarchical-view-hide-complete');
			expect(elem.isActive()).to.be.true;
		});

	});

});
