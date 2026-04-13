import '../backdrop-loading.js';
import { expect, fixture, html } from '@brightspace-ui/testing';

const template = html`
	<div style="position:relative">
		<div id="target" style="background-color: orange; height: 200px; padding: 1rem;">
			Stuff in here
		</div>
		<d2l-backdrop-loading for="target" dirty-text="some text" dirty-button-text="action"></d2l-backdrop-loading>
	</div>
`;

describe('backdrop-loading', () => {
	it('clean', async() => {
		const elem = await fixture(template);
		await expect(elem).to.be.golden();
	});

	it('dirty', async() => {
		const elem = await fixture(template);
		elem.querySelector('d2l-backdrop-loading').dataState = 'dirty';
		await expect(elem).to.be.golden();
	});

	it('loading', async() => {
		const elem = await fixture(template);
		elem.querySelector('d2l-backdrop-loading').dataState = 'loading';
		await expect(elem).to.be.golden();
	});
});
