import '../form-errory-summary.js';
import { clickElem, expect, fixture, html } from '@brightspace-ui/testing';

const errors = [
	{ href: '#first-error', message: 'An error occured' },
	{ href: '#second-error', message: 'A different error occured' }
];

describe('d2l-form-error-summary', () => {

	it('no errors', async() => {
		const elem = await fixture(html`<d2l-form-error-summary style="height: 10px; width: 10px;"></d2l-form-error-summary>`);
		await expect(elem).to.be.golden();
	});

	it('expanded single error', async() => {
		const elem = await fixture(html`<d2l-form-error-summary .errors="${[errors[0]]}"></d2l-form-error-summary>`);
		await expect(elem).to.be.golden();
	});

	it('expanded multiple errors', async() => {
		const elem = await fixture(html`<d2l-form-error-summary .errors="${errors}"></d2l-form-error-summary>`);
		await expect(elem).to.be.golden();
	});

	it('collapsed', async() => {
		const elem = await fixture(html`<d2l-form-error-summary .errors="${errors}"></d2l-form-error-summary>`);
		await clickElem(elem.shadowRoot.querySelector('d2l-button-icon[icon="tier1:arrow-collapse-small"]'));
		await expect(elem).to.be.golden();
	});

});
