import '../icon.js';
import { expect, fixture } from '@brightspace-ui/testing';

describe('d2l-icon', () => {
	it('normal', async() => {
		const el = await fixture('<d2l-icon icon="tier1:assignments" alt="small assignment icon"></d2l-icon>');
		document.body.appendChild(el);
		await expect(el).to.be.accessible();
	});
});
