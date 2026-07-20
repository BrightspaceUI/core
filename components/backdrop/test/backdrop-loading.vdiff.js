import '../backdrop-loading.js';
import { expect, fixture, html } from '@brightspace-ui/testing';
import { freshness } from '../../../mixins/freshness/freshness-mixin.js';

const template = html`
	<div style="position:relative">
		<div id="target" style="background-color: orange; height: 200px; padding: 1rem;">
			Stuff in here
		</div>
		<d2l-backdrop-loading for="target" freshness-stale-text="some text" freshness-stale-button-text="action"></d2l-backdrop-loading>
	</div>
`;

describe('backdrop-loading', () => {

	[
		freshness.fresh,
		freshness.stale,
		freshness.loading
	].forEach(freshness => {

		it(freshness, async() => {
			const elem = await fixture(template);
			const backdrop = elem.querySelector('d2l-backdrop-loading');
			backdrop.freshness = freshness;
			await backdrop.updateComplete;

			await expect(elem).to.be.golden({ allColorModes: true });
		});

	});

});
