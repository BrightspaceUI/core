import { css, LitElement } from 'lit';
import { defineCE, expect, fixture, html } from '@brightspace-ui/testing';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { inputLabelStyles } from '../input-label-styles.js';
import { inputStyles } from '../input-styles.js';

const viewport = { width: 376 };

const refTag = defineCE(class extends LitElement {

	static properties = { required: { type: Boolean } };

	static styles = [inputStyles, inputLabelStyles, css`:host { display: block; }`];

	render() {
		const ariaRequired = this.required ? 'true' : undefined;
		return html`
			<label for="name" class="d2l-input-label">Name</label>
			<input id="name" type="text" class="d2l-input" aria-required="${ifDefined(ariaRequired)}">
		`;
	}

});

const wrapTag = defineCE(class extends LitElement {

	static properties = { isRequired: { type: Boolean, attribute: 'is-required' } };

	static styles = [inputStyles, inputLabelStyles, css`:host { display: block; }`];

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

	[
		{ name: 'ref', template: `<${refTag}></${refTag}>` },
		{ name: 'ref-required', template: `<${refTag} required></${refTag}>`, allColorModes: true },
		{ name: 'wrap', template: `<${wrapTag}></${wrapTag}>` },
		{ name: 'wrap-required', template: `<${wrapTag} required></${wrapTag}>` }
	].forEach(({ name, allColorModes, template }) => {
		it(name, async() => {
			const elem = await fixture(template, { viewport });
			await expect(elem).to.be.golden({ allColorModes });
		});
	});

});
