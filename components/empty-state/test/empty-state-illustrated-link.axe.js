import '../empty-state-illustrated-link.js';
import { expect, fixture, html } from '@open-wc/testing';

describe ('d2l-empty-state-illustrated-link', () => {

	it('normal', async() => {
		const el = await fixture(html`
			<d2l-empty-state-illustrated-link illustration="desert_road" title="No Learning Paths Yet" description="Get started by clicking below to create your first learning path." action-text="Create Learning Paths" action-href="https://www.d2l.com/"></d2l-empty-state-illustrated-link>
		`);
		await expect(el).to.be.accessible();
	});

});
