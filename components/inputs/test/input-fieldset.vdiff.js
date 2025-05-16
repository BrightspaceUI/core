import '../input-fieldset.js';
import { defineCE, expect, fixture, html } from '@brightspace-ui/testing';
import { inputLabelStyles } from '../input-label-styles.js';
import { LitElement } from 'lit';

const inputs = html`<div style="border: 1px solid black; padding: 10px;">Inputs go in here.</div>`;

const fieldsetManualTag = defineCE(class extends LitElement {

	static get properties() {
		return { required: { type: Boolean } };
	}

	static get styles() { return [inputLabelStyles]; }

	render() {
		return html`
			<fieldset class="d2l-input-label-fieldset">
				<legend class="d2l-input-label">Ingredients</legend>
				${inputs}
			</fieldset>
		`;
	}

});

describe('d2l-input-fieldset', () => {

	[
		{ name: 'fieldset', template: html`<d2l-input-fieldset label="Bun">${inputs}</d2l-input-fieldset>` },
		{ name: 'fieldset-required', template: html`<d2l-input-fieldset label="Bun" required>${inputs}</d2l-input-fieldset>` },
		{ name: 'fieldset-label-hidden', template: html`<d2l-input-fieldset label="Bun" label-hidden>${inputs}</d2l-input-fieldset>` },
		{ name: 'fieldset-label-style-heading', template: html`<d2l-input-fieldset label="Bun" label-style="heading">${inputs}</d2l-input-fieldset>` },
		{ name: 'fieldset-label-hidden-style-heading', template: html`<d2l-input-fieldset label="Bun" label-hidden label-style="heading">${inputs}</d2l-input-fieldset>` },
		{ name: 'fieldset-manual', template: `<${fieldsetManualTag}></${fieldsetManualTag}>` },
		{ name: 'fieldset-manual-required', template: `<${fieldsetManualTag} required></${fieldsetManualTag}>` },
	].forEach(({ name, template }) => {
		it(name, async() => {
			const elem = await fixture(template, { viewport: { width: 376 } });
			await expect(elem).to.be.golden();
		});
	});

});
