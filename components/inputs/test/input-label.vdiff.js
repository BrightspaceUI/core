import '../input-fieldset.js';
import { css, LitElement } from 'lit';
import { defineCE, expect, fixture, html } from '@brightspace-ui/testing';
import { loadSass, unloadSass } from '../../../test/load-sass.js';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { inputLabelStyles } from '../input-label-styles.js';
import { inputStyles } from '../input-styles.js';

const viewport = { width: 376 };

const inputs = html`<div style="border: 1px solid black; padding: 10px;">Inputs go in here.</div>`;

const fieldsetTag = defineCE(class extends LitElement {

	static get properties() {
		return { required: { type: Boolean } };
	}

	render() {
		return html`
			<d2l-input-fieldset label="Bun" ?required="${this.required}">
				${inputs}
			</d2l-input-fieldset>
		`;
	}

});

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

const refTag = defineCE(class extends LitElement {

	static get properties() {
		return { required: { type: Boolean } };
	}

	static get styles() {
		return [inputStyles, inputLabelStyles, css`:host { display: block; }`];
	}

	render() {
		const ariaRequired = this.required ? 'true' : undefined;
		return html`
			<label for="name" class="d2l-input-label">Name</label>
			<input id="name" type="text" class="d2l-input" aria-required="${ifDefined(ariaRequired)}">
		`;
	}

});

const wrapTag = defineCE(class extends LitElement {

	static get properties() {
		return { isRequired: { type: Boolean, attribute: 'is-required' } };
	}

	static get styles() {
		return [inputStyles, inputLabelStyles, css`:host { display: block; }`];
	}

	render() {
		const classes = {
			'd2l-input-label': true,
			'd2l-input-label-required': this.isRequired
		};
		const ariaRequired = this.isRequired ? 'true' : undefined;
		return html`
			<label>
				<span class="${classMap(classes)}">Name</span>
				<input type="text" class="d2l-input" aria-required="${ifDefined(ariaRequired)}">
			</label>
		`;
	}

});

describe('d2l-input-label', () => {

	before(loadSass);
	after(unloadSass);

	[
		{ name: 'fieldset', template: `<${fieldsetTag}></${fieldsetTag}>` },
		{ name: 'fieldset-required', template: `<${fieldsetTag} required></${fieldsetTag}>` },
		{ name: 'fieldset-manual', template: `<${fieldsetManualTag}></${fieldsetManualTag}>` },
		{ name: 'fieldset-manual-required', template: `<${fieldsetManualTag} required></${fieldsetManualTag}>` },
		{ name: 'ref', template: `<${refTag}></${refTag}>` },
		{ name: 'ref-required', template: `<${refTag} required></${refTag}>` },
		{ name: 'wrap', template: `<${wrapTag}></${wrapTag}>` },
		{ name: 'wrap-required', template: `<${wrapTag} required></${wrapTag}>` },
		{
			name: 'sass-ref',
			template: html`
				<div>
					<label for="input-sass-ref" class="d2l-test-input-label">Name</label>
					<input type="text" id="input-sass-ref" class="d2l-test-input-text">
				</div>
			`
		},
		{
			name: 'sass-ref-required',
			template: html`
				<div>
					<label for="input-sass-ref-required" class="d2l-test-input-label d2l-test-input-label-required">Name</label>
					<input type="text" id="input-sass-ref-required" class="d2l-test-input-text" aria-required="true">
				</div>
			`
		},
		{
			name: 'sass-wrap',
			template: html`
				<div>
					<label>
						<span class="d2l-test-input-label">Name</span>
						<input type="text" class="d2l-test-input-text">
					</label>
				</div>
			`
		},
		{
			name: 'sass-wrap-required',
			template: html`
				<div>
					<label>
						<span class="d2l-test-input-label d2l-test-input-label-required">Name</span>
						<input type="text" class="d2l-test-input-text" aria-required="true">
					</label>
				</div>
			`
		}
	].forEach(({ name, template }) => {
		it(name, async() => {
			const elem = await fixture(template, { viewport });
			await expect(elem).to.be.golden();
		});
	});

});
