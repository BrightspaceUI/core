import '../count-badge.js';
import { expect, fixture, html, runConstructor } from '@brightspace-ui/testing';

describe('d2l-count-badge', () => {

	describe('constructor', () => {
		it('should construct', () => {
			runConstructor('d2l-count-badge');
		});
	});

	describe('defaults', () => {

		it('should default announceChanges to false', async() => {
			const el = await fixture(html`<d2l-count-badge number="1" text="1 notification"></d2l-count-badge>`);
			expect(el.announceChanges).to.be.false;
		});

	});

	describe('number formatting', () => {

		it('should display number as-is when within maxDigits', async() => {
			const el = await fixture(html`<d2l-count-badge number="42" text="42 items"></d2l-count-badge>`);
			const numberString = el.getNumberString();
			expect(numberString).to.equal('42');
		});

		it('should truncate and add plus when exceeding maxDigits', async() => {
			const el = await fixture(html`<d2l-count-badge type="notification" number="150" text="150 notifications"></d2l-count-badge>`);
			const numberString = el.getNumberString();
			expect(numberString).to.equal('99+');
		});

		it('should truncate count type at 5 digits', async() => {
			const el = await fixture(html`<d2l-count-badge type="count" number="123456" text="items"></d2l-count-badge>`);
			const numberString = el.getNumberString();
			expect(numberString).to.equal('99,999+');
		});

		it('should use custom maxDigits when provided', async() => {
			const el = await fixture(html`<d2l-count-badge max-digits="3" number="5000" text="5000 items"></d2l-count-badge>`);
			const numberString = el.getNumberString();
			expect(numberString).to.equal('999+');
		});

		it('should clamp maxDigits to 5 when set higher', async() => {
			const el = await fixture(html`<d2l-count-badge max-digits="10" number="1" text="1 item"></d2l-count-badge>`);
			expect(el.maxDigits).to.equal(5);
		});

		it('should clamp maxDigits to 5 when updated to higher value', async() => {
			const el = await fixture(html`<d2l-count-badge max-digits="3" number="1" text="1 item"></d2l-count-badge>`);
			el.maxDigits = 10;
			await el.updateComplete;
			expect(el.maxDigits).to.equal(5);
		});

	});

	describe('aria-label', () => {

		it('should use text property for aria-label', async() => {
			const el = await fixture(html`<d2l-count-badge number="7" text="7 unread messages"></d2l-count-badge>`);
			const labelDiv = el.shadowRoot.querySelector('[aria-label]');
			expect(labelDiv.getAttribute('aria-label')).to.equal('7 unread messages');
		});

		it('should set aria-labelledby when no tooltip', async() => {
			const el = await fixture(html`<d2l-count-badge number="5" text="5 items"></d2l-count-badge>`);
			const wrapper = el.shadowRoot.querySelector('.d2l-count-badge-wrapper');
			expect(wrapper.hasAttribute('aria-labelledby')).to.be.true;
		});

	});

	describe('aria-live', () => {

		it('should have aria-live="off" by default', async() => {
			const el = await fixture(html`<d2l-count-badge number="5" text="5 items"></d2l-count-badge>`);
			const liveRegion = el.shadowRoot.querySelector('[aria-live]');
			expect(liveRegion.getAttribute('aria-live')).to.equal('off');
		});

		it('should have aria-live="polite" when announceChanges is true', async() => {
			const el = await fixture(html`<d2l-count-badge announce-changes number="5" text="5 items"></d2l-count-badge>`);
			const liveRegion = el.shadowRoot.querySelector('[aria-live]');
			expect(liveRegion.getAttribute('aria-live')).to.equal('polite');
		});

		it('should have aria-atomic="true" on live region', async() => {
			const el = await fixture(html`<d2l-count-badge number="5" text="5 items"></d2l-count-badge>`);
			const liveRegion = el.shadowRoot.querySelector('[aria-live]');
			expect(liveRegion.getAttribute('aria-atomic')).to.equal('true');
		});

	});

	describe('role', () => {

		it('should have role="img"', async() => {
			const el = await fixture(html`<d2l-count-badge number="5" text="5 items"></d2l-count-badge>`);
			const wrapper = el.shadowRoot.querySelector('.d2l-count-badge-wrapper');
			expect(wrapper.getAttribute('role')).to.equal('img');
		});

	});

	describe('getAriaLabelId', () => {

		it('should return labelId when hasTooltip is false', async() => {
			const el = await fixture(html`<d2l-count-badge number="5" text="5 items"></d2l-count-badge>`);
			const labelId = el.getAriaLabelId();
			expect(labelId).to.not.be.undefined;
			expect(labelId).to.be.a('string');
		});

		it('should return undefined when hasTooltip is true', async() => {
			const el = await fixture(html`<d2l-count-badge has-tooltip number="5" text="5 items"></d2l-count-badge>`);
			const labelId = el.getAriaLabelId();
			expect(labelId).to.be.undefined;
		});

	});

});
