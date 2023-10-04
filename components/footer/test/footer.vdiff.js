import '../footer.js';
import { expect, fixture, html } from '@brightspace-ui/testing';

const viewport = { height: 700 };

describe('footer', () => {

	it('default', async() => {
		await fixture(html`<d2l-footer></d2l-footer>`, { viewport, pagePadding: false });
		await expect(document).to.be.golden();
	});

	it('color', async() => {
		await fixture(html`<div style="background-color: purple;"><d2l-footer color></d2l-footer></div>`, { viewport, pagePadding: false });
		await expect(document).to.be.golden();
	});

	it('narrow', async() => {
		await fixture(html`<d2l-footer></d2l-footer>`, { viewport: { width: 300 }, pagePadding: false });
		await expect(document).to.be.golden();
	});

	it('content shorter than page', async() => {
		const footerFixture = html`
			<div>
				<div>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</div>
				<footer><d2l-footer></d2l-footer></footer>
			</div>
		`;
		await fixture(footerFixture, { viewport, pagePadding: false });
		await expect(document).to.be.golden();
	});

	it('content longer than page', async() => {
		const footerFixture = html`
			<div>
				<div>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</div>
				<footer><d2l-footer></d2l-footer></footer>
			</div>
		`;
		const elem = await fixture(footerFixture, { viewport: { height: 500, width: 300 }, pagePadding: false });
		await expect(elem).to.be.golden();
	});

	it('chatbot', async() => {

	});
});
