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
	[
		{ dataState: 'clean' },
		{ dataState: 'clean', colorMode: 'dark' },
		{ dataState: 'dirty' },
		{ dataState: 'dirty', colorMode: 'dark' },
		{ dataState: 'loading' },
		{ dataState: 'loading', colorMode: 'dark' }
	].forEach(({ dataState, colorMode }) => {
		it(`${dataState}-${colorMode || 'light'}`, async() => {
			const elem = await fixture(template, { colorMode });
			const backdrop = elem.querySelector('d2l-backdrop-loading');
			backdrop.dataState = dataState;
			await backdrop.updateComplete;

			await expect(elem).to.be.golden();
		});
	});
});
