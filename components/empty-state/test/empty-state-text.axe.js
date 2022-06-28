import '../empty-state-text.js';
import '../../link/link.js';
import { expect, fixture, html } from '@open-wc/testing';

describe ('d2l-empty-state-text', () => {

	it('normal', async() => {
		const el = await fixture(html`
            <d2l-empty-state-text description='There are currently no courses here.' action-text='Create a Course'></d2l-empty-state-text>
        `);
		await expect(el).to.be.accessible();
	});

	it('custom link', async() => {
		const el = await fixture(html`
            <d2l-empty-state-text description='There are currently no courses here.'>
				<d2l-link  href="https://www.d2l.com/">Create a Course</d2l-link>
			</d2l-empty-state-text>
        `);
		await expect(el).to.be.accessible();
	});

});
