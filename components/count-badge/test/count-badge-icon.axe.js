import '../count-badge-icon.js';
import { expect, fixture, html } from '@open-wc/testing';

const countBadgeTooltip = html`
<d2l-count-badge-icon size="small" announce-changes text="1 new notification." type="notification" number="1"></d2l-count-badge-icon>`;

const countBadgeAnnounceChanges = html`
<d2l-count-badge-icon size="small" has-tooltip text="1 new notification." type="notification" number="1"></d2l-count-badge-icon>`;

const countBadgeWithNoAccessibilityProperties = html`
<d2l-count-badge-icon size="small"  text="1 new notification." type="notification" number="1"></d2l-count-badge-icon>`;

describe('d2l-count-badge-icon', () => {
	[
		{ name: 'Basic count badge', fixture: countBadgeWithNoAccessibilityProperties },
		{ name: 'Count badge with live region', fixture: countBadgeAnnounceChanges },
		{ name: 'Count badge with tooltip', fixture: countBadgeTooltip }
	].forEach(test => {
		it(`${test.name}`, async() => {
			const elem = await fixture(test.fixture);
			await expect(elem).to.be.accessible();
		});
	});
});
