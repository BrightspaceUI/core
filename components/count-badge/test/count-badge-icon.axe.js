import '../count-badge-icon.js';
import { expect, fixture, html } from '@open-wc/testing';

const countBadgeWithAccessibilityProperties = html`
<d2l-count-badge-icon size="small" icon="tier1:gear" announce-changes has-tooltip tab-stop text="1 new notification." type="notification" number="1"></d2l-count-badge-icon>`;

const countBadgeWithNoAccessibilityProperties = html`
<d2l-count-badge-icon size="small" icon="tier1:gear" text="1 new notification." type="notification" number="1"></d2l-count-badge-icon>`;

describe('d2l-count-badge-icon', () => {
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
