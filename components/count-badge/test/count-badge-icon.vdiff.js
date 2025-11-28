import '../count-badge-icon.js';
import { expect, fixture, focusElem, html, oneEvent } from '@brightspace-ui/testing';

describe('count-badge-icon', () => {

	describe('basic rendering', () => {
		[
			{ name: 'small-notification', template: html`<d2l-count-badge-icon icon="tier3:gear" size="small" type="notification" number="1" text="1 notification"></d2l-count-badge-icon>` },
			{ name: 'large-notification', template: html`<d2l-count-badge-icon icon="tier3:gear" size="large" type="notification" number="5" text="5 notifications"></d2l-count-badge-icon>` },
			{ name: 'small-count', template: html`<d2l-count-badge-icon icon="tier3:gear" size="small" type="count" number="42" text="42 items"></d2l-count-badge-icon>` },
			{ name: 'large-count-icon', template: html`<d2l-count-badge-icon icon="tier3:gear" size="large" type="count" number="1" text="1 item"></d2l-count-badge-icon>` }
		].forEach(({ name, template }) => {
			it(name, async() => {
				const elem = await fixture(template);
				await expect(elem).to.be.golden();
			});
		});
	});

	describe('number truncation', () => {
		[
			{ name: 'small-notification-truncated-2-digits', template: html`<d2l-count-badge-icon icon="tier3:gear" size="small" type="notification" number="100" text="100 notifications"></d2l-count-badge-icon>` },
			{ name: 'large-count-3-digits', template: html`<d2l-count-badge-icon icon="tier3:gear" size="large" type="count" number="123" text="123 items"></d2l-count-badge-icon>` },
			{ name: 'large-count-4-digits', template: html`<d2l-count-badge-icon icon="tier3:gear" size="large" type="count" number="1234" text="1234 items"></d2l-count-badge-icon>` },
			{ name: 'large-count-5-digits', template: html`<d2l-count-badge-icon icon="tier3:gear" size="large" type="count" number="12345" text="12345 items"></d2l-count-badge-icon>` },
			{ name: 'large-number-centered', template: html`<d2l-count-badge-icon icon="tier3:gear" size="large" type="count" number="100000" text="100000 items"></d2l-count-badge-icon>` },
			{ name: 'custom-max-digits-3', template: html`<d2l-count-badge-icon icon="tier3:gear" max-digits="3" number="5000" text="5000 items"></d2l-count-badge-icon>` },
			{ name: 'custom-max-digits-4', template: html`<d2l-count-badge-icon icon="tier3:gear" max-digits="4" number="50000" text="50000 items"></d2l-count-badge-icon>` }
		].forEach(({ name, template }) => {
			it(name, async() => {
				const elem = await fixture(template);
				await expect(elem).to.be.golden();
			});
		});
	});

	describe('hideZero', () => {
		[
			{ name: 'hide-zero-shown', template: html`<d2l-count-badge-icon icon="tier3:gear" number="10" hide-zero text="10 items"></d2l-count-badge-icon>` },
			{ name: 'hide-zero-hidden', template: html`<d2l-count-badge-icon icon="tier3:gear" number="0" hide-zero text="0 items"></d2l-count-badge-icon>` },
			{ name: 'no-hide-zero-with-zero', template: html`<d2l-count-badge-icon icon="tier3:gear" number="0" text="0 items"></d2l-count-badge-icon>` }
		].forEach(({ name, template }) => {
			it(name, async() => {
				const elem = await fixture(template);
				await expect(elem).to.be.golden();
			});
		});
	});

	describe('focus states', () => {
		[
			{ name: 'small-notification-icon-focused', template: html`<d2l-count-badge-icon tab-stop icon="tier3:gear" number="100" type="notification" text="100 notifications"></d2l-count-badge-icon>`, action: elem => focusElem(elem) },
			{ name: 'large-count-icon-focused', template: html`<d2l-count-badge-icon icon="tier3:bookmark" tab-stop size="large" type="count" number="1" text="1 item"></d2l-count-badge-icon>`, action: elem => focusElem(elem) },
			{ name: 'not-tabbable-by-default', template: html`<d2l-count-badge-icon icon="tier3:alert" number="5" text="5 items"></d2l-count-badge-icon>`, action: elem => focusElem(elem) },
			{ name: 'not-tabbable-hide-zero-with-zero', template: html`<d2l-count-badge-icon icon="tier3:email" tab-stop hide-zero number="0" text="0 items"></d2l-count-badge-icon>`, action: elem => focusElem(elem) },
			{ name: 'not-tabbable-skeleton', template: html`<d2l-count-badge-icon icon="tier3:gear" tab-stop skeleton number="5" text="5 items"></d2l-count-badge-icon>`, action: elem => focusElem(elem) }
		].forEach(({ name, template, action }) => {
			it(name, async() => {
				const elem = await fixture(template);
				if (action) await action(elem);
				await expect(elem).to.be.golden();
			});
		});
	});

	describe('skeleton', () => {
		it('icon-skeleton', async() => {
			const elem = await fixture(html`<d2l-count-badge-icon has-tooltip skeleton icon="tier3:gear" number="100" text="100 items"></d2l-count-badge-icon>`);
			await expect(elem).to.be.golden();
		});

		it('no-tooltip-when-skeleton', async() => {
			const elem = await fixture(html`<d2l-count-badge-icon has-tooltip skeleton icon="tier3:gear" number="5" text="5 items"></d2l-count-badge-icon>`);
			await focusElem(elem);
			await expect(elem).to.be.golden();
		});
	});

	describe('rtl', () => {
		[
			{ name: 'small-notification-rtl', template: html`<d2l-count-badge-icon icon="tier3:gear" size="small" type="notification" number="1" text="1 notification"></d2l-count-badge-icon>` },
			{ name: 'large-count-rtl', template: html`<d2l-count-badge-icon icon="tier3:gear" size="large" type="count" number="42" text="42 items"></d2l-count-badge-icon>` },
			{ name: 'large-number-centered-rtl', template: html`<d2l-count-badge-icon icon="tier3:gear" size="large" type="count" number="100000" text="100000 items"></d2l-count-badge-icon>` },
			{ name: 'truncated-notification-rtl', template: html`<d2l-count-badge-icon icon="tier3:gear" type="notification" number="150" text="150 notifications"></d2l-count-badge-icon>` },
			{ name: 'focused-rtl', template: html`<d2l-count-badge-icon tab-stop icon="tier3:gear" number="10" text="10 items"></d2l-count-badge-icon>`, action: elem => focusElem(elem) }
		].forEach(({ name, template, action }) => {
			it(name, async() => {
				const elem = await fixture(template, { rtl: true });
				if (action) await action(elem);
				await expect(elem).to.be.golden();
			});
		});
	});

	describe('tooltip', () => {
		const template = html`<d2l-count-badge-icon has-tooltip icon="tier3:gear" number="10" text="10 new notifications"></d2l-count-badge-icon>`;

		it('tooltip does not appear by default', async() => {
			const elem = await fixture(template);
			await expect(elem).to.be.golden();
		});
		it('tooltip appears on focus-visible', async() => {
			const elem = await fixture(template);
			focusElem(elem);
			await oneEvent(elem, 'd2l-tooltip-show');
			await expect(elem).to.be.golden();
		});
	});

	describe('badge number positioning', () => {
		[
			{ name: 'single-digit-position', template: html`<d2l-count-badge-icon icon="tier3:gear" number="5" text="5 items"></d2l-count-badge-icon>` },
			{ name: 'double-digit-position', template: html`<d2l-count-badge-icon icon="tier3:gear" number="42" text="42 items"></d2l-count-badge-icon>` },
			{ name: 'triple-digit-position', template: html`<d2l-count-badge-icon icon="tier3:gear" number="999" text="999 items"></d2l-count-badge-icon>` },
			{ name: 'four-digit-centered', template: html`<d2l-count-badge-icon icon="tier3:gear" number="1234" text="1234 items"></d2l-count-badge-icon>` }
		].forEach(({ name, template }) => {
			it(name, async() => {
				const elem = await fixture(template);
				await expect(elem).to.be.golden();
			});
		});
	});

});
