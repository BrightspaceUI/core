import '../backdrop.js';
import { expect, fixture, html } from '@brightspace-ui/testing';

const template = html`
	<div style="background-color: orange; height: 100px; padding: 1rem; width: 300px;">
		Background content
		<div id="target" style="position: relative; z-index: 1000;">Target content</div>
		<d2l-backdrop for-target="target"></d2l-backdrop>
	</div>
`;

describe('backdrop', () => {
	it('not shown', async() => {
		const elem = await fixture(template);
		await expect(elem).to.be.golden();
	});

	it('shown', async() => {
		const elem = await fixture(template);
		elem.querySelector('d2l-backdrop').shown = true;
		await expect(elem).to.be.golden();
	});
});
