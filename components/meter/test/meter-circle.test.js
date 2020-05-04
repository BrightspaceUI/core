import '../meter-circle.js';
import { expect, fixture, html } from '@open-wc/testing';
import { runConstructor } from '../../../tools/constructor-test-helper.js';

describe('d2l-meter-circle', () => {

	describe('accessibility', () => {

		it('should pass all aXe tests (no progress)', async() => {
			const elem = await fixture(html`<d2l-meter-circle value="0" max="10"></d2l-meter-circle>`);
			await expect(elem).to.be.accessible();
		});

		it('should pass all aXe tests (has progress)', async() => {
			const elem = await fixture(html`<d2l-meter-circle value="3" max="10"></d2l-meter-circle>`);
			await expect(elem).to.be.accessible();
		});

		it('should pass all aXe tests (completed)', async() => {
			const elem = await fixture(html`<d2l-meter-circle value="10" max="10"></d2l-meter-circle>`);
			await expect(elem).to.be.accessible();
		});

	});

	describe('constructor', () => {

		it('should construct', () => {
			runConstructor('d2l-meter-circle');
		});

	});

});
