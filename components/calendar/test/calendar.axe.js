import '../calendar.js';
import { expect, fixture, html } from '@brightspace-ui/testing';

describe('d2l-calendar', () => {

	it('default', async() => {
		const calendar = await fixture(html`<d2l-calendar></d2l-calendar>`);
		await expect(calendar).to.be.accessible({ ignoredRules: ['presentation-role-conflict'] });
	});

	it('selected-value', async() => {
		const calendar = await fixture(html`<d2l-calendar selected-value="2015-09-02"></d2l-calendar>`);
		await expect(calendar).to.be.accessible({ ignoredRules: ['presentation-role-conflict'] });
	});

	it('label', async() => {
		const calendar = await fixture(html`<d2l-calendar label="Event Calendar"></d2l-calendar>`);
		await expect(calendar).to.be.accessible({ ignoredRules: ['presentation-role-conflict'] });
	});

	it('summary', async() => {
		const calendar = await fixture(html`<d2l-calendar summary="Select a date for your appointment"></d2l-calendar>`);
		await expect(calendar).to.be.accessible({ ignoredRules: ['presentation-role-conflict'] });
	});

	it('day-infos', async() => {
		const calendar = await fixture(html`<d2l-calendar day-infos="[{&quot;date&quot;:&quot;2015-09-01&quot;},{&quot;date&quot;:&quot;2015-09-02&quot;},{&quot;date&quot;:&quot;2015-09-03&quot;}]"></d2l-calendar>`);
		await expect(calendar).to.be.accessible({ ignoredRules: ['presentation-role-conflict'] });
	});

	it('min-value and max-value', async() => {
		const calendar = await fixture(html`<d2l-calendar min-value="2015-09-01" max-value="2015-09-30"></d2l-calendar>`);
		await expect(calendar).to.be.accessible({ ignoredRules: ['presentation-role-conflict'] });
	});

	it('initial-value', async() => {
		const calendar = await fixture(html`<d2l-calendar initial-value="2015-09-15"></d2l-calendar>`);
		await expect(calendar).to.be.accessible({ ignoredRules: ['presentation-role-conflict'] });
	});

	it('all attributes', async() => {
		const calendar = await fixture(html`
			<d2l-calendar
				label="Event Calendar"
				summary="Select a date for your appointment"
				selected-value="2015-09-02"
				min-value="2015-09-01"
				max-value="2015-09-30"
				day-infos="[{&quot;date&quot;:&quot;2015-09-02&quot;},{&quot;date&quot;:&quot;2015-09-15&quot;}]">
			</d2l-calendar>
		`);
		await expect(calendar).to.be.accessible({ ignoredRules: ['presentation-role-conflict'] });
	});

});
