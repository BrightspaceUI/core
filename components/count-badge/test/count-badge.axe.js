import '../count-badge.js';
import { expect, fixture, html } from '@brightspace-ui/testing';

const countBadgeTooltip = html`
<d2l-count-badge size="small" has-tooltip text="1 new notification." type="notification" number="1"></d2l-count-badge>`;

const countBadgeAnnounceChanges = html`
<d2l-count-badge size="small" announce-changes text="1 new notification." type="notification" number="1"></d2l-count-badge>`;

const countBadgeAnnounceChangesTooltip = html`
<d2l-count-badge size="small" announce-changes has-tooltip text="1 new notification." type="notification" number="1"></d2l-count-badge>`;

const countBadgeWithNoAccessibilityProperties = html`
<d2l-count-badge size="small" text="1 new notification." type="notification" number="1"></d2l-count-badge>`;

const countBadgeTabStop = html`
<d2l-count-badge size="small" tab-stop text="5 unread messages." type="count" number="5"></d2l-count-badge>`;

const countBadgeTabStopTooltip = html`
<d2l-count-badge size="small" tab-stop has-tooltip text="5 unread messages." type="count" number="5"></d2l-count-badge>`;

const countBadgeLargeNumber = html`
<d2l-count-badge size="large" has-tooltip text="Over 99 new notifications." type="notification" number="150"></d2l-count-badge>`;

describe('d2l-count-badge', () => {
	[
		{ name: 'Basic count badge', fixture: countBadgeWithNoAccessibilityProperties },
		{ name: 'Count badge with live region', fixture: countBadgeAnnounceChanges },
		{ name: 'Count badge with tooltip', fixture: countBadgeTooltip },
		{ name: 'Count badge with tooltip and live region', fixture: countBadgeAnnounceChangesTooltip },
		{ name: 'Count badge with tab stop', fixture: countBadgeTabStop },
		{ name: 'Count badge with tab stop and tooltip', fixture: countBadgeTabStopTooltip },
		{ name: 'Count badge with truncated number', fixture: countBadgeLargeNumber }
	].forEach(test => {
		it(`${test.name}`, async() => {
			const elem = await fixture(test.fixture);
			await expect(elem).to.be.accessible();
		});
	});
});
