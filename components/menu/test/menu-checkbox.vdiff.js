import '../menu.js';
import '../menu-item-checkbox.js';
import { clickElem, expect, fixture, html } from '@brightspace-ui/testing';

function createMenu(opts) {
	const { disabled, selected } = { disabled: false, selected: false, ...opts };
	return html`
		<d2l-menu>
			<d2l-menu-item-checkbox value="1" text="a"></d2l-menu-item-checkbox>
			<d2l-menu-item-checkbox ?disabled="${disabled}" ?selected="${selected}" value="2" text="b"></d2l-menu-item-checkbox>
		</d2l-menu>
	`;
}

describe('menu-checkbox', () => {
	[
		{ name: 'normal', template: createMenu() },
		{ name: 'selected', template: createMenu({ selected: true }) },
		{ name: 'rtl', rtl: true, template: createMenu({ selected: true }) },
		{ name: 'disabled', template: createMenu({ disabled: true }) },
		{ name: 'supporting', template: html`
			<d2l-menu>
				<d2l-menu-item-checkbox value="1" text="a">
					<div slot="supporting">supporting</div>
				</d2l-menu-item-checkbox>
				<d2l-menu-item-checkbox value="2" selected text="b">
					<div slot="supporting">supporting</div>
				</d2l-menu-item-checkbox>
			</d2l-menu>
		` },
		{ name: 'long', template: html`
			<d2l-menu>
				<d2l-menu-item-checkbox selected text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."></d2l-menu-item-checkbox>
			</d2l-menu>
		` },
		{ name: 'dark', template: html`
			<d2l-menu theme="dark">
				<d2l-menu-item-checkbox value="1" text="normal"></d2l-menu-item-checkbox>
				<d2l-menu-item-checkbox value="2" text="selected" selected></d2l-menu-item-checkbox>
				<d2l-menu-item-checkbox value="3" text="disabled" disabled></d2l-menu-item-checkbox>
				<d2l-menu-item-checkbox value="4" text="supporting">
					<div slot="supporting">supporting</div>
				</d2l-menu-item-checkbox>
			</d2l-menu>
		` }
	].forEach(({ name, rtl, template }) => {
		it(name, async() => {
			const elem = await fixture(template, { rtl });
			await expect(elem).to.be.golden();
		});
	});

	it('does not select disabled item', async() => {
		const elem = await fixture(createMenu({ disabled: true }));
		await clickElem(elem.querySelector('d2l-menu-item-checkbox[value="2"]'));
		await expect(elem).to.be.golden();
	});

	describe('selection behavior', () => {
		it('selects when clicked', async() => {
			const elem = await fixture(createMenu());
			await clickElem(elem.querySelector('d2l-menu-item-checkbox[value="1"]'));
			await expect(elem).to.be.golden();
		});

		it('selects multiple when clicked', async() => {
			const elem = await fixture(createMenu());
			await clickElem(elem.querySelector('d2l-menu-item-checkbox[value="1"]'));
			await clickElem(elem.querySelector('d2l-menu-item-checkbox[value="2"]'));
			await expect(elem).to.be.golden();
		});

		it('de-selects when clicked twice', async() => {
			const elem = await fixture(createMenu());
			await clickElem(elem.querySelector('d2l-menu-item-checkbox[value="1"]'));
			await clickElem(elem.querySelector('d2l-menu-item-checkbox[value="1"]'));
			await expect(elem).to.be.golden();
		});
	});
});
