import '../empty-state-illustrated-button.js';
import { expect, fixture, html } from '@open-wc/testing';

describe ('d2l-empty-state-illustrated-button', () => {

	it('normal', async() => {
		const el = await fixture(html`
			<d2l-empty-state-illustrated-button illustration="desert_road" title="No Learning Paths Yet" description="Get started by clicking below to create your first learning path." action-text="Create Learning Paths"></d2l-empty-state-illustrated-button>
        `);
		await expect(el).to.be.accessible();
	});

});
