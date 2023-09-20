import '../switch.js';
import { expect, fixture, focusElem, hoverElem, html } from '@brightspace-ui/testing';

const offFixture = html`<d2l-switch text="Test Text"></d2l-switch>`;
const onFixture = html`<d2l-switch text="Test Text" on></d2l-switch>`;

describe('d2l-switch', () => {

	describe('basic', () => {
		[
			{ name: 'off', template: offFixture },
			{ name: 'off-focus', template: offFixture, action: async(elem) => await focusElem(elem) },
			{ name: 'off-disabled', template: html`<d2l-switch text="Test Text" disabled></d2l-switch>` },
			{ name: 'off-hover', template: offFixture, action: async(elem) => await hoverElem(elem.shadowRoot.querySelector('.d2l-switch-inner')) },
			{ name: 'on', template: onFixture },
			{ name: 'on-focus', template: onFixture, action: async(elem) => await focusElem(elem) },
			{ name: 'on-hover', template: onFixture, action: async(elem) => await hoverElem(elem.shadowRoot.querySelector('.d2l-switch-inner')) },
			{ name: 'on-disabled', template: html`<d2l-switch text="Test Text" on disabled></d2l-switch>` },
			{ name: 'text-hidden', template: html`<d2l-switch text="Test Text" text-position="hidden"></d2l-switch>` },
			{ name: 'text-start', template: html`<d2l-switch text="Test Text" text-position="start"></d2l-switch>` },
			{ name: 'text-end', template: html`<d2l-switch text="Test Text" text-position="end"></d2l-switch>` },
			{ name: 'toggle on', template: offFixture, action: async(elem) => { elem.on = true; await elem.updateComplete; } },
			{ name: 'toggle off', template: onFixture, action: async(elem) => { elem.on = false; await elem.updateComplete; } },
			{ name: 'background-color', template: html`<d2l-switch on style="--d2l-switch-container-background-color: red;"></d2l-switch>` }
		].forEach(({ name, template, action }) => {
			it(name, async() => {
				const elem = await fixture(template);
				if (action) await action(elem);
				await elem.updateComplete;
				await expect(elem).to.be.golden();
			});
		});
	});

	describe('rtl', () => {
		[
			{ name: 'off', template: offFixture },
			{ name: 'on', template: onFixture }
		].forEach(({ name, template }) => {
			it(name, async() => {
				const elem = await fixture(template, { rtl: true });
				await expect(elem).to.be.golden();
			});
		});
	});

});
