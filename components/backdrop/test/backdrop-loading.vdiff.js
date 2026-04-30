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
		{ dataState: 'clean-dark', colorMode: 'dark' },
		{ dataState: 'dirty' },
		{ dataState: 'dirty-dark', colorMode: 'dark' },
		{ dataState: 'loading' },
		{ dataState: 'loading-dark', colorMode: 'dark' }
	].forEach(({ dataState, colorMode }) => {
		it(dataState, async() => {
			const elem = await fixture(template, { colorMode });
			elem.querySelector('d2l-backdrop-loading').dataState = dataState;
			await expect(elem).to.be.golden();
		});
	});
});
