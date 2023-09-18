import '../status-indicator.js';
import { expect, fixture, html } from '@brightspace-ui/testing';

describe('d2l-status-indicator', () => {

	[
		{ name: 'no-state-subtle', template: html`<d2l-status-indicator text="due today"></d2l-status-indicator>` },
		{ name: 'default-subtle', template: html`<d2l-status-indicator state="default" text="due today"></d2l-status-indicator>` },
		{ name: 'success-subtle', template: html`<d2l-status-indicator state="success" text="complete"></d2l-status-indicator>` },
		{ name: 'alert-subtle', template: html`<d2l-status-indicator state="alert" text="overdue"></d2l-status-indicator>` },
		{ name: 'none-subtle', template: html`<d2l-status-indicator state="none" text="closed"></d2l-status-indicator>` },
		{ name: 'no-state-bold', template: html`<d2l-status-indicator text="due today" bold></d2l-status-indicator>` },
		{ name: 'default-bold', template: html`<d2l-status-indicator state="default" text="due today" bold></d2l-status-indicator>` },
		{ name: 'success-bold', template: html`<d2l-status-indicator state="success" text="complete" bold></d2l-status-indicator>` },
		{ name: 'alert-bold', template: html`<d2l-status-indicator state="alert" text="overdue" bold></d2l-status-indicator>` },
		{ name: 'none-bold', template: html`<d2l-status-indicator state="none" text="closed" bold></d2l-status-indicator>` }
	].forEach(({ name, template }) => {
		it(name, async() => {
			const elem = await fixture(template);
			await expect(elem).to.be.golden();
		});
	});

});
