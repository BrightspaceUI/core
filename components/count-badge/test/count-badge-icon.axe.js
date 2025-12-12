import '../count-badge-icon.js';
import { expect, fixture, html } from '@brightspace-ui/testing';

const countBadgeAnnounceChanges = html`
<d2l-count-badge-icon icon="tier3:gear" size="small" announce-changes text="1 new notification." type="notification" number="1"></d2l-count-badge-icon>`;

const countBadgeTooltip = html`
<d2l-count-badge-icon icon="tier3:gear" size="small" has-tooltip text="1 new notification." type="notification" number="1"></d2l-count-badge-icon>`;

const countBadgeAnnounceChangesTooltip = html`
<d2l-count-badge-icon icon="tier3:gear" size="small" announce-changes has-tooltip text="1 new notification." type="notification" number="1"></d2l-count-badge-icon>`;

const countBadgeWithNoAccessibilityProperties = html`
<d2l-count-badge-icon icon="tier3:gear" size="small" text="1 new notification." type="notification" number="1"></d2l-count-badge-icon>`;

const countBadgeSkeleton = html`
<d2l-count-badge-icon icon="tier3:gear" size="small" skeleton text="10 notifications" type="notification" number="10"></d2l-count-badge-icon>`;

const countBadgeHideZero = html`
<d2l-count-badge-icon icon="tier3:gear" size="small" hide-zero text="0 items" type="count" number="0"></d2l-count-badge-icon>`;

const countBadgeTabStop = html`
<d2l-count-badge-icon icon="tier3:gear" size="small" tab-stop text="5 items" type="count" number="5"></d2l-count-badge-icon>`;

describe('d2l-count-badge-icon', () => {
	[
		{ name: 'Basic count badge', fixture: countBadgeWithNoAccessibilityProperties },
		{ name: 'Count badge with live region', fixture: countBadgeAnnounceChanges },
		{ name: 'Count badge with tooltip', fixture: countBadgeTooltip },
		{ name: 'Count badge with tooltip and live region', fixture: countBadgeAnnounceChangesTooltip },
		{ name: 'Count badge in skeleton mode', fixture: countBadgeSkeleton },
		{ name: 'Count badge with hideZero', fixture: countBadgeHideZero },
		{ name: 'Count badge with tabStop', fixture: countBadgeTabStop }
	].forEach(test => {
		it(`${test.name}`, async() => {
			const elem = await fixture(test.fixture);
			await expect(elem).to.be.accessible();
		});
	});
});
