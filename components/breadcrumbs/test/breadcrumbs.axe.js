import '../breadcrumb.js';
import '../breadcrumb-current-page.js';
import '../breadcrumbs.js';
import { expect, fixture, html } from '@brightspace-ui/testing';

describe('d2l-breadcrumbs', () => {

	[
		'max-width: 250px; width: 250px;',
		'',
	].forEach((style) => {
		[true, false].forEach((compact) => {
			it(`passes aXe tests for style="${style}" and compact="${compact}"`, async() => {
				const elem = await fixture(html`
					<d2l-breadcrumbs style="${style}" ?compact="${compact}">
						<d2l-breadcrumb href="#" text="Basic Item 1"></d2l-breadcrumb>
						<d2l-breadcrumb href="#" text="Basic Item 2"></d2l-breadcrumb>
						<d2l-breadcrumb href="#" text="Basic Item 3" aria-label="Aria for Item 3"></d2l-breadcrumb>
					</d2l-breadcrumbs>
				`);
				await expect(elem).to.be.accessible();
			});
		});
	});

	it('passes aXe for current page', async() => {
		const elem = await fixture(html`
			<d2l-breadcrumbs>
				<d2l-breadcrumb href="page1.html" text="Page 1"></d2l-breadcrumb>
				<d2l-breadcrumb-current-page text="Current Page"></d2l-breadcrumb-current-page>
			</d2l-breadcrumbs>`);
		await expect(elem).to.be.accessible();
	});

});
