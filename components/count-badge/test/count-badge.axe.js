import '../count-badge.js';
import { expect, fixture, html } from '@brightspace-ui/testing';

const countBadgeTooltip = html`
<d2l-count-badge size="small" has-tooltip text="1 new notification." type="notification" number="1"></d2l-count-badge>`;

const countBadgeAnnounceChanges = html`
<d2l-count-badge size="small" announce-changes text="1 new notification." type="notification" number="1"></d2l-count-badge>`;

const countBadgeAnnounceChangesTooltip = html`
<d2l-count-badge size="small" announce-changes has-tooltip text="1 new notification." type="notification" number="1"></d2l-count-badge>`;

const countBadgeWithNoAccessibilityProperties = html`
<d2l-count-badge size="small"  text="1 new notification." type="notification" number="1"></d2l-count-badge>`;

describe('d2l-count-badge', () => {
	[
		{ name: 'Basic count badge', fixture: countBadgeWithNoAccessibilityProperties },
		{ name: 'Count badge with live region', fixture: countBadgeAnnounceChanges },
		{ name: 'Count badge with tooltip', fixture: countBadgeTooltip },
		{ name: 'Count badge with tooltip and live region', fixture: countBadgeAnnounceChangesTooltip }
	].forEach(test => {
		it(`${test.name}`, async() => {
			const elem = await fixture(test.fixture);
			await expect(elem).to.be.accessible();
		});
	});
});
