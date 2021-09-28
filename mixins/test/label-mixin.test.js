
import { defineCE, expect, fixture, html, nextFrame } from '@open-wc/testing';
import { LabelledMixin, LabelMixin } from '../labelled-mixin.js';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { LitElement } from 'lit-element/lit-element.js';

const labelledTag = defineCE(
	class extends LabelledMixin(LitElement) {
		constructor() {
			super();
			this._throwNoLabelExceptionImmediately = true;
		}
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

	describe('labelling with natve element', () => {

		const nativeElemFixture = `
			<div>
				<${labelledTag} labelled-by="label1"></${labelledTag}>
				<span id="label1">native element</span>
				<span id="label3">other element</span>
			</div>
		`;

		it('initially applies label', async() => {
			elem = await fixture(nativeElemFixture);
			const labelledElem = elem.querySelector('[labelled-by="label1"]');
			expect(labelledElem.shadowRoot.querySelector('input').getAttribute('aria-label')).to.equal('native element');
		});

		it('updates label when labelling element text changes', async() => {
			elem = await fixture(nativeElemFixture);
			const labelledElem = elem.querySelector('[labelled-by="label1"]');
			const labelElem = elem.querySelector('#label1');
			labelElem.textContent = 'new label value';
			await nextFrame();
			expect(labelledElem.shadowRoot.querySelector('input').getAttribute('aria-label')).to.equal('new label value');
		});

		it('updates label when labelling element is replaced', async() => {
			elem = await fixture(nativeElemFixture);
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
			elem = await fixture(nativeElemFixture);
			const labelledElem = elem.querySelector('[labelled-by="label1"]');
			labelledElem.labelledBy = 'label3';
			await nextFrame();
			expect(labelledElem.shadowRoot.querySelector('input').getAttribute('aria-label')).to.equal('other element');
		});

		it('does not explode if invalid id reference provided', async() => {
			try {
				elem = await fixture(`<${labelledTag} labelled-by="nolabel"></${labelledTag}>`);
			} catch (e) {
				expect(e.message).to.equal(`LabelledMixin: "${labelledTag}" is labelled-by="nolabel", but no such element exists or its label is empty`);
			}
		});

	});

	describe('labelling with custom element', () => {

		const customElemFixture = `
			<div>
				<${labelledTag} labelled-by="label2"></${labelledTag}>
				<${labelTag} id="label2" text="custom element"></${labelTag}>
			</div>
		`;

		it('initially applies label', async() => {
			elem = await fixture(customElemFixture);
			const labelledElem = elem.querySelector('[labelled-by="label2"]');
			expect(labelledElem.shadowRoot.querySelector('input').getAttribute('aria-label')).to.equal('custom element');
		});

		it('updates label when labelling element text changes', async() => {
			elem = await fixture(customElemFixture);
			const labelledElem = elem.querySelector('[labelled-by="label2"]');
			const labelElem = elem.querySelector('#label2');
			labelElem.text = 'new label value';
			await nextFrame();
			expect(labelledElem.shadowRoot.querySelector('input').getAttribute('aria-label')).to.equal('new label value');
		});

		it('updates label when labelling element is replaced', async() => {
			elem = await fixture(customElemFixture);
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
			elem = await fixture(`
				<div>
					<${labelledTag} labelled-by="invalidlabel"></${labelledTag}>
					<${nonLabelTag} id="invalidlabel" text="custom element"></${nonLabelTag}>
				</div>
			`);
			// TODO: ideally this would throw in the same way the others do, since the label is empty
			const labelledElem = elem.querySelector('[labelled-by="invalidlabel"]');
			expect(labelledElem.shadowRoot.querySelector('input').hasAttribute('aria-label')).to.equal(false);
		});

	});

	describe('explicit label', () => {

		it('initially applies label', async() => {
			elem = await fixture(`<${labelledTag} label="explicit label"></${labelledTag}>`);
			expect(elem.shadowRoot.querySelector('input').getAttribute('aria-label')).to.equal('explicit label');
		});

		it('updates label when explicit label changes', async() => {
			elem = await fixture(`<${labelledTag} label="explicit label"></${labelledTag}>`);
			elem.label = 'new label value';
			await elem.updateComplete;
			expect(elem.shadowRoot.querySelector('input').getAttribute('aria-label')).to.equal('new label value');
		});

		it('throws if label is initially missing', async() => {
			try {
				await fixture(`<${labelledTag}></${labelledTag}>`);
			} catch (e) {
				expect(e.message).to.equal(`LabelledMixin: "${labelledTag}" is missing a required "label" attribute`);
			}
		});

	});

});
