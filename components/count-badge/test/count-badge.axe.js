import '../count-badge.js';
import { expect, fixture, html } from '@open-wc/testing';

const countBadgeWithAccessibilityProperties = html`
<d2l-count-badge size="small" announce-changes  description="1 new notification." type="notification" number="1"></d2l-count-badge>`;

const countBadgeWithNoAccessibilityProperties = html`
<d2l-count-badge size="small" type="notification" number="1"></d2l-count-badge>`;

describe('d2l-count-badge', () => {
	[
		{ name: 'Count badge with no a11y features', fixture: countBadgeWithNoAccessibilityProperties },
		{ name: 'Count badge with aria-label and live region', fixture: countBadgeWithAccessibilityProperties },
	].forEach(test => {
		it(`${test.name}`, async() => {
			const elem = await fixture(test.fixture);
			await expect(elem).to.be.accessible();
		});
	});
});
