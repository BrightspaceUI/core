import '../empty-state-illustrated.js';
import { expect, fixture, html } from '@open-wc/testing';

describe ('d2l-empty-state-illustrated', () => {

	it('passes all aXe tests', async() => {
		const el = await fixture(html`
			<d2l-empty-state-illustrated
				description="Get started by clicking below to create your first learning path."
				illustration-name="desert-road"
				title-text="No Learning Paths Yet" >
			</d2l-empty-state-illustrated>
		`);
		await expect(el).to.be.accessible();
	});
});
