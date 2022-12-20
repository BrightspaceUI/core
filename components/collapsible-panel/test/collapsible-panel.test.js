import '../collapsible-panel.js';
import '../collapsible-panel-summary-item.js';
import { expect, fixture, html } from '@open-wc/testing';
import { runConstructor } from '../../../tools/constructor-test-helper.js';

describe('d2l-collapsible-panel', () => {

	it('should construct', () => {
		runConstructor('d2l-collapsible-panel');
		runConstructor('d2l-collapsible-panel-summary-item');
	});

	describe('panel label', () => {
		it('should default to the panel title', async() => {
			const elem = await fixture(html`
				<d2l-collapsible-panel panel-title="Panel Title">
					<div slot="content">Panel content</div>
				</d2l-collapsible-panel>
			`);

			const button = elem.shadowRoot.querySelector('button.d2l-offscreen');
			expect(button.textContent).to.equal('Panel Title');
		});

		it('should be expand-collapse-label if provided', async() => {
			const elem = await fixture(html`
				<d2l-collapsible-panel panel-title="Panel Title" expand-collapse-label="Label describing panel">
					<div slot="content">Panel content</div>
				</d2l-collapsible-panel>
			`);

			const button = elem.shadowRoot.querySelector('button.d2l-offscreen');
			expect(button.textContent).to.equal('Label describing panel');
		});
	});

	describe('heading', () => {
		it('level should default to h3 and style to d2l-heading-3', async() => {
			const elem = await fixture(html`
				<d2l-collapsible-panel panel-title="Panel Title">
					<div slot="content">Panel content</div>
				</d2l-collapsible-panel>
			`);

			const heading = elem.shadowRoot.querySelector('.d2l-collapsible-panel-title');
			expect(heading.tagName).to.equal('H3');
			expect(heading.classList.contains('d2l-heading-3')).to.be.true;
		});

		it('style alone should set style but not level', async() => {
			const elem = await fixture(html`
				<d2l-collapsible-panel panel-title="Panel Title" heading-style="2">
					<div slot="content">Panel content</div>
				</d2l-collapsible-panel>
			`);

			const heading = elem.shadowRoot.querySelector('.d2l-collapsible-panel-title');
			expect(heading.tagName).to.equal('H3');
			expect(heading.classList.contains('d2l-heading-2')).to.be.true;
		});

		it('level alone should also set style', async() => {
			const elem = await fixture(html`
				<d2l-collapsible-panel panel-title="Panel Title" heading-level="2">
					<div slot="content">Panel content</div>
				</d2l-collapsible-panel>
			`);

			const heading = elem.shadowRoot.querySelector('.d2l-collapsible-panel-title');
			expect(heading.tagName).to.equal('H2');
			expect(heading.classList.contains('d2l-heading-2')).to.be.true;
		});

		it('level and style can be set independently', async() => {
			const elem = await fixture(html`
				<d2l-collapsible-panel panel-title="Panel Title" heading-level="1" heading-style="3">
					<div slot="content">Panel content</div>
				</d2l-collapsible-panel>
			`);

			const heading = elem.shadowRoot.querySelector('.d2l-collapsible-panel-title');
			expect(heading.tagName).to.equal('H1');
			expect(heading.classList.contains('d2l-heading-3')).to.be.true;
		});
	});

});
