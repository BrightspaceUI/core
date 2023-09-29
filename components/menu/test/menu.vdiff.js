import '../menu.js';
import '../menu-item.js';
import '../menu-item-link.js';
import '../menu-item-separator.js';
import './custom-view.js';
import { clickElem, expect, fixture, focusElem, hoverElem, html, oneEvent, sendKeysElem, waitUntil } from '@brightspace-ui/testing';

const supportingTemplate = html`
	<d2l-menu>
		<d2l-menu-item text="nested">
			<div slot="supporting">supporting</div>
			<d2l-menu>
				<d2l-menu-item text="a3"></d2l-menu-item>
			</d2l-menu>
		</d2l-menu-item>
		<d2l-menu-item text="normal">
			<div slot="supporting">supporting</div>
		</d2l-menu-item>
		<d2l-menu-item-link text="link" href="https://en.wikipedia.org/wiki/Universe">
			<div slot="supporting">supporting</div>
		</d2l-menu-item-link>
	</d2l-menu>
`;

describe('menu', () => {
	[
		{ name: 'separator', template: html`
			<d2l-menu>
				<d2l-menu-item text="a"></d2l-menu-item>
				<d2l-menu-item-separator></d2l-menu-item-separator>
				<d2l-menu-item text="b"></d2l-menu-item>
			</d2l-menu>
		` },
		{ name: 'long', template: html`
			<d2l-menu>
				<d2l-menu-item text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."></d2l-menu-item>
			</d2l-menu>
		` },
		{ name: 'long-unbreakable', template: html`
			<d2l-menu>
				<d2l-menu-item text="aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"></d2l-menu-item>
			</d2l-menu>
		` },
		{ name: 'hidden', template: html`
			<d2l-menu>
				<d2l-menu-item text="a" hidden></d2l-menu-item>
				<d2l-menu-item text="b"></d2l-menu-item>
			</d2l-menu>
		` },
		{ name: 'link', template: html`
			<d2l-menu>
				<d2l-menu-item-link text="c" href="https://en.wikipedia.org/wiki/Universe"></d2l-menu-item-link>
			</d2l-menu>
		` },
		{ name: 'link-long', template: html`
			<d2l-menu>
				<d2l-menu-item-link text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." href="https://en.wikipedia.org/wiki/Universe"></d2l-menu-item-link>
			</d2l-menu>
		` },
		{ name: 'supporting', template: supportingTemplate },
		{ name: 'supporting-rtl', rtl: true, template: supportingTemplate }
	].forEach(({ name, rtl, template }) => {
		it(name, async() => {
			const elem = await fixture(template, { rtl });
			await expect(elem).to.be.golden();
		});
	});

	describe('normal', () => {
		[
			{ name: 'simple' },
			{ name: 'hover', action: elem => hoverElem(elem.querySelector('d2l-menu-item[text="b"]')) },
			{ name: 'focus', action: elem => focusElem(elem.querySelector('d2l-menu-item[text="b"]')) },
			{ name: 'first item hover', action: elem => hoverElem(elem.querySelector('d2l-menu-item[text="a"]')) },
			{ name: 'first item focus', action: elem => focusElem(elem.querySelector('d2l-menu-item[text="a"]')) },
			{ name: 'last item hover', action: elem => hoverElem(elem.querySelector('d2l-menu-item[text="c"]')) },
			{ name: 'last item focus', action: elem => focusElem(elem.querySelector('d2l-menu-item[text="c"]')) }
		].forEach(({ name, action }) => {
			it(name, async() => {
				const elem = await fixture(html`
					<d2l-menu>
						<d2l-menu-item text="a"></d2l-menu-item>
						<d2l-menu-item text="b"></d2l-menu-item>
						<d2l-menu-item text="c"></d2l-menu-item>
					</d2l-menu>
				`);
				if (action) await action(elem);
				await expect(elem).to.be.golden();
			});
		});

		it('rtl', async() => {
			const elem = await fixture(html`
				<d2l-menu>
					<d2l-menu-item text="a"></d2l-menu-item>
					<d2l-menu-item text="b"></d2l-menu-item>
				</d2l-menu>
			`, { rtl: true });
			await expect(elem).to.be.golden();
		});
	});

	describe('disabled', () => {
		[
			{ name: 'simple' },
			{ name: 'hover', action: elem => hoverElem(elem.querySelector('d2l-menu-item')) },
			{ name: 'focus', action: elem => focusElem(elem.querySelector('d2l-menu-item')) }
		].forEach(({ name, action }) => {
			it(name, async() => {
				const elem = await fixture(html`
					<d2l-menu>
						<d2l-menu-item text="a" disabled></d2l-menu-item>
					</d2l-menu>
				`);
				if (action) await action(elem);
				await expect(elem).to.be.golden();
			});
		});
	});

	describe('dark', () => {
		[
			{ name: 'simple' },
			{ name: 'hover', action: elem => hoverElem(elem.querySelector('d2l-menu-item[text="normal"]')) },
			{ name: 'focus', action: elem => focusElem(elem.querySelector('d2l-menu-item[text="normal"]')) }
		].forEach(({ name, action }) => {
			it(name, async() => {
				const elem = await fixture(html`
					<d2l-menu theme="dark">
						<d2l-menu-item text="nested">
							<d2l-menu theme="dark">
								<d2l-menu-item text="a3"></d2l-menu-item>
							</d2l-menu>
						</d2l-menu-item>
						<d2l-menu-item text="normal"></d2l-menu-item>
						<d2l-menu-item text="disabled" disabled></d2l-menu-item>
						<d2l-menu-item-separator></d2l-menu-item-separator>
						<d2l-menu-item-link text="link" href="https://en.wikipedia.org/wiki/Universe"></d2l-menu-item-link>
						<d2l-menu-item text="supporting">
							<div slot="supporting">supporting</div>
						</d2l-menu-item>
					</d2l-menu>
				`);
				if (action) await action(elem);
				await expect(elem).to.be.golden();
			});
		});
	});

	describe('nested', () => {
		const nestedTemplate = html`
			<d2l-menu>
				<d2l-menu-item text="b">
					<d2l-menu id="nested-menu">
						<d2l-menu-item text="b2"></d2l-menu-item>
					</d2l-menu>
				</d2l-menu-item>
			</d2l-menu>
		`;
		const nestedLongTemplate = html`
			<d2l-menu>
				<d2l-menu-item id="first-item" text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.">
					<d2l-menu>
						<d2l-menu-item text="a3"></d2l-menu-item>
					</d2l-menu>
				</d2l-menu-item>
				<d2l-menu-item text="b"></d2l-menu-item>
				<d2l-menu-item text="c"></d2l-menu-item>
			</d2l-menu>
		`;
		const customViewTemplate = html`
			<d2l-menu>
				<d2l-menu-item text="a">
					<d2l-custom-view></d2l-custom-view>
				</d2l-menu-item>
			</d2l-menu>
		`;

		[true, false].forEach(rtl => {
			[
				{ name: 'simple', template: nestedTemplate },
				{ name: 'opens submenu on click', template: nestedTemplate, action: async(elem) => {
					// this scenario also tests height change when going from 1 menu item to 2 within nested menu
					clickElem(elem.querySelector('d2l-menu-item[text="b"]'));
					await oneEvent(elem, 'd2l-hierarchical-view-show-complete');
					await waitUntil(() => elem.clientHeight === 101);
				} },
				{ name: 'long menu item', template: nestedLongTemplate },
				{ name: 'opens long menu item submenu on click', template: nestedLongTemplate, action: async(elem) => {
					// this scenario also tests height change when going from 3 menu items to 2 within nested menu
					clickElem(elem.querySelector('d2l-menu-item#first-item'));
					await oneEvent(elem, 'd2l-hierarchical-view-show-complete');
					await waitUntil(() => elem.clientHeight === 101);
				} },
				{ name: 'custom submenu', template: customViewTemplate },
				{ name: 'opens custom submenu on click', template: customViewTemplate, action: async(elem) => {
					clickElem(elem.querySelector('d2l-menu-item[text="a"]'));
					await oneEvent(elem, 'd2l-hierarchical-view-show-complete');
					await waitUntil(() => elem.clientHeight === 140);
				} }
			].forEach(({ name, template, action }) => {
				it(`${name}${rtl ? '-rtl' : ''}`, async() => {
					const elem = await fixture(template, { rtl });
					if (action) await action(elem);
					await expect(elem).to.be.golden();
				});
			});
		});

		it('leaves submenu when return clicked', async() => {
			const elem = await fixture(nestedTemplate);
			clickElem(elem.querySelector('d2l-menu-item[text="b"]'));
			await oneEvent(elem, 'd2l-hierarchical-view-show-complete');
			await waitUntil(() => elem.clientHeight === 101);

			clickElem(elem.querySelector('#nested-menu').shadowRoot.querySelector('d2l-menu-item-return'));
			await oneEvent(elem, 'd2l-hierarchical-view-hide-complete');
			await waitUntil(() => elem.clientHeight === 51);
			await expect(elem).to.be.golden();
		});

		it('opens submenu on enter', async() => {
			const elem = await fixture(nestedTemplate);
			sendKeysElem(elem.querySelector('d2l-menu-item[text="b"]'), 'press', 'Enter');
			await oneEvent(elem, 'd2l-hierarchical-view-show-complete');
			await waitUntil(() => elem.clientHeight === 101);
			await expect(elem).to.be.golden();
		});

		it('leaves submenu on escape', async() => {
			const elem = await fixture(nestedTemplate);
			sendKeysElem(elem.querySelector('d2l-menu-item[text="b"]'), 'press', 'Enter');
			await oneEvent(elem, 'd2l-hierarchical-view-show-complete');
			await waitUntil(() => elem.clientHeight === 101);

			sendKeysElem(elem.querySelector('d2l-menu-item[text="b2"]'), 'press', 'Escape');
			await oneEvent(elem, 'd2l-hierarchical-view-hide-complete');
			await waitUntil(() => elem.clientHeight === 51);
			await expect(elem).to.be.golden();
		});
	});
});
