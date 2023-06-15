
import '../../../components/button/button-icon.js';
import { defineCE, expect, fixture, html, nextFrame } from '@brightspace-ui/testing';
import { LitElement } from 'lit';

const targetTag = defineCE(
	class extends LitElement {

		render() {
			return html`
				<div class="d2l-visible-on-ancestor-target">
					<slot></slot>
				</div>
			`;
		}
	}
);

describe('VisibleOnAncestorMixin', () => {

	let elem;

	beforeEach(async() => {
		elem = await fixture(`
			<${targetTag}>
				<d2l-button-icon id="visible-on-ancestor" icon="tier1:gear" text="Gear" visible-on-ancestor></d2l-button-icon>
			</${targetTag}>
		`);
	});

	it('should find target in ancestors shadow DOM', async() => {
		await nextFrame();
		const target = elem.shadowRoot.querySelector('.d2l-visible-on-ancestor-target');
		const visibleOnAncestor = elem.querySelector('#visible-on-ancestor');
		expect(visibleOnAncestor.__voaTarget).to.equal(target);
	});

});
