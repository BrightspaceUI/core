import '../table-col-sort-button.js';
import '../table-col-sort-button-item.js';
import '../table-controls.js';
import { css, LitElement } from 'lit';
import { defineCE, expect, fixture, html, nextFrame, runConstructor } from '@brightspace-ui/testing';
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

	describe('sticky scrolling async content', () => {

		const tagName = defineCE(
			class extends LitElement {
				static get properties() {
					return {
						stickyHeaders: { type: Boolean, reflect: true, attribute: 'sticky-headers' }
					};
				}
				static get styles() {
					return [tableStyles, css`
						:host {
							display: block;
							width: 150px;
						}
					`];
				}
				render() {
					return html`
						<d2l-table-wrapper sticky-headers sticky-headers-scroll-wrapper>
							<table class="d2l-table">
								<thead>
									<tr>
										<th><span id="slow-content"></span></th>
										<th>Fast Content</th>
									</tr>
								</thead>
								<tbody>
									<tr>
										<td id="one-one">1-1</td>
										<td>1-2</td>
									</tr>
								</tbody>
							</table>
						</d2l-table-wrapper>
					`;
				}
			}
		);

		[1, 20, 100].forEach(width => it(`should sync column widths if initial content changes cell widths - ${width}`, async() => {
			const el = await fixture(`<${tagName}></${tagName}>`);
			const slowEl = el.shadowRoot.querySelector('#slow-content');
			const row1_1 = el.shadowRoot.querySelector('#one-one');
			const row1_1InitialWidth = row1_1.getBoundingClientRect().width;
			expect(slowEl.getBoundingClientRect().width).to.equal(0);
			expect(row1_1InitialWidth).to.be.greaterThan(0);
			slowEl.innerText = Array(width).fill('x').join('');
			await nextFrame();
			expect(slowEl.getBoundingClientRect().width).to.be.greaterThan(0);
			if (width > 1) {
				expect(row1_1.getBoundingClientRect().width).to.be.greaterThan(row1_1InitialWidth);
			} else {
				expect(row1_1.getBoundingClientRect().width).to.equal(row1_1InitialWidth);
			}
			expect(slowEl.parentElement.getBoundingClientRect().width).to.equal(row1_1.getBoundingClientRect().width);
			expect(el.shadowRoot.querySelector('d2l-table-wrapper')._noScrollWidth).to.be[`${width < 20}`];
		}));
	});

	describe('sticky headers with shadow DOM', () => {
		let element, wrapper;
		const tagName = defineCE(
			class extends LitElement {
				static get properties() {
					return {
						loadedCount: { status: true }
					};
				}
				constructor() {
					super();
					this.loadedCount = 5;
				}

				render() {
					return html`
						<d2l-table-wrapper>
							<table class="d2l-table">
								<thead>
									<tr>
										<th>Header</th>
									</tr>
								</thead>
								<tbody>
									${Array.from({length: this.loadedCount}, (_, i) => i + 1).map(i => html`<tr><td>${i}</td></tr>`)}
								</tbody>
							</table>
						</d2l-table-wrapper>
					`;
				}

				loadData(n) {
					this.loadedCount += n;
				}
			}
		);

		async function nextWrapperUpdate() {
			await element.updateComplete;
			await nextFrame();
			await wrapper.updateComplete;
		}

		beforeEach(async() => {
			element = await fixture(`<${tagName}></${tagName}>`);
			wrapper = element.shadowRoot.querySelector('d2l-table-wrapper');
		});

		it('should accurately count items on load', () => {
			expect(wrapper._itemShowingCount).to.equal(5);
		});

		it('should update count when items are added', async() => {
			element.loadData(3);
			await nextWrapperUpdate();

			expect(wrapper._itemShowingCount).to.equal(8);
		});

		it('should update count when items are removed', async() => {
			element.loadData(3);
			await nextWrapperUpdate();
			element.loadedCount = 5;
			await nextWrapperUpdate();
			expect(wrapper._itemShowingCount).to.equal(5);
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
