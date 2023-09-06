import '../card-content-meta.js';
import '../card-content-title.js';
import { expect, fixture, html } from '@brightspace-ui/testing';

describe('card-content-meta', () => {
	it('default', async() => {
		const elem = await fixture(html`
			<d2l-card-content-meta>
				Card Meta
				<ul>
					<li>meta-data 1</li>
					<li>meta-data 2</li>
				</ul>
			</d2l-card-content-meta>
		`);
		await expect(elem).to.be.golden();
	});
});

describe('card-content-title', () => {
	it('default', async() => {
		const elem = await fixture(html`<div style="width: 300px;"><d2l-card-content-title>Card Title</d2l-card-content-title></div>`);
		await expect(elem).to.be.golden();
	});
});
