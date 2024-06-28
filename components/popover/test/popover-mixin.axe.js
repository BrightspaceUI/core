import './popover.js';
import { expect, fixture } from '@brightspace-ui/testing';

describe('popover-mixin', () => {

	it('closed', async() => {
		const el = await fixture('<d2l-test-popover></d2l-test-popover>');
		await expect(el).to.be.accessible();
	});

	it('opened', async() => {
		const el = await fixture('<d2l-test-popover opened></d2l-test-popover>');
		await expect(el).to.be.accessible();
	});

});
