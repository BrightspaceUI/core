import '../demo/description-list-test.js';
import { expect, fixture, html } from '@brightspace-ui/testing';

describe('description-list-wrapper', () => {
	[
		{ name: 'default', template: html`<d2l-test-dl></d2l-test-dl>` },
		{ name: 'long', template: html`<d2l-test-dl type="long" breakpoint="300"></d2l-test-dl>` },
		{ name: 'stacked', template: html`<d2l-test-dl type="long" force-stacked></d2l-test-dl>` },
		{ name: 'stacked-with-breakpoint', template: html`<d2l-test-dl type="long" breakpoint="300" force-stacked></d2l-test-dl>` },
		{ name: 'activity-display', template: html`<d2l-test-dl type="activity-display"></d2l-test-dl>` },
		{ name: 'bulk-course-import', template: html`<d2l-test-dl type="bulk-course-import"></d2l-test-dl>` },
		{ name: 'slotted', template: html`<d2l-test-dl type="slotted"></d2l-test-dl>` }
	].forEach(({ name, template }) => {
		[ 799, 599, 299, 239 ].forEach((width) => {
			it(`${name} ${width}`, async() => {
				const elem = await fixture(template, { viewport: { width: width + 76 } }); // body has 30px padding + 8px margin
				await expect(elem).to.be.golden();
			});
		});
	});
});
