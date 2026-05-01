import '../page.js';
import { expect, fixture, html } from '@brightspace-ui/testing';

describe('page', () => {

	it('single panel', async() => {
		const elem = await fixture(html`
			<d2l-page>
				<div slot="header">Header</div>
				<div>Content</div>
				<div slot="footer">Footer</div>
			</d2l-page>
		`);
		await expect(elem).to.be.accessible();
	});

	it('with side-nav panel', async() => {
		const elem = await fixture(html`
			<d2l-page>
				<div slot="header">Header</div>
				<div>Content</div>
				<div slot="side-nav">Side Nav</div>
				<div slot="footer">Footer</div>
			</d2l-page>
		`);
		await expect(elem).to.be.accessible();
	});

	it('with supporting panel', async() => {
		const elem = await fixture(html`
			<d2l-page>
				<div slot="header">Header</div>
				<div>Content</div>
				<div slot="supporting">Supporting</div>
				<div slot="footer">Footer</div>
			</d2l-page>
		`);
		await expect(elem).to.be.accessible();
	});
});
