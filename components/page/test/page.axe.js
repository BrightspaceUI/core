import '../page.js';
import { expect, fixture, html } from '@brightspace-ui/testing';

// TO DO: See if we can remove once we are handling <h1> and page title setting
const rulesToIgnore = ['document-title', 'page-has-heading-one'];

describe('page', () => {

	it('single panel', async() => {
		await fixture(html`
			<d2l-page>
				<div slot="header">Header</div>
				<div>Content</div>
				<div slot="footer">Footer</div>
			</d2l-page>
		`);
		await expect(document).to.be.accessible({ ignoredRules: rulesToIgnore });
	});

	it('with side-nav panel', async() => {
		await fixture(html`
			<d2l-page>
				<div slot="header">Header</div>
				<div>Content</div>
				<div slot="side-nav">Side Nav</div>
				<div slot="footer">Footer</div>
			</d2l-page>
		`);
		await expect(document).to.be.accessible({ ignoredRules: rulesToIgnore });
	});

	it('with supporting panel', async() => {
		await fixture(html`
			<d2l-page>
				<div slot="header">Header</div>
				<div>Content</div>
				<div slot="supporting">Supporting</div>
				<div slot="footer">Footer</div>
			</d2l-page>
		`);
		await expect(document).to.be.accessible({ ignoredRules: rulesToIgnore });
	});
});
