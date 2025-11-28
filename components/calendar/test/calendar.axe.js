import '../calendar.js';
import { expect, fixture, html } from '@brightspace-ui/testing';

const calendarDefault = html`<d2l-calendar></d2l-calendar>`;

const calendarSelectedValue = html`<d2l-calendar selected-value="2015-09-02"></d2l-calendar>`;

const calendarLabel = html`<d2l-calendar label="Event Calendar"></d2l-calendar>`;

const calendarSummary = html`<d2l-calendar summary="Select a date for your appointment"></d2l-calendar>`;

const calendarDayInfos = html`<d2l-calendar day-infos="[{&quot;date&quot;:&quot;2015-09-01&quot;},{&quot;date&quot;:&quot;2015-09-02&quot;},{&quot;date&quot;:&quot;2015-09-03&quot;}]"></d2l-calendar>`;

const calendarMinMaxValue = html`<d2l-calendar min-value="2015-09-01" max-value="2015-09-30"></d2l-calendar>`;

const calendarInitialValue = html`<d2l-calendar initial-value="2015-09-15"></d2l-calendar>`;

const calendarAllAttributes = html`
	<d2l-calendar
		label="Event Calendar"
		summary="Select a date for your appointment"
		selected-value="2015-09-02"
		min-value="2015-09-01"
		max-value="2015-09-30"
		day-infos="[{&quot;date&quot;:&quot;2015-09-02&quot;},{&quot;date&quot;:&quot;2015-09-15&quot;}]">
	</d2l-calendar>
`;

describe('d2l-calendar', () => {
	[
		{ name: 'default', fixture: calendarDefault },
		{ name: 'selected-value', fixture: calendarSelectedValue },
		{ name: 'label', fixture: calendarLabel },
		{ name: 'summary', fixture: calendarSummary },
		{ name: 'day-infos', fixture: calendarDayInfos },
		{ name: 'min-value and max-value', fixture: calendarMinMaxValue },
		{ name: 'initial-value', fixture: calendarInitialValue },
		{ name: 'all attributes', fixture: calendarAllAttributes }
	].forEach(test => {
		it(`${test.name}`, async() => {
			const calendar = await fixture(test.fixture);
			await expect(calendar).to.be.accessible({ ignoredRules: ['presentation-role-conflict'] });
		});
	});
});
