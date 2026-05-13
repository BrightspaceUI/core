import '../skip-nav-custom.js';
import { expect, fixture, focusElem, html } from '@brightspace-ui/testing';

describe('d2l-skip-nav-custom', () => {

	it('focus', async() => {
		const elem = await fixture(html`
			<div class="width: 600px;">
				<d2l-skip-nav-custom text="Skip to custom place" class="vdiff-include"></d2l-skip-nav-custom>
				<p>Some content</p>
			</div>
		`);
		await focusElem(elem.querySelector('d2l-skip-nav-custom'));
		await expect(elem).to.be.golden();
	});

});
