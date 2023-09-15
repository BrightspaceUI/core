import '../button-subtle.js';
import '../../icons/icon-custom.js';
import { clickElem, expect, fixture, focusElem, hoverElem, html } from '@brightspace-ui/testing';

const defaultCustomIconTemplate = html`
	<d2l-button-subtle text="Subtle Button">
		<d2l-icon-custom slot="icon">
			<svg xmlns="http://www.w3.org/2000/svg" mirror-in-rtl="true">
				<path fill="#494c4e" d="M18 12v5a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1v-5a1 1 0 0 1 2 0v4h14v-4a1 1 0 0 1 2 0z"/>
				<path fill="#494c4e" d="M13.85 3.15l-2.99-3A.507.507 0 0 0 10.5 0H5.4A1.417 1.417 0 0 0 4 1.43v11.14A1.417 1.417 0 0 0 5.4 14h7.2a1.417 1.417 0 0 0 1.4-1.43V3.5a.47.47 0 0 0-.15-.35zM7 2h1a1 1 0 0 1 0 2H7a1 1 0 0 1 0-2zm4 10H7a1 1 0 0 1 0-2h4a1 1 0 0 1 0 2zm0-4H7a1 1 0 0 1 0-2h4a1 1 0 0 1 0 2z"/>
			</svg>
		</d2l-icon-custom>
	</d2l-button-subtle>
`;

const defaultCustomIconSlotContentTemplate = html`
<d2l-button-subtle text="Subtle Button">
	<d2l-icon-custom slot="icon">
		<svg xmlns="http://www.w3.org/2000/svg" mirror-in-rtl="true">
			<path fill="#494c4e" d="M18 12v5a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1v-5a1 1 0 0 1 2 0v4h14v-4a1 1 0 0 1 2 0z"/>
			<path fill="#494c4e" d="M13.85 3.15l-2.99-3A.507.507 0 0 0 10.5 0H5.4A1.417 1.417 0 0 0 4 1.43v11.14A1.417 1.417 0 0 0 5.4 14h7.2a1.417 1.417 0 0 0 1.4-1.43V3.5a.47.47 0 0 0-.15-.35zM7 2h1a1 1 0 0 1 0 2H7a1 1 0 0 1 0-2zm4 10H7a1 1 0 0 1 0-2h4a1 1 0 0 1 0 2zm0-4H7a1 1 0 0 1 0-2h4a1 1 0 0 1 0 2z"/>
		</svg>
	</d2l-icon-custom>
	Slot Content
</d2l-button-subtle>
`;

const slimCustomIconTemplate = html`
	<d2l-button-subtle text="Subtle Button" slim>
		<d2l-icon-custom slot="icon">
			<svg xmlns="http://www.w3.org/2000/svg" mirror-in-rtl="true">
				<path fill="#494c4e" d="M18 12v5a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1v-5a1 1 0 0 1 2 0v4h14v-4a1 1 0 0 1 2 0z"/>
				<path fill="#494c4e" d="M13.85 3.15l-2.99-3A.507.507 0 0 0 10.5 0H5.4A1.417 1.417 0 0 0 4 1.43v11.14A1.417 1.417 0 0 0 5.4 14h7.2a1.417 1.417 0 0 0 1.4-1.43V3.5a.47.47 0 0 0-.15-.35zM7 2h1a1 1 0 0 1 0 2H7a1 1 0 0 1 0-2zm4 10H7a1 1 0 0 1 0-2h4a1 1 0 0 1 0 2zm0-4H7a1 1 0 0 1 0-2h4a1 1 0 0 1 0 2z"/>
			</svg>
		</d2l-icon-custom>
	</d2l-button-subtle>
`;

const slimCustomIconSlotContentTemplate = html`
	<d2l-button-subtle text="Subtle Button" slim>
		<d2l-icon-custom slot="icon">
			<svg xmlns="http://www.w3.org/2000/svg" mirror-in-rtl="true">
				<path fill="#494c4e" d="M18 12v5a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1v-5a1 1 0 0 1 2 0v4h14v-4a1 1 0 0 1 2 0z"/>
				<path fill="#494c4e" d="M13.85 3.15l-2.99-3A.507.507 0 0 0 10.5 0H5.4A1.417 1.417 0 0 0 4 1.43v11.14A1.417 1.417 0 0 0 5.4 14h7.2a1.417 1.417 0 0 0 1.4-1.43V3.5a.47.47 0 0 0-.15-.35zM7 2h1a1 1 0 0 1 0 2H7a1 1 0 0 1 0-2zm4 10H7a1 1 0 0 1 0-2h4a1 1 0 0 1 0 2zm0-4H7a1 1 0 0 1 0-2h4a1 1 0 0 1 0 2z"/>
			</svg>
		</d2l-icon-custom>
		Slot Content
	</d2l-button-subtle>
`;

describe('button-subtle', () => {
	[
		{ category: 'default-normal', template: html`<d2l-button-subtle text="Subtle Button"></d2l-button-subtle>` },
		{ category: 'default-icon', template: html`<d2l-button-subtle icon="tier1:bookmark-hollow" text="Subtle Button"></d2l-button-subtle>` },
		{ category: 'default-icon-right', template: html`<d2l-button-subtle icon="tier1:chevron-down" text="Subtle Button" icon-right></d2l-button-subtle>` },
		{ category: 'default-slot-content', template: html`<d2l-button-subtle icon="tier1:chevron-down" text="Subtle Button">Slot content</d2l-button-subtle>` },
		{ category: 'default-custom-icon', template: defaultCustomIconTemplate },
		{ category: 'default-custom-icon-slot-content', template: defaultCustomIconSlotContentTemplate },
		{ category: 'slim-normal', template: html`<d2l-button-subtle slim text="Subtle Button"></d2l-button-subtle>` },
		{ category: 'slim-icon', template: html`<d2l-button-subtle slim icon="tier1:bookmark-hollow" text="Subtle Button"></d2l-button-subtle>` },
		{ category: 'slim-icon-right', template: html`<d2l-button-subtle slim icon="tier1:chevron-down" text="Subtle Button" icon-right></d2l-button-subtle>` },
		{ category: 'slim-slot-content', template: html`<d2l-button-subtle slim icon="tier1:chevron-down" text="Subtle Button">Slot content</d2l-button-subtle>` },
		{ category: 'slim-custom-icon', template: slimCustomIconTemplate },
		{ category: 'slim-custom-icon-slot-content', template: slimCustomIconSlotContentTemplate }
	].forEach(({ category, template }) => {

		describe(category, () => {
			[
				{ name: 'normal' },
				{ name: 'rtl', rtl: true },
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
