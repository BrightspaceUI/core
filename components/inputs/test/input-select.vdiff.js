import '../demo/input-select-test.js';
import { expect, fixture, focusElem, html } from '@brightspace-ui/testing';

const defaultFixture = html`<d2l-test-input-select></d2l-test-input-select>`;
const overflowFixture = html`<d2l-test-input-select overflow></d2l-test-input-select>`;
const invalidFixture = html`<d2l-test-input-select invalid></d2l-test-input-select>`;

describe('d2l-input-select', () => {

	[
		{ name: 'default', template: defaultFixture, allColorModes: true },
		{ name: 'default-focus', template: defaultFixture, focus: true, allColorModes: true },
		{ name: 'overflow', template: overflowFixture },
		{ name: 'overflow-focus', template: overflowFixture, focus: true },
		{ name: 'disabled', template: html`<d2l-test-input-select disabled></d2l-test-input-select>`, allColorModes: true },
		{ name: 'invalid', template: invalidFixture, allColorModes: true },
		{ name: 'invalid-focus', allColorModes: true, template: invalidFixture, focus: true },
		{ name: 'rtl', template: defaultFixture, rtl: true },
		{ name: 'rtl-focus', template: defaultFixture, rtl: true, focus: true },
		{ name: 'rtl-overflow', template: overflowFixture, rtl: true },
		{ name: 'rtl-overflow-focus', template: overflowFixture, rtl: true, focus: true },
		{ name: 'rtl-invalid', template: invalidFixture, rtl: true },
		{ name: 'rtl-invalid-focus', template: invalidFixture, rtl: true, focus: true },
		{ name: 'skeleton', template: html`<d2l-test-input-select skeleton></d2l-test-input-select>`, allColorModes: true },
	].forEach(({ name, template, allColorModes, rtl, focus }) => {
		it(name, async() => {
			const elem = await fixture(template, { rtl });
			if (focus) await focusElem(elem);
			await expect(elem).to.be.golden({ allColorModes });
		});
	});

});
