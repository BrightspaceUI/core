
import { defineCE, expect, fixture, html, nextFrame } from '@open-wc/testing';
import { LabelledMixin, LabelMixin } from '../labelled-mixin.js';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { LitElement } from 'lit-element/lit-element.js';

const labelledTag = defineCE(
	class extends LabelledMixin(LitElement) {
		render() {
			return html`
				<input type="text" aria-label="${ifDefined(this.label)}">
			`;
		}
	}
);

const labelTag = defineCE(
	class extends LabelMixin(LitElement) {
		static get properties() {
			return {
				text: { type: String }
			};
		}
		render() {
			return html`
				<span>${this.text}</span>
			`;
		}
		updated(changedProperties) {
			super.updated(changedProperties);
			if (!changedProperties.has('text')) return;
			this.updateLabel(this.text);
		}
	}
);

const nonLabelTag = defineCE(
	class extends LitElement {
		static get properties() {
			return {
				text: { type: String }
			};
		}
		render() {
			return html`
				<span>${this.text}</span>
			`;
		}
	}
);

describe('LabelMixin', () => {

	let elem;

	beforeEach(async() => {
		elem = await fixture(`
			<${labelTag} text="the label value"></${labelTag}>
		`);
		await elem.updateComplete;
	});

	it('reflects label value', async() => {
		expect(elem.getAttribute('_label')).to.equal('the label value');
	});

	it('reflects label value change', async() => {
		elem.text = 'new label value';
		await nextFrame();
		expect(elem.getAttribute('_label')).to.equal('new label value');
	});

	it('reflects label value from bubbling event', async() => {
		elem.shadowRoot.querySelector('span').dispatchEvent(new CustomEvent('d2l-label-change', {
			bubbles: true,
			composed: true,
			detail: 'new label value'
		}));
		await nextFrame();
		expect(elem.getAttribute('_label')).to.equal('new label value');
	});

});

describe('LabelledMixin', () => {

	let elem;

	beforeEach(async() => {
		elem = await fixture(`
			<div>
				<table>
					<tr>
						<td><${labelledTag} labelled-by="label1"></${labelledTag}></td>
						<td><span id="label1">native element</span></td>
					</tr>
					<tr>
						<td><${labelledTag} labelled-by="label2"></${labelledTag}></td>
						<td><${labelTag} id="label2" text="custom elemnt"></${labelTag}></td>
					</tr>
					<tr>
						<td><${labelledTag} labelled-by="invalidlabel"></${labelledTag}></td>
						<td><${nonLabelTag} id="invalidlabel" text="custom elemnt"></${nonLabelTag}></td>
					</tr>
					<tr>
						<td><${labelledTag} label="explicit label"></${labelledTag}></td>
						<td></td>
					</tr>
					<tr>
						<td><${labelledTag} labelled-by="nolabel"></${labelledTag}></td>
						<td></td>
					</tr>
				</table>
				<span id="label3">other element</span>
			</div>
		`);
	});

	describe('labelling with natve element', () => {

		it('initially applies label', async() => {
			const labelledElem = elem.querySelector('[labelled-by="label1"]');
			expect(labelledElem.shadowRoot.querySelector('input').getAttribute('aria-label')).to.equal('native element');
		});

		it('updates label when labelling element text changes', async() => {
			const labelledElem = elem.querySelector('[labelled-by="label1"]');
			const labelElem = elem.querySelector('#label1');
			labelElem.textContent = 'new label value';
			await nextFrame();
			expect(labelledElem.shadowRoot.querySelector('input').getAttribute('aria-label')).to.equal('new label value');
		});

		it('updates label when labelling element is replaced', async() => {
			const labelledElem = elem.querySelector('[labelled-by="label1"]');
			const labelElem = elem.querySelector('#label1');
			const newLabelElem = document.createElement('span');
			newLabelElem.id = 'label1';
			newLabelElem.textContent = 'new label value';
			labelElem.parentNode.replaceChild(newLabelElem, labelElem);
			await nextFrame();
			expect(labelledElem.shadowRoot.querySelector('input').getAttribute('aria-label')).to.equal('new label value');
		});

		it('updates label when labelledBy changes', async() => {
			const labelledElem = elem.querySelector('[labelled-by="label1"]');
			labelledElem.labelledBy = 'label3';
			await nextFrame();
			expect(labelledElem.shadowRoot.querySelector('input').getAttribute('aria-label')).to.equal('other element');
		});

		it('does not explode if invalid id reference provided', async() => {
			const labelledElem = elem.querySelector('[labelled-by="nolabel"]');
			expect(labelledElem.shadowRoot.querySelector('input').hasAttribute('aria-label')).to.equal(false);
		});

	});

	describe('labelling with custom element', () => {

		it('initially applies label', async() => {
			const labelledElem = elem.querySelector('[labelled-by="label2"]');
			expect(labelledElem.shadowRoot.querySelector('input').getAttribute('aria-label')).to.equal('custom elemnt');
		});

		it('updates label when labelling element text changes', async() => {
			const labelledElem = elem.querySelector('[labelled-by="label2"]');
			const labelElem = elem.querySelector('#label2');
			labelElem.text = 'new label value';
			await nextFrame();
			expect(labelledElem.shadowRoot.querySelector('input').getAttribute('aria-label')).to.equal('new label value');
		});

		it('updates label when labelling element is replaced', async() => {
			const labelledElem = elem.querySelector('[labelled-by="label2"]');
			const labelElem = elem.querySelector('#label2');
			const newLabelElem = document.createElement(labelTag);
			newLabelElem.id = 'label2';
			newLabelElem.text = 'new label value';
			labelElem.parentNode.replaceChild(newLabelElem, labelElem);
			await nextFrame();
			expect(labelledElem.shadowRoot.querySelector('input').getAttribute('aria-label')).to.equal('new label value');
		});

		it('does not explode if invalid id reference provided', async() => {
			const labelledElem = elem.querySelector('[labelled-by="invalidlabel"]');
			expect(labelledElem.shadowRoot.querySelector('input').hasAttribute('aria-label')).to.equal(false);
		});

	});

	describe('explicit label', () => {

		it('initially applies label', async() => {
			const labelledElem = elem.querySelector('[label]');
			expect(labelledElem.shadowRoot.querySelector('input').getAttribute('aria-label')).to.equal('explicit label');
		});

		it('updates label when explicit label changes', async() => {
			const labelledElem = elem.querySelector('[label]');
			labelledElem.label = 'new label value';
			await nextFrame();
			expect(labelledElem.shadowRoot.querySelector('input').getAttribute('aria-label')).to.equal('new label value');
		});

	});

});
