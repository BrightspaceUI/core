import '../../button/button.js';
import '../../menu/menu.js';
import '../../menu/menu-item.js';
import '../dropdown.js';
import '../dropdown-menu.js';
import { clickElem, expect, fixture, html, oneEvent } from '@brightspace-ui/testing';
import { ifDefined } from 'lit/directives/if-defined.js';

const nestedDropdownMenu = html`
	<d2l-dropdown>
		<button class="d2l-dropdown-opener">Open it!</button>
		<d2l-dropdown-menu class="vdiff-include">
			<d2l-menu label="Astronomy">
				<d2l-menu-item text="Introduction"></d2l-menu-item>
				<d2l-menu-item text="Searching for the Heavens "></d2l-menu-item>
				<d2l-menu-item text="The Solar System" id="next-page">
					<d2l-menu>
						<d2l-menu-item text="Formation"></d2l-menu-item>
						<d2l-menu-item text="Modern Solar System"></d2l-menu-item>
						<d2l-menu-item text="Future Solar System"></d2l-menu-item>
						<d2l-menu-item text="The Sun"></d2l-menu-item>
						<d2l-menu-item text="Solar &amp; Lunar Eclipses"></d2l-menu-item>
						<d2l-menu-item text="Meteors &amp; Meteorites"></d2l-menu-item>
						<d2l-menu-item text="Asteroids"></d2l-menu-item>
						<d2l-menu-item text="Comets"></d2l-menu-item>
					</d2l-menu>
				</d2l-menu-item>
				<d2l-menu-item text="The Universe"></d2l-menu-item>
			</d2l-menu>
		</d2l-dropdown-menu>
	</d2l-dropdown>
`;

const createMenu = (dark) => html`
	<d2l-menu label="Astronomy" theme="${ifDefined(dark ? 'dark' : undefined)}">
		<d2l-menu-item text="Introduction"></d2l-menu-item>
		<d2l-menu-item text="Searching for the Heavens"></d2l-menu-item>
		<d2l-menu-item text="The Universe"></d2l-menu-item>
	</d2l-menu>
`;

const dropdownRadioMenu = html`
	<d2l-menu label="Astronomy">
    	<d2l-menu-item-radio text="Chapter 0" value="0"></d2l-menu-item-radio>
    	<d2l-menu-item-radio text="Chapter 1" value="1"></d2l-menu-item-radio>
    	<d2l-menu-item-radio text="Chapter 2" value="2"></d2l-menu-item-radio>
    </d2l-menu>
`;

const menuWithHeaderFooter = html`
	<div slot="header">Topics</div>
	${createMenu()}
	<div slot="footer">Available 2020</div>
`;

describe('dropdown-menu', () => {
	it('initially opened', async() => {
		const elem = await fixture(html`
			<d2l-dropdown style="margin-top: 300px;">
				<button class="d2l-dropdown-opener">Open it!</button>
				<d2l-dropdown-menu opened class="vdiff-include">
					${createMenu()}
				</d2l-dropdown-menu>
			</d2l-dropdown>
		`, { viewport: { height: 400 } });
		await expect(elem).to.be.golden();
	});

	it('first-page', async() => {
		const elem = await fixture(nestedDropdownMenu);
		elem.toggleOpen();
		await oneEvent(elem, 'd2l-dropdown-open');
		await expect(elem).to.be.golden();
	});

	/* Prevent regression to DE37329: reopening caused extra bottom spacing */
	it('closed-reopened', async() => {
		const elem = await fixture(nestedDropdownMenu);
		elem.toggleOpen();
		await oneEvent(elem, 'd2l-dropdown-open');
		elem.toggleOpen();
		await oneEvent(elem, 'd2l-dropdown-close');
		elem.toggleOpen();
		await oneEvent(elem, 'd2l-dropdown-open');
		await expect(elem).to.be.golden();
	});

	it('with-header-footer', async() => {
		const elem = await fixture(html`
			<d2l-dropdown>
				<button class="d2l-dropdown-opener">Open it!</button>
				<d2l-dropdown-menu class="vdiff-include">
					${menuWithHeaderFooter}
				</d2l-dropdown-menu>
			</d2l-dropdown>
		`);
		elem.toggleOpen();
		await oneEvent(elem, 'd2l-dropdown-open');
		await expect(elem).to.be.golden();
	});

	it('with-header-footer-mobile', async() => {
		const elem = await fixture(html`
			<d2l-dropdown>
				<button class="d2l-dropdown-opener">Open it!</button>
				<d2l-dropdown-menu mobile-tray="right">
					${menuWithHeaderFooter}
				</d2l-dropdown-menu>
			</d2l-dropdown>
		`, { viewport: { width: 300 } });
		elem.toggleOpen();
		await oneEvent(elem, 'd2l-dropdown-open');
		await expect(document).to.be.golden();
	});

	it('with-nopadding-header-footer', async() => {
		const elem = await fixture(html`
			<d2l-dropdown>
				<button class="d2l-dropdown-opener">Open it!</button>
				<d2l-dropdown-menu no-padding-header no-padding-footer class="vdiff-include">
					${menuWithHeaderFooter}
				</d2l-dropdown-menu>
			</d2l-dropdown>
		`);
		elem.toggleOpen();
		await oneEvent(elem, 'd2l-dropdown-open');
		await expect(elem).to.be.golden();
	});

	it('dark theme', async() => {
		const elem = await fixture(html`
			<div style="background-color: #000000; padding: 250px;">
				<d2l-dropdown>
					<button class="d2l-dropdown-opener">Open it!</button>
					<d2l-dropdown-menu theme="dark" class="vdiff-include">
						${createMenu(true)}
					</d2l-dropdown-menu>
				</d2l-dropdown>
			</div>
		`);
		const dropdown = elem.querySelector('d2l-dropdown');
		dropdown.toggleOpen();
		await oneEvent(dropdown, 'd2l-dropdown-open');
		await expect(dropdown).to.be.golden();
	});

	it('radio-button-close', async() => {
		const elem = await fixture(html`
			<div style="background-color: #000000; padding: 250px;">
				<d2l-dropdown>
					<button class="d2l-dropdown-opener">Open it!</button>
					<d2l-dropdown-menu theme="dark" class="vdiff-include">
						${dropdownRadioMenu}
					</d2l-dropdown-menu>
				</d2l-dropdown>
			</div>
		`);
		const dropdown = elem.querySelector('d2l-dropdown');
		dropdown.toggleOpen();
		await oneEvent(dropdown, 'd2l-dropdown-open');
		clickElem(dialog.shadowRoot.querySelector('d2l-menu-item-radio'));
		await oneEvent(dropdown, 'd2l-dropdown-close');
		await expect(dropdown).to.be.golden();
	});
});
