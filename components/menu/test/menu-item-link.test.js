import '../menu-item-link.js';
import { expect, fixture, html, runConstructor } from '@brightspace-ui/testing';

describe('d2l-menu-item-link', () => {

	describe('constructor', () => {

		it('should construct', () => {
			runConstructor('d2l-menu-item-link');
		});

		it('should sprout "aria-label"', async() => {
			// without explicit aria-label, Voiceover on iOS cannot find nested label inside <a> element
			const elem = await fixture(html`<d2l-menu-item-link text="link text"></d2l-menu-item-link>`);
			expect(elem.getAttribute('aria-label')).to.equal('link text');
		});

		it('should sprout "aria-label" with description text', async() => {
			const elem = await fixture(html`<d2l-menu-item-link text="link text" description="no this text"></d2l-menu-item-link>`);
			expect(elem.getAttribute('aria-label')).to.equal('no this text');
		});
	});

});
