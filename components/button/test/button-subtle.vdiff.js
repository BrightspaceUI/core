import '../button-subtle.js';
import { clickElem, expect, fixture, focusElem, hoverElem, html } from '@brightspace-ui/testing';

describe('button-subtle', () => {
	[
		{ category: 'default-normal', template: html`<d2l-button-subtle text="Subtle Button"></d2l-button-subtle>` },
		//{ category: 'default-icon', template: html`<d2l-button-subtle icon="tier1:bookmark-hollow" text="Subtle Button"></d2l-button-subtle>` },
		//{ category: 'default-icon-right', template: html`<d2l-button-subtle icon="tier1:chevron-down" text="Subtle Button" icon-right></d2l-button-subtle>` },
		{ category: 'slim-normal', template: html`<d2l-button-subtle slim text="Subtle Button"></d2l-button-subtle>` },
		//{ category: 'slim-icon', template: html`<d2l-button-subtle slim icon="tier1:bookmark-hollow" text="Subtle Button"></d2l-button-subtle>` },
		//{ category: 'slim-icon-right', template: html`<d2l-button-subtle slim icon="tier1:chevron-down" text="Subtle Button" icon-right></d2l-button-subtle>` }
	].forEach(({ category, template }) => {

		describe(category, () => {
			[
				{ name: 'normal' },
				//{ name: 'rtl', rtl: true },
				{ name: 'hover', action: hoverElem },
				{ name: 'focus', action: focusElem },
				{ name: 'click', action: clickElem },
				{ name: 'disabled', action: elem => elem.disabled = true }
			].forEach(({ action, name, rtl }) => {
				it(name, async() => {
					const elem = await fixture(template, { rtl });
					if (action) await action(elem);
					await expect(elem).to.be.golden();
				});
			});
		});
	});

	[
		{ category: 'default-icon', template: html`<d2l-button-subtle icon="tier1:bookmark-hollow" text="Subtle Button"></d2l-button-subtle>` },
		{ category: 'default-icon-right', template: html`<d2l-button-subtle icon="tier1:chevron-down" text="Subtle Button" icon-right></d2l-button-subtle>` },
		{ category: 'slim-icon', template: html`<d2l-button-subtle slim icon="tier1:bookmark-hollow" text="Subtle Button"></d2l-button-subtle>` },
		{ category: 'slim-icon-right', template: html`<d2l-button-subtle slim icon="tier1:chevron-down" text="Subtle Button" icon-right></d2l-button-subtle>` }
	].forEach(({ category, template }) => {

		describe(category, () => {
			[
				{ name: 'normal' },
				{ name: 'rtl', rtl: true }
			].forEach(({ action, name, rtl }) => {
				it(name, async() => {
					const elem = await fixture(template, { rtl });
					if (action) await action(elem);
					await expect(elem).to.be.golden();
				});
			});
		});
	});

	it('h-align', async() => {
		const elem = await fixture(html`
			<div>
				<d2l-button-subtle icon="tier1:gear" text="Button Edge Aligned (default)"></d2l-button-subtle>
				<div>Lorem ipsum dolor sit amet, consectetur adipiscing elit</div>
				<d2l-button-subtle icon="tier1:gear" text="Button Content Aligned" h-align="text"></d2l-button-subtle>
				<br>
				<d2l-button-subtle slim icon="tier1:gear" text="Slim Button Content Aligned" h-align="text"></d2l-button-subtle>
				<br>
				<d2l-button-subtle icon="tier1:chevron-down" text="Subtle Button" icon-right h-align="text"></d2l-button-subtle>
				<br>
				<d2l-button-subtle slim icon="tier1:chevron-down" text="Slim Subtle Button" icon-right h-align="text"></d2l-button-subtle>
			</div>
		`);
		await expect(elem).to.be.golden();
	});
});
