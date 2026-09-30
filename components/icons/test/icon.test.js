import '../icon.js';
import { expect, fixture, html, runConstructor } from '@brightspace-ui/testing';

describe('d2l-icon', () => {

	describe('constructor', () => {

		it('should construct', () => {
			runConstructor('d2l-icon');
		});

		it('should resolve loading complete when icon is set', async() => {
			const elem = await fixture(html`<d2l-icon icon="tier1:delete"></d2l-icon>`);
			expect(elem).to.exist;
		});

		it('should resolve loading complete when no icon is set', async() => {
			const elem = await fixture(html`<d2l-icon></d2l-icon>`);
			expect(elem).to.exist;
		});

	});

});
