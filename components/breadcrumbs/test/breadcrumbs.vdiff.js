import '../breadcrumb.js';
import '../breadcrumb-current-page.js';
import '../breadcrumbs.js';
import { expect, fixture, html } from '@brightspace-ui/testing';

describe('breadcrumbs', () => {
	it('default-mode', async() => {
		const elem = await fixture(html`
			<d2l-breadcrumbs>
				<d2l-breadcrumb href="#" text="Basic Item 1"></d2l-breadcrumb>
				<d2l-breadcrumb href="#" text="Basic Item 2" aria-label="Aria for Item 2"></d2l-breadcrumb>
				<d2l-breadcrumb href="#" text="Basic Item 3"></d2l-breadcrumb>
			</d2l-breadcrumbs>
		`);
		await expect(elem).to.be.golden();
	});

	it('current-page', async() => {
		const elem = await fixture(html`
			<d2l-breadcrumbs>
				<d2l-breadcrumb href="#" text="Basic Item 1"></d2l-breadcrumb>
				<d2l-breadcrumb href="#" text="Basic Item 2" aria-label="Aria for Item 2"></d2l-breadcrumb>
				<d2l-breadcrumb-current-page text="Current Page" ></d2l-breadcrumb-current-page>
			</d2l-breadcrumbs>
		`);
		await expect(elem).to.be.golden();
	});

	it('constrained-width', async() => {
		const elem = await fixture(html`
			<d2l-breadcrumbs style="max-width: 250px;">
				<d2l-breadcrumb href="#" text="Truncate Basic Item 1"></d2l-breadcrumb>
				<d2l-breadcrumb href="#" text="Truncate Basic Item 2"></d2l-breadcrumb>
			</d2l-breadcrumbs>
		`);
		await expect(elem).to.be.golden();
	});

	it('compact', async() => {
		const elem = await fixture(html`
			<d2l-breadcrumbs compact>
				<d2l-breadcrumb href="#" text="Compact Item 1"></d2l-breadcrumb>
				<d2l-breadcrumb href="#" text="Compact Item 2"></d2l-breadcrumb>
				<d2l-breadcrumb-current-page text="Current Page"></d2l-breadcrumb-current-page>
			</d2l-breadcrumbs>
		`);
		await expect(elem).to.be.golden();
	});
});
