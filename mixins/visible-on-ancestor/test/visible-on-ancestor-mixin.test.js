
import '../../../components/button/button-icon.js';
import { defineCE, expect, fixture, html } from '@brightspace-ui/testing';
import { LitElement } from 'lit';

const targetClassTag = defineCE(
	class extends LitElement {
		render() {
			return html`
				<div class="d2l-visible-on-ancestor-target"><slot></slot></div>
			`;
		}
	}
);

const targetPropertyTag = defineCE(
	class extends LitElement {
		constructor() {
			super();
			this.isVisibleOnAncestorTarget = true;
		}
		render() {
			return html`<slot></slot>`;
		}
	}
);

describe('VisibleOnAncestorMixin', () => {

	it('should find target in ancestors shadow DOM using class', async() => {
		const elem = await fixture(`
			<${targetClassTag}>
				<d2l-button-icon id="visible-on-ancestor" icon="tier1:gear" text="Gear" visible-on-ancestor></d2l-button-icon>
			</${targetClassTag}>
		`);
		const target = elem.shadowRoot.querySelector('.d2l-visible-on-ancestor-target');
		const visibleOnAncestor = elem.querySelector('#visible-on-ancestor');
		expect(visibleOnAncestor.__voaTarget).to.equal(target);
	});

	it('should find target using property', async() => {
		const elem = await fixture(`
			<${targetPropertyTag}>
				<d2l-button-icon id="visible-on-ancestor" icon="tier1:gear" text="Gear" visible-on-ancestor></d2l-button-icon>
			</${targetPropertyTag}>
		`);
		const visibleOnAncestor = elem.querySelector('#visible-on-ancestor');
		expect(visibleOnAncestor.__voaTarget).to.equal(elem);
	});

});
