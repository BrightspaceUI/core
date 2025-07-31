import '../list-item-drag-image.js';
import { expect, fixture, html } from '@brightspace-ui/testing';
import { runConstructor } from '../../../tools/constructor-test-helper.js';

describe('d2l-list-item-drag-image', () => {

	describe('constructor', () => {
		it('should construct', () => {
			runConstructor('d2l-list-item-drag-image');
		});
	});

	describe('properties', () => {
		it('should have default count of 0', async() => {
			const elem = await fixture(html`<d2l-list-item-drag-image></d2l-list-item-drag-image>`);
			await elem.updateComplete;
			expect(elem.count).to.equal(0);
		});

		it('should have skeleton property enabled by default', async() => {
			const elem = await fixture(html`<d2l-list-item-drag-image></d2l-list-item-drag-image>`);
			await elem.updateComplete;
			expect(elem.skeleton).to.be.true;
		});
	});

});
