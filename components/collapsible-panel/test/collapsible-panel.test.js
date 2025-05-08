import '../collapsible-panel.js';
import '../collapsible-panel-summary-item.js';
import { expect, fixture, html, oneEvent, runConstructor, sendKeys } from '@brightspace-ui/testing';

describe('d2l-collapsible-panel', () => {

	it('should construct', () => {
		runConstructor('d2l-collapsible-panel');
		runConstructor('d2l-collapsible-panel-summary-item');
	});

	describe('panel label', () => {
		it('should default to the panel title', async() => {
			const elem = await fixture(html`
				<d2l-collapsible-panel panel-title="Panel Title">
					Panel Content
				</d2l-collapsible-panel>
			`);

			const button = elem.shadowRoot.querySelector('.d2l-collapsible-panel-opener');
			expect(button.textContent).to.equal('Panel Title');
		});

		it('should be expand-collapse-label if provided', async() => {
			const elem = await fixture(html`
				<d2l-collapsible-panel panel-title="Panel Title" expand-collapse-label="Label describing panel">
					Panel Content
				</d2l-collapsible-panel>
			`);

			const button = elem.shadowRoot.querySelector('.d2l-collapsible-panel-opener');
			expect(button.ariaLabel).to.equal('Label describing panel');
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

	describe('interaction style', () => {
		let button, elem;
		beforeEach(async() => {
			elem = await fixture(html`
				<d2l-collapsible-panel panel-title="Panel Title">
					Panel Content
				</d2l-collapsible-panel>
			`);
			button = elem.shadowRoot.querySelector('button');
		});

		it('clicking button should expand but not trigger focus-visible on button', async() => {
			button.click();
			await oneEvent(elem, 'd2l-collapsible-panel-expand');
			expect(button.matches(':focus-visible')).to.be.false;
		});

		it('clicking header should expand but not trigger focus-visible', async() => {
			const header = elem.shadowRoot.querySelector('.d2l-collapsible-panel-header');
			header.click();
			await oneEvent(elem, 'd2l-collapsible-panel-expand');
			expect(button.matches(':focus-visible')).to.be.false;
		});

		it('selecting heading with keypress should trigger focus-visible and expand', async() => {
			sendKeys('press', 'Tab');
			sendKeys('press', 'Enter');
			await oneEvent(elem, 'd2l-collapsible-panel-expand');
			const button = elem.shadowRoot.querySelector('button');
			expect(button.matches(':focus-visible')).to.be.true;
		});

		it('clicking content should not collapse', async() => {
			elem.expanded = true;
			await oneEvent(elem, 'd2l-collapsible-panel-expand');

			let dispatched = false;
			elem.addEventListener('d2l-collapsible-panel-collapse', () => {
				dispatched = true;
			});

			const content = elem.shadowRoot.querySelector('.d2l-collapsible-panel-content');
			content.click();
			await elem.updateComplete;
			expect(elem.expanded).to.be.true;
			expect(dispatched).to.be.false;
		});
	});

	describe('skeleton', () => {

		it('should not expand on click', async() => {
			const elem = await fixture(html`
				<d2l-collapsible-panel panel-title="Panel Title" skeleton>
					<div slot="header">Header</div>
					<d2l-button-icon slot="actions" icon="tier1:download" text="Download"></d2l-button-icon>
					Panel Content
				</d2l-collapsible-panel>
			`);

			const selectors = [
				'.d2l-collapsible-panel',
				'.d2l-collapsible-panel-header',
				'.d2l-collapsible-panel-header-actions',
				'.d2l-collapsible-panel-header-secondary',
				'.d2l-collapsible-panel-opener'
			];

			for (const selector of selectors) {
				elem.shadowRoot.querySelector(selector).click();
				await elem.updateComplete;
				expect(elem.expanded).to.be.false;
			}
		});
	});

});
