import '../count-badge.js';
import { expect, fixture, html } from '@open-wc/testing';

const countBadgeWithAccessibilityProperties = html`
<d2l-count-badge size="small" announce-changes tab-stop text="1 new notification." type="notification" number="1"></d2l-count-badge>`;

const countBadgeWithNoAccessibilityProperties = html`
<d2l-count-badge size="small"  text="1 new notification." type="notification" number="1"></d2l-count-badge>`;

describe('d2l-count-badge', () => {
	[
		{ name: 'Basic count badge', fixture: countBadgeWithNoAccessibilityProperties },
		{ name: 'Count badge with tab stop and live region', fixture: countBadgeWithAccessibilityProperties },
	].forEach(test => {
		it(`${test.name}`, async() => {
			const elem = await fixture(test.fixture);
			await expect(elem).to.be.accessible();
		});
	});
});
