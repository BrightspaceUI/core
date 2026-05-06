import '../page-main.js';
import '../page-side-nav.js';
import '../page-supporting.js';
import { expect, fixture, html } from '@brightspace-ui/testing';

describe('panels', () => {

	describe('page-main', () => {
		it('no-header', async() => {
			const elem = await fixture(html`
				<d2l-page-main>
					<div>Content</div>
				</d2l-page-main>
			`);
			await expect(elem).to.be.accessible();
		});

		it('with-header', async() => {
			const elem = await fixture(html`
				<d2l-page-main>
					<div slot="header-start">Start</div>
					<div slot="header-end">End</div>
					<div>Content</div>
				</d2l-page-main>
			`);
			await expect(elem).to.be.accessible();
		});
	});

	describe('page-side-nav', () => {
		it('no-header', async() => {
			const elem = await fixture(html`
				<d2l-page-side-nav>
					<div>Content</div>
				</d2l-page-side-nav>
			`);
			await expect(elem).to.be.accessible();
		});

		it('with-header', async() => {
			const elem = await fixture(html`
				<d2l-page-side-nav>
					<div slot="header-start">Start</div>
					<div slot="header-end">End</div>
					<div>Content</div>
				</d2l-page-side-nav>
			`);
			await expect(elem).to.be.accessible();
		});
	});

	describe('page-supporting', () => {
		it('no-header', async() => {
			const elem = await fixture(html`
				<d2l-page-supporting>
					<div>Content</div>
				</d2l-page-supporting>
			`);
			await expect(elem).to.be.accessible();
		});

		it('with-header', async() => {
			const elem = await fixture(html`
				<d2l-page-supporting>
					<div slot="header-start">Start</div>
					<div slot="header-end">End</div>
					<div>Content</div>
				</d2l-page-supporting>
			`);
			await expect(elem).to.be.accessible();
		});
	});

});
