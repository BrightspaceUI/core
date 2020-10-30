import '../html-block.js';
import { expect, fixture, html } from '@open-wc/testing';

describe('d2l-html-block', () => {

	it('simple', async() => {
		const elem = await fixture(html`<d2l-html-block><template>some html</template></d2l-html-block>`);
		await expect(elem).to.be.accessible;
	});

});
