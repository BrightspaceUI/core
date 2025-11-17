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

	describe('ARIA attributes', () => {

		it('has correct aria-label on region', async() => {
			const calendar = await fixture(html`<d2l-calendar selected-value="2015-09-02"></d2l-calendar>`);
			const region = calendar.shadowRoot.querySelector('[role="region"]');
			expect(region.getAttribute('aria-label')).to.include('September');
		});

		it('has correct aria-label on region with label attribute', async() => {
			const calendar = await fixture(html`<d2l-calendar selected-value="2015-09-02" label="Event Calendar"></d2l-calendar>`);
			const region = calendar.shadowRoot.querySelector('[role="region"]');
			const ariaLabel = region.getAttribute('aria-label');
			expect(ariaLabel).to.include('Event Calendar');
			expect(ariaLabel).to.include('September');
		});

		it('has correct aria-labelledby on table', async() => {
			const calendar = await fixture(html`<d2l-calendar selected-value="2015-09-02"></d2l-calendar>`);
			const table = calendar.shadowRoot.querySelector('table');
			const heading = calendar.shadowRoot.querySelector('.d2l-heading-4');
			const labelId = table.getAttribute('aria-labelledby');
			expect(labelId).to.equal(heading.id);
		});

		it('has aria-selected on selected date', async() => {
			const calendar = await fixture(html`<d2l-calendar selected-value="2015-09-02"></d2l-calendar>`);
			const selectedCell = calendar.shadowRoot.querySelector('td[data-date="2"][data-month="8"]');
			expect(selectedCell.getAttribute('aria-selected')).to.equal('true');
		});

		it('has aria-selected false on non-selected dates', async() => {
			const calendar = await fixture(html`<d2l-calendar selected-value="2015-09-02"></d2l-calendar>`);
			const nonSelectedCell = calendar.shadowRoot.querySelector('td[data-date="1"][data-month="8"]');
			expect(nonSelectedCell.getAttribute('aria-selected')).to.equal('false');
		});

		it('has correct aria-label on date with day info', async() => {
			const calendar = await fixture(html`<d2l-calendar selected-value="2015-09-02" day-infos="[{&quot;date&quot;:&quot;2015-09-02&quot;}]"></d2l-calendar>`);
			const dateWithInfo = calendar.shadowRoot.querySelector('td[data-date="2"][data-month="8"] button');
			const ariaLabel = dateWithInfo.getAttribute('aria-label');
			expect(ariaLabel).to.exist; // TODO: this doesnt seem to actually test the content of the aria-label
		});

		it('has offscreen caption when summary provided', async() => {
			const calendar = await fixture(html`<d2l-calendar selected-value="2015-09-02" summary="Test summary"></d2l-calendar>`);
			const caption = calendar.shadowRoot.querySelector('caption');
			expect(caption).to.exist;
			expect(caption.textContent).to.equal('Test summary');
			expect(caption.classList.contains('d2l-offscreen')).to.be.true;
		});

		it('has no caption when summary not provided', async() => {
			const calendar = await fixture(html`<d2l-calendar selected-value="2015-09-02"></d2l-calendar>`);
			const caption = calendar.shadowRoot.querySelector('caption');
			expect(caption).to.not.exist;
		});

	});

	describe('keyboard accessibility', () => {
		// TODO: check for both before min and after max
		it('has disabled attribute on dates outside min/max range', async() => {
			const calendar = await fixture(html`<d2l-calendar min-value="2015-09-10" max-value="2015-09-20" selected-value="2015-09-15"></d2l-calendar>`);
			const disabledDate = calendar.shadowRoot.querySelector('td[data-date="1"][data-month="8"] button');
			expect(disabledDate.hasAttribute('disabled')).to.be.true;
		});

		it('has no disabled attribute on dates within min/max range', async() => {
			const calendar = await fixture(html`<d2l-calendar min-value="2015-09-10" max-value="2015-09-20" selected-value="2015-09-15"></d2l-calendar>`);
			const enabledDate = calendar.shadowRoot.querySelector('td[data-date="15"][data-month="8"] button');
			expect(enabledDate.hasAttribute('disabled')).to.be.false;
		});

	});

});
