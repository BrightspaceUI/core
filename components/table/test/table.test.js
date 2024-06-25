import '../table-col-sort-button.js';
import '../table-col-sort-button-item.js';
import '../table-controls.js';
import { defineCE, expect, fixture, html, runConstructor } from '@brightspace-ui/testing';
import { LitElement } from 'lit';
import { tableStyles } from '../table-wrapper.js';

describe('d2l-table-wrapper', () => {

	describe('constructor', () => {
		it('should construct', () => {
			runConstructor('d2l-table-wrapper');
		});
	});

	describe('body class', () => {

		afterEach(() => {
			document.body.classList.remove('d2l-table-sticky-headers');
		});

		it('should add class to body when sticky', async() => {
			await fixture(html`<d2l-table-wrapper sticky-headers></d2l-table-wrapper>`);
			expect(document.body.classList.contains('d2l-table-sticky-headers')).to.be.true;
		});

		it('should not add class to body when not sticky', async() => {
			await fixture(html`<d2l-table-wrapper></d2l-table-wrapper>`);
			expect(document.body.classList.contains('d2l-table-sticky-headers')).to.be.false;
		});

	});

	describe('popover', () => {

		const tagName = defineCE(
			class extends LitElement {
				static get properties() {
					return {
						stickyHeaders: { type: Boolean, reflect: true, attribute: 'sticky-headers' }
					};
				}
				static get styles() {
					return tableStyles;
				}
				render() {
					return html`
						<d2l-table-wrapper ?sticky-headers="${this.stickyHeaders}">
							<table class="d2l-table">
								<thead>
									<tr>
										<th><span id="some-popover"></span></th>
									</tr>
								</thead>
							</table>
						</d2l-table-wrapper>
					`;
				}
			}
		);

		it('should not set data-popover-count attribute when not sticky and popover opens', async() => {
			const el = await fixture(`<${tagName}></${tagName}>`);
			const popoverElement = el.shadowRoot.querySelector('#some-popover');
			popoverElement.dispatchEvent(new CustomEvent('d2l-dropdown-open', { bubbles: true, composed: true }));
			expect(el.shadowRoot.querySelector('th').getAttribute('data-popover-count')).to.be.null;
		});

		it('should not set data-popover-count attribute when not sticky and popover closes', async() => {
			const el = await fixture(`<${tagName}></${tagName}>`);
			const popoverElement = el.shadowRoot.querySelector('#some-popover');
			popoverElement.dispatchEvent(new CustomEvent('d2l-dropdown-close', { bubbles: true, composed: true }));
			expect(el.shadowRoot.querySelector('th').getAttribute('data-popover-count')).to.be.null;
		});

		it('should increment data-popover-count attribute when sticky and popover opens', async() => {
			const el = await fixture(`<${tagName} sticky-headers></${tagName}>`);
			const popoverElement = el.shadowRoot.querySelector('#some-popover');
			popoverElement.dispatchEvent(new CustomEvent('d2l-dropdown-open', { bubbles: true, composed: true }));
			popoverElement.dispatchEvent(new CustomEvent('d2l-dropdown-open', { bubbles: true, composed: true }));
			expect(el.shadowRoot.querySelector('th').getAttribute('data-popover-count')).to.equal('2');
		});

		it('should decrement data-popover-count attribute when sticky and popover closes', async() => {
			const el = await fixture(`<${tagName} sticky-headers></${tagName}>`);
			const popoverElement = el.shadowRoot.querySelector('#some-popover');
			popoverElement.dispatchEvent(new CustomEvent('d2l-dropdown-open', { bubbles: true, composed: true }));
			popoverElement.dispatchEvent(new CustomEvent('d2l-dropdown-open', { bubbles: true, composed: true }));
			expect(el.shadowRoot.querySelector('th').getAttribute('data-popover-count')).to.equal('2');
			popoverElement.dispatchEvent(new CustomEvent('d2l-dropdown-close', { bubbles: true, composed: true }));
			expect(el.shadowRoot.querySelector('th').getAttribute('data-popover-count')).to.equal('1');
		});

		it('should remove data-popover-count attribute when sticky and all popovers are closed', async() => {
			const el = await fixture(`<${tagName} sticky-headers></${tagName}>`);
			const popoverElement = el.shadowRoot.querySelector('#some-popover');
			popoverElement.dispatchEvent(new CustomEvent('d2l-dropdown-open', { bubbles: true, composed: true }));
			expect(el.shadowRoot.querySelector('th').getAttribute('data-popover-count')).to.equal('1');
			popoverElement.dispatchEvent(new CustomEvent('d2l-dropdown-close', { bubbles: true, composed: true }));
			expect(el.shadowRoot.querySelector('th').getAttribute('data-popover-count')).to.be.null;
		});

	});

});

describe('d2l-table-controls', () => {

	it('should construct', () => {
		runConstructor('d2l-table-controls');
	});

	it('should override default SelectionControls label', async() => {
		const el = await fixture(html`<d2l-table-controls></d2l-table-controls>`);
		const section = el.shadowRoot.querySelector('section');
		expect(section.getAttribute('aria-label')).to.equal('Actions for table');
	});

});

describe('d2l-table-col-sort-button', () => {

	it('should construct', () => {
		runConstructor('d2l-table-col-sort-button');
	});

});

describe('d2l-table-col-sort-button-item', () => {

	it('should construct', () => {
		runConstructor('d2l-table-col-sort-button-item');
	});

});
