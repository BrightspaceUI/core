import '../page-footer.js';
import { expect, fixture, html } from '@brightspace-ui/testing';

describe('page-footer', () => {

	it('default', async() => {
		const elem = await fixture(html`
			<d2l-page-footer>
				<div>Start</div>
				<div slot="end">End</div>
			</d2l-page-footer>
		`);
		await expect(elem).to.be.accessible();
	});

});
