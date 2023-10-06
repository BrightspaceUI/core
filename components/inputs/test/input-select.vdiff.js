import '../demo/input-select-test.js';
import { expect, fixture, focusElem, html } from '@brightspace-ui/testing';
import { loadSass, unloadSass } from '../../../test/load-sass.js';

const defaultFixture = html`<d2l-test-input-select></d2l-test-input-select>`;
const overflowFixture = html`<d2l-test-input-select overflow></d2l-test-input-select>`;
const invalidFixture = html`<d2l-test-input-select invalid></d2l-test-input-select>`;
const dinosaurs = html`<option>Tyrannosaurus</option><option>Velociraptor</option><option>Deinonychus</option>`;
const sassDefaultFixture = html`<select class="d2l-test-input-select">${dinosaurs}</select>`;
const sassOverflowFixture = html`<select class="d2l-test-input-select" style="max-width: 130px;">${dinosaurs}</select>`;
const sassInvalidFixture = html`<select class="d2l-test-input-select" aria-invalid="true">${dinosaurs}</select>`;

describe('d2l-input-select', () => {

	before(loadSass);
	after(unloadSass);

	[
		{ name: 'default', template: defaultFixture },
		{ name: 'default-focus', template: defaultFixture, focus: true },
		{ name: 'overflow', template: overflowFixture },
		{ name: 'overflow-focus', template: overflowFixture, focus: true },
		{ name: 'disabled', template: html`<d2l-test-input-select disabled></d2l-test-input-select>` },
		{ name: 'invalid', template: invalidFixture },
		{ name: 'invalid-focus', template: invalidFixture, focus: true },
		{ name: 'rtl', template: defaultFixture, rtl: true },
		{ name: 'rtl-focus', template: defaultFixture, rtl: true, focus: true },
		{ name: 'rtl-overflow', template: overflowFixture, rtl: true },
		{ name: 'rtl-overflow-focus', template: overflowFixture, rtl: true, focus: true },
		{ name: 'rtl-invalid', template: invalidFixture, rtl: true },
		{ name: 'rtl-invalid-focus', template: invalidFixture, rtl: true, focus: true },
		{ name: 'skeleton', template: html`<d2l-test-input-select skeleton></d2l-test-input-select>` },
		{ name: 'sass-default', template: sassDefaultFixture },
		{ name: 'sass-default-focus', template: sassDefaultFixture, focus: true },
		{ name: 'sass-overflow', template: sassOverflowFixture },
		{ name: 'sass-overflow-focus', template: sassOverflowFixture, focus: true },
		{ name: 'sass-disabled', template: html`<select class="d2l-test-input-select" disabled>${dinosaurs}</select>` },
		{ name: 'sass-invalid', template: sassInvalidFixture },
		{ name: 'sass-invalid-focus', template: sassInvalidFixture, focus: true },
		{ name: 'sass-rtl', template: sassDefaultFixture, rtl: true },
		{ name: 'sass-rtl-focus', template: sassDefaultFixture, rtl: true, focus: true },
		{ name: 'sass-rtl-overflow', template: sassOverflowFixture, rtl: true },
		{ name: 'sass-rtl-overflow-focus', template: sassOverflowFixture, rtl: true, focus: true },
		{ name: 'sass-rtl-invalid', template: sassInvalidFixture, rtl: true },
		{ name: 'sass-rtl-invalid-focus', template: sassInvalidFixture, rtl: true, focus: true },
	].forEach(({ name, template, rtl, focus }) => {
		it(name, async() => {
			const elem = await fixture(template, { rtl });
			if (focus) await focusElem(elem);
			await expect(elem).to.be.golden();
		});
	});

});
