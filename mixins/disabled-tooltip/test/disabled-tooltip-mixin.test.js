import './disabled-tooltip-mixin-test.js';
import { expect, fixture, html } from '@brightspace-ui/testing';

describe('disabled states', () => {
	it('should set aria-disabled when disabled with disabledTooltip', async() => {
		const el = await fixture(html`<disabled-tooltip-test disabled disabled-tooltip="Cannot perform action"></disabled-tooltip-test>`);
		const button = el.shadowRoot.querySelector('button');
		expect(button.getAttribute('aria-disabled')).to.equal('true');
		expect(button.hasAttribute('disabled')).to.be.false;
	});
	it('should set disabled attribute when disabled without disabledTooltip', async() => {
		const el = await fixture(html`<disabled-tooltip-test disabled></disabled-tooltip-test>`);
		const button = el.shadowRoot.querySelector('button');
		expect(button.hasAttribute('disabled')).to.be.true;
		expect(button.hasAttribute('aria-disabled')).to.be.false;
	});

});
