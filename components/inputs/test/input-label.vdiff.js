import { css, LitElement } from 'lit';
import { defineCE, expect, fixture, html } from '@brightspace-ui/testing';
import { loadSass, unloadSass } from '../../../test/load-sass.js';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { inputLabelStyles } from '../input-label-styles.js';
import { inputStyles } from '../input-styles.js';

const viewport = { width: 376 };

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
