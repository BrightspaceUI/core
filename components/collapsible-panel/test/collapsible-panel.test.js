import '../collapsible-panel.js';
import '../collapsible-panel-summary-item.js';
import '../collapsible-panel-group.js';
import { expect, fixture, html } from '@brightspace-ui/testing';
import { runConstructor } from '../../../tools/constructor-test-helper.js';

describe('d2l-collapsible-panel', () => {

	it('should construct', () => {
		runConstructor('d2l-collapsible-panel');
		runConstructor('d2l-collapsible-panel-summary-item');
		runConstructor('d2l-collapsible-panel-group');
	});

	describe('panel label', () => {
		it('should default to the panel title', async() => {
			const elem = await fixture(html`
				<d2l-collapsible-panel panel-title="Panel Title">
					Panel Content
				</d2l-collapsible-panel>
			`);

			const button = elem.shadowRoot.querySelector('button.d2l-offscreen');
			expect(button.textContent).to.equal('Panel Title');
		});

		it('should be expand-collapse-label if provided', async() => {
			const elem = await fixture(html`
				<d2l-collapsible-panel panel-title="Panel Title" expand-collapse-label="Label describing panel">
					Panel Content
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
					Panel Content
				</d2l-collapsible-panel>
			`);

			const heading = elem.shadowRoot.querySelector('.d2l-collapsible-panel-title');
			expect(heading.tagName).to.equal('H3');
			expect(heading.classList.contains('d2l-heading-3')).to.be.true;
		});

		it('style alone should set style but not level', async() => {
			const elem = await fixture(html`
				<d2l-collapsible-panel panel-title="Panel Title" heading-style="2">
					Panel Content
				</d2l-collapsible-panel>
			`);

			const heading = elem.shadowRoot.querySelector('.d2l-collapsible-panel-title');
			expect(heading.tagName).to.equal('H3');
			expect(heading.classList.contains('d2l-heading-2')).to.be.true;
		});

		it('level alone should also set style', async() => {
			const elem = await fixture(html`
				<d2l-collapsible-panel panel-title="Panel Title" heading-level="2">
					Panel Content
				</d2l-collapsible-panel>
			`);

			const heading = elem.shadowRoot.querySelector('.d2l-collapsible-panel-title');
			expect(heading.tagName).to.equal('H2');
			expect(heading.classList.contains('d2l-heading-2')).to.be.true;
		});

		it('level of 5 should use style of 4', async() => {
			const elem = await fixture(html`
				<d2l-collapsible-panel panel-title="Panel Title" heading-level="5">
					Panel Content
				</d2l-collapsible-panel>
			`);

			const heading = elem.shadowRoot.querySelector('.d2l-collapsible-panel-title');
			expect(heading.tagName).to.equal('H5');
			expect(heading.classList.contains('d2l-heading-4')).to.be.true;
		});

		it('level of 6 should use style of 4', async() => {
			const elem = await fixture(html`
				<d2l-collapsible-panel panel-title="Panel Title" heading-level="6">
					Panel Content
				</d2l-collapsible-panel>
			`);

			const heading = elem.shadowRoot.querySelector('.d2l-collapsible-panel-title');
			expect(heading.tagName).to.equal('H6');
			expect(heading.classList.contains('d2l-heading-4')).to.be.true;
		});

		it('level and style can be set independently', async() => {
			const elem = await fixture(html`
				<d2l-collapsible-panel panel-title="Panel Title" heading-level="1" heading-style="3">
					Panel Content
				</d2l-collapsible-panel>
			`);

			const heading = elem.shadowRoot.querySelector('.d2l-collapsible-panel-title');
			expect(heading.tagName).to.equal('H1');
			expect(heading.classList.contains('d2l-heading-3')).to.be.true;
		});

		it('level and style are normalized to valid values', async() => {
			const elem = await fixture(html`
				<!-- Ignore lit-analyzer - it prevents us from providing invalid property values -->
				<!-- @ts-ignore -->
				<d2l-collapsible-panel panel-title="Panel Title" heading-level="0" heading-style="5">
					Panel Content
				</d2l-collapsible-panel>
			`);

			const heading = elem.shadowRoot.querySelector('.d2l-collapsible-panel-title');
			expect(heading.tagName).to.equal('H1');
			expect(heading.classList.contains('d2l-heading-4')).to.be.true;
		});
	});

	describe('skeleton', () => {

		it('should not expand on click', async() => {
			const elem = await fixture(html`
				<d2l-collapsible-panel panel-title="Panel Title" skeleton>
					<div slot="header">Header</div>
					<d2l-button-icon slot="actions" icon="tier1:download"></d2l-button-icon>
					Panel Content
				</d2l-collapsible-panel>
			`);

			const selectors = [
				'.d2l-collapsible-panel',
				'.d2l-collapsible-panel-header',
				'.d2l-collapsible-panel-header-actions',
				'.d2l-collapsible-panel-header-secondary',
				'button.d2l-offscreen'
			];

			for (const selector of selectors) {
				elem.shadowRoot.querySelector(selector).click();
				await elem.updateComplete;
				expect(elem.expanded).to.be.false;
			}
		});
	});

});
