import { defineCE, expect, fixture, html } from '@open-wc/testing';
import { duplicateOffscreen } from '../duplicate-offscreen.js';
import { LitElement } from 'lit-element/lit-element.js';

const tag = defineCE(
	class extends LitElement {
		render() {
			const element = html`<div class="element"></div>`;
			return html`${duplicateOffscreen(element)}`;
		}
	}
);

describe('duplicateOffscreen', () => {
	let container;
	beforeEach(async() => {
		container = await fixture(`<${tag}></${tag}>`);
	});

	it('copies the element and marks it as a copy', () => {
		const items = Array.from(container.shadowRoot.querySelectorAll('.element'));
		const duplicate = container.shadowRoot.querySelector('.element:last-child');
		expect(items.length).to.equal(2);
		expect(duplicate.getAttribute('data-duplicate')).to.exist;
		expect(duplicate.getAttribute('aria-hidden')).to.equal('true');
	});
});
