import '../table-col-sort-button.js';
import '../table-col-sort-button-item.js';
import '../table-controls.js';
import { css, LitElement } from 'lit';
import { defineCE, expect, fixture, focusElem, html, nextFrame, runConstructor } from '@brightspace-ui/testing';
import { ensureElementVisible, getStickyHeadersHeight, tableStyles } from '../table-wrapper.js';
import { mockFlag, resetFlag } from '../../../helpers/flags.js';
import sinon from 'sinon';

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

	describe('scrolling focus behavior', () => {
		afterEach(() => {
			resetFlag('d2l-table-focus-scrolling');
		});

		describe('feature flag', () => {

			it('should not add focusin listener when flag is false', async() => {
				mockFlag('d2l-table-focus-scrolling', false);

				const elem = await fixture(html`
					<d2l-table-wrapper>
						<table class="d2l-table">
							<thead>
								<tr>
									<th><button>Header Button</button></th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td><button>Cell Button</button></td>
								</tr>
							</tbody>
						</table>
					</d2l-table-wrapper>
				`);

				// Check that focusin listener is not added
				const button = elem.querySelector('button');
				const spy = sinon.spy(elem, '_ensureElementVisible');

				await focusElem(button);
				await nextFrame();

				expect(spy).to.not.have.been.called;
			});

			it('should add focusin listener when flag is true', async() => {
				mockFlag('d2l-table-focus-scrolling', true);

				const elem = await fixture(html`
					<d2l-table-wrapper>
						<table class="d2l-table">
							<thead>
								<tr>
									<th><button>Header Button</button></th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td><button>Cell Button</button></td>
								</tr>
							</tbody>
						</table>
					</d2l-table-wrapper>
				`);

				const button = elem.querySelector('button');
				const spy = sinon.spy(elem, '_ensureElementVisible');

				await focusElem(button);
				await nextFrame();

				expect(spy).to.have.been.called;
			});

		});

		describe('focus scrolling behavior', () => {

			beforeEach(() => {
				mockFlag('d2l-table-focus-scrolling', true);
			});

			it('should not scroll when focused element is in sticky header', async() => {
				const elem = await fixture(html`
					<d2l-table-wrapper sticky-headers>
						<table class="d2l-table">
							<thead>
								<tr>
									<th><button>Header Button</button></th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td><button>Cell Button</button></td>
								</tr>
							</tbody>
						</table>
					</d2l-table-wrapper>
				`);

				const headerButton = elem.querySelector('thead button');
				const spy = sinon.spy(elem, '_ensureElementVisible');

				await focusElem(headerButton);
				await nextFrame();

				// Should not call _ensureElementVisible for sticky header elements
				expect(spy).to.not.have.been.called;
			});

			it('should scroll when focused element is in table body', async() => {
				const elem = await fixture(html`
					<d2l-table-wrapper sticky-headers>
						<table class="d2l-table">
							<thead>
								<tr>
									<th>Header</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td><button>Cell Button</button></td>
								</tr>
							</tbody>
						</table>
					</d2l-table-wrapper>
				`);

				const cellButton = elem.querySelector('tbody button');
				const spy = sinon.spy(elem, '_ensureElementVisible');

				await focusElem(cellButton);
				await nextFrame();

				expect(spy).to.have.been.calledWith(cellButton);
			});

			it('should not scroll when element is not interactive', async() => {
				const elem = await fixture(html`
					<d2l-table-wrapper sticky-headers>
						<table class="d2l-table">
							<tbody>
								<tr>
									<td><span tabindex="0">Non-interactive span</span></td>
								</tr>
							</tbody>
						</table>
					</d2l-table-wrapper>
				`);

				const span = elem.querySelector('span');
				const spy = sinon.spy(elem, '_ensureElementVisible');

				await focusElem(span);
				await nextFrame();

				expect(spy).to.not.have.been.called;
			});

			it('should not scroll when element is outside the table', async() => {
				const elem = await fixture(html`
					<div>
						<button id="outside-button">Outside Button</button>
						<d2l-table-wrapper sticky-headers>
							<table class="d2l-table">
								<tbody>
									<tr>
										<td><button>Cell Button</button></td>
									</tr>
								</tbody>
							</table>
						</d2l-table-wrapper>
					</div>
				`);

				const tableWrapper = elem.querySelector('d2l-table-wrapper');
				const outsideButton = elem.querySelector('#outside-button');
				const spy = sinon.spy(tableWrapper, '_ensureElementVisible');

				await focusElem(outsideButton);
				await nextFrame();

				expect(spy).to.not.have.been.called;
			});

		});

		describe('scroll calculations', () => {

			beforeEach(() => {
				mockFlag('d2l-table-focus-scrolling', true);
			});

			it('should calculate sticky offset with controls', async() => {
				const elem = await fixture(html`
					<d2l-table-wrapper sticky-headers>
						<d2l-table-controls slot="controls">
							<div>Controls content</div>
						</d2l-table-controls>
						<table class="d2l-table">
							<tbody>
								<tr>
									<td>Content</td>
								</tr>
							</tbody>
						</table>
					</d2l-table-wrapper>
				`);

				await nextFrame();

				const stickyOffset = elem._getStickyOffset();
				expect(stickyOffset).to.be.greaterThan(0);
			});

			it('should calculate sticky headers height', async() => {
				const elem = await fixture(html`
					<d2l-table-wrapper sticky-headers>
						<table class="d2l-table">
							<thead>
								<tr>
									<th>Header 1</th>
									<th>Header 2</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td>Content 1</td>
									<td>Content 2</td>
								</tr>
							</tbody>
						</table>
					</d2l-table-wrapper>
				`);

				await nextFrame();

				const headersHeight = elem._getStickyHeadersHeight();
				expect(headersHeight).to.be.greaterThan(0);
			});

			it('should cache scroll container', async() => {
				const elem = await fixture(html`
					<d2l-table-wrapper>
						<table class="d2l-table">
							<tbody>
								<tr>
									<td>Content</td>
								</tr>
							</tbody>
						</table>
					</d2l-table-wrapper>
				`);

				const container1 = elem._getCachedScrollContainer();
				const container2 = elem._getCachedScrollContainer();

				expect(container1).to.equal(container2);
				expect(container1).to.equal(document.documentElement);
			});

			it('should invalidate cache when configuration changes', async() => {
				const elem = await fixture(html`
					<d2l-table-wrapper>
						<table class="d2l-table">
							<tbody>
								<tr>
									<td>Content</td>
								</tr>
							</tbody>
						</table>
					</d2l-table-wrapper>
				`);

				// Get initial cached values
				elem._getStickyOffset();
				elem._getCachedScrollContainer();

				// Change configuration
				elem.stickyHeaders = true;
				await nextFrame();

				// Cache should be invalidated
				expect(elem._scrollContainer).to.be.null;
				expect(elem._cachedStickyOffset).to.be.null;
			});

		});

		describe('scroll wrapper mode', () => {

			beforeEach(() => {
				mockFlag('d2l-table-focus-scrolling', true);
			});

			it('should use tbody as scroll container in scroll wrapper mode', async() => {
				const elem = await fixture(html`
					<d2l-table-wrapper sticky-headers sticky-headers-scroll-wrapper>
						<table class="d2l-table">
							<thead>
								<tr>
									<th>Header</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td>Content</td>
								</tr>
							</tbody>
						</table>
					</d2l-table-wrapper>
				`);

				await nextFrame();

				const scrollContainer = elem._getScrollContainer();
				const tbody = elem.querySelector('tbody');

				expect(scrollContainer).to.equal(tbody);
			});

		});

		describe('performance optimizations', () => {

			beforeEach(() => {
				mockFlag('d2l-table-focus-scrolling', true);
			});

			it('should cache sticky offset calculations', async() => {
				const elem = await fixture(html`
					<d2l-table-wrapper sticky-headers>
						<table class="d2l-table">
							<thead>
								<tr>
									<th>Header</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td>Content</td>
								</tr>
							</tbody>
						</table>
					</d2l-table-wrapper>
				`);

				await nextFrame();

				// First call should calculate and cache
				const offset1 = elem._getStickyOffset();

				// Second call should use cached value
				const offset2 = elem._getStickyOffset();

				expect(offset1).to.equal(offset2);
				expect(elem._cachedStickyOffset).to.equal(offset1);
			});

			it('should cache sticky headers height calculations', async() => {
				const elem = await fixture(html`
					<d2l-table-wrapper sticky-headers>
						<table class="d2l-table">
							<thead>
								<tr>
									<th>Header</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td>Content</td>
								</tr>
							</tbody>
						</table>
					</d2l-table-wrapper>
				`);

				await nextFrame();

				// First call should calculate and cache
				const height1 = elem._getStickyHeadersHeight();

				// Second call should use cached value
				const height2 = elem._getStickyHeadersHeight();

				expect(height1).to.equal(height2);
				expect(elem._cachedStickyHeadersHeight).to.equal(height1);
			});

		});

		describe('ensureElementVisible function', () => {

			let mockScrollTo, originalScrollTo;

			beforeEach(() => {
				// Mock scrollTo methods
				originalScrollTo = window.scrollTo;
				mockScrollTo = sinon.stub();
				window.scrollTo = mockScrollTo;
			});

			afterEach(() => {
				window.scrollTo = originalScrollTo;
			});

			it('should not scroll when element is already visible and not hidden by sticky headers', async() => {
				const container = await fixture(html`
					<div style="height: 400px; overflow: auto;">
						<button id="test-btn">Visible Button</button>
					</div>
				`);

				const button = container.querySelector('#test-btn');

				// Mock getBoundingClientRect to simulate element being visible
				sinon.stub(button, 'getBoundingClientRect').returns({
					top: 100,
					bottom: 130,
					left: 10,
					right: 100
				});

				// Mock window dimensions
				Object.defineProperty(window, 'innerHeight', { value: 600, configurable: true });

				// Mock scrollTo to capture calls
				container.scrollTo = mockScrollTo;

				ensureElementVisible(0, container, button);

				// Should not call scrollTo when element is already visible
				expect(mockScrollTo).to.not.have.been.called;
			});

			it('should scroll when element is hidden behind sticky headers', async() => {
				const container = await fixture(html`
					<div style="height: 400px; overflow: auto;">
						<button id="test-btn">Hidden Button</button>
					</div>
				`);

				const button = container.querySelector('#test-btn');

				// Mock getBoundingClientRect to simulate element being hidden behind sticky elements
				sinon.stub(button, 'getBoundingClientRect').returns({
					top: 45, // Hidden behind sticky elements (should be > 64: 50 offset + 14 buffer)
					bottom: 75,
					left: 10,
					right: 100
				});

				// Mock scroll container
				Object.defineProperty(container, 'scrollTop', { value: 100, writable: true });
				container.scrollTo = mockScrollTo;

				// Mock window dimensions
				Object.defineProperty(window, 'innerHeight', { value: 600, configurable: true });

				ensureElementVisible(50, container, button);

				// Should call scrollTo to make element visible
				expect(mockScrollTo).to.have.been.called;
				const scrollCall = mockScrollTo.getCall(0);
				expect(scrollCall.args[0]).to.have.property('top');
				expect(scrollCall.args[0]).to.have.property('behavior');
			});

			it('should scroll when element is outside viewport', async() => {
				const container = await fixture(html`
					<div style="height: 400px; overflow: auto;">
						<button id="test-btn">Outside Button</button>
					</div>
				`);

				const button = container.querySelector('#test-btn');

				// Mock getBoundingClientRect to simulate element being outside viewport
				sinon.stub(button, 'getBoundingClientRect').returns({
					top: 650, // Below viewport (innerHeight = 600)
					bottom: 680,
					left: 10,
					right: 100
				});

				// Mock scroll container
				Object.defineProperty(container, 'scrollTop', { value: 0, writable: true });
				container.scrollTo = mockScrollTo;

				// Mock window dimensions
				Object.defineProperty(window, 'innerHeight', { value: 600, configurable: true });

				ensureElementVisible(0, container, button);

				// Should call scrollTo to bring element into viewport
				expect(mockScrollTo).to.have.been.called;
			});

			it('should calculate correct scroll position with sticky offset', async() => {
				const container = await fixture(html`
					<div style="height: 400px; overflow: auto;">
						<button id="test-btn">Test Button</button>
					</div>
				`);

				const button = container.querySelector('#test-btn');

				// Mock getBoundingClientRect
				sinon.stub(button, 'getBoundingClientRect').returns({
					top: 30, // Element at position 30
					bottom: 60,
					left: 10,
					right: 100
				});

				// Mock scroll container with current scroll position
				Object.defineProperty(container, 'scrollTop', { value: 200, writable: true });
				container.scrollTo = mockScrollTo;
				Object.defineProperty(window, 'innerHeight', { value: 600, configurable: true });

				const stickyOffset = 80;
				ensureElementVisible(stickyOffset, container, button);

				// Should call scrollTo with calculated position
				expect(mockScrollTo).to.have.been.called;
				const scrollCall = mockScrollTo.getCall(0);
				// Expected: desiredElementTop = 80 + 14 = 94, scrollAdjustment = 30 - 94 = -64, targetScrollTop = 200 + (-64) = 136
				expect(scrollCall.args[0].top).to.equal(136);
			});

			it('should handle negative scroll positions correctly', async() => {
				const container = await fixture(html`
					<div style="height: 400px; overflow: auto;">
						<button id="test-btn">Test Button</button>
					</div>
				`);

				const button = container.querySelector('#test-btn');

				sinon.stub(button, 'getBoundingClientRect').returns({
					top: 150,
					bottom: 180,
					left: 10,
					right: 100
				});

				Object.defineProperty(container, 'scrollTop', { value: 10, writable: true });
				container.scrollTo = mockScrollTo;
				Object.defineProperty(window, 'innerHeight', { value: 600, configurable: true });

				ensureElementVisible(200, container, button);

				// Should not allow negative scroll positions
				expect(mockScrollTo).to.have.been.called;
				const scrollCall = mockScrollTo.getCall(0);
				expect(scrollCall.args[0].top).to.be.at.least(0);
			});

			it('should account for focus ring buffer in calculations', async() => {
				const container = await fixture(html`
					<div style="height: 400px; overflow: auto;">
						<button id="test-btn">Test Button</button>
					</div>
				`);

				const button = container.querySelector('#test-btn');

				// Element right at the edge of sticky offset
				sinon.stub(button, 'getBoundingClientRect').returns({
					top: 50, // Exactly at sticky offset
					bottom: 80,
					left: 10,
					right: 100
				});

				Object.defineProperty(container, 'scrollTop', { value: 0, writable: true });
				container.scrollTo = mockScrollTo;
				Object.defineProperty(window, 'innerHeight', { value: 600, configurable: true });

				const stickyOffset = 50;
				ensureElementVisible(stickyOffset, container, button);

				// Should still trigger scroll because of 14px buffer
				expect(mockScrollTo).to.have.been.called;
			});

		});

		describe('getStickyHeadersHeight function', () => {

			it('should return 0 when table is null', () => {
				const height = getStickyHeadersHeight(null);
				expect(height).to.equal(0);
			});

			it('should return 0 when table has no sticky headers', async() => {
				const container = await fixture(html`
					<table class="d2l-table">
						<tbody>
							<tr>
								<td>No headers</td>
							</tr>
						</tbody>
					</table>
				`);

				const height = getStickyHeadersHeight(container);
				expect(height).to.equal(0);
			});

			it('should calculate height for thead headers', async() => {
				const container = await fixture(html`
					<table class="d2l-table">
						<thead>
							<tr>
								<th>Header 1</th>
								<th>Header 2</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td>Cell 1</td>
								<td>Cell 2</td>
							</tr>
						</tbody>
					</table>
				`);

				await nextFrame();

				// Mock offsetHeight for header cells
				const headerCell = container.querySelector('thead th');
				Object.defineProperty(headerCell, 'offsetHeight', { value: 40, configurable: true });

				const height = getStickyHeadersHeight(container);
				expect(height).to.equal(40);
			});

			it('should calculate height for multiple header rows', async() => {
				const container = await fixture(html`
					<table class="d2l-table">
						<thead>
							<tr>
								<th>Header Row 1</th>
							</tr>
							<tr>
								<th>Header Row 2</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td>Cell</td>
							</tr>
						</tbody>
					</table>
				`);

				await nextFrame();

				// Mock offsetHeight for each header row
				const headerRows = container.querySelectorAll('thead tr');
				headerRows.forEach(row => {
					const cell = row.querySelector('th');
					Object.defineProperty(cell, 'offsetHeight', { value: 35, configurable: true });
				});

				const height = getStickyHeadersHeight(container);
				expect(height).to.equal(70); // 35 * 2 rows
			});

			it('should calculate height for rows with d2l-table-header class', async() => {
				const container = await fixture(html`
					<table class="d2l-table">
						<tbody>
							<tr class="d2l-table-header">
								<th>Class Header</th>
							</tr>
							<tr>
								<td>Cell</td>
							</tr>
						</tbody>
					</table>
				`);

				await nextFrame();

				// Mock offsetHeight for header cell
				const headerCell = container.querySelector('.d2l-table-header th');
				Object.defineProperty(headerCell, 'offsetHeight', { value: 42, configurable: true });

				const height = getStickyHeadersHeight(container);
				expect(height).to.equal(42);
			});

			it('should calculate height for rows with header attribute', async() => {
				const container = await fixture(html`
					<table class="d2l-table">
						<tbody>
							<tr header>
								<th>Attribute Header</th>
							</tr>
							<tr>
								<td>Cell</td>
							</tr>
						</tbody>
					</table>
				`);

				await nextFrame();

				// Mock offsetHeight for header cell
				const headerCell = container.querySelector('[header] th');
				Object.defineProperty(headerCell, 'offsetHeight', { value: 38, configurable: true });

				const height = getStickyHeadersHeight(container);
				expect(height).to.equal(38);
			});

			it('should handle mixed header types', async() => {
				const container = await fixture(html`
					<table class="d2l-table">
						<thead>
							<tr>
								<th>Thead Header</th>
							</tr>
						</thead>
						<tbody>
							<tr class="d2l-table-header">
								<th>Class Header</th>
							</tr>
							<tr header>
								<th>Attribute Header</th>
							</tr>
							<tr>
								<td>Cell</td>
							</tr>
						</tbody>
					</table>
				`);

				await nextFrame();

				// Mock offsetHeight for each type of header
				const theadCell = container.querySelector('thead th');
				const classCell = container.querySelector('.d2l-table-header th');
				const attrCell = container.querySelector('[header] th');

				Object.defineProperty(theadCell, 'offsetHeight', { value: 40, configurable: true });
				Object.defineProperty(classCell, 'offsetHeight', { value: 35, configurable: true });
				Object.defineProperty(attrCell, 'offsetHeight', { value: 30, configurable: true });

				const height = getStickyHeadersHeight(container);
				expect(height).to.equal(105); // 40 + 35 + 30
			});

			it('should skip cells with rowspan for height calculation', async() => {
				const container = await fixture(html`
					<table class="d2l-table">
						<thead>
							<tr>
								<th rowspan="2">Spanning Header</th>
								<th>Regular Header</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td>Cell</td>
							</tr>
						</tbody>
					</table>
				`);

				await nextFrame();

				// Mock offsetHeight - only the non-rowspan cell should be counted
				const regularCell = container.querySelector('th:not([rowspan])');
				Object.defineProperty(regularCell, 'offsetHeight', { value: 45, configurable: true });

				const height = getStickyHeadersHeight(container);
				expect(height).to.equal(45); // Only counts non-rowspan cell
			});

			it('should return 0 when header cells have no measurable height', async() => {
				const container = await fixture(html`
					<table class="d2l-table">
						<thead>
							<tr>
								<th>Header</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td>Cell</td>
							</tr>
						</tbody>
					</table>
				`);

				await nextFrame();

				// Mock offsetHeight as 0 (hidden or no layout)
				const headerCell = container.querySelector('thead th');
				Object.defineProperty(headerCell, 'offsetHeight', { value: 0, configurable: true });

				const height = getStickyHeadersHeight(container);
				expect(height).to.equal(0);
			});

			it('should handle tables with only td headers (no th elements)', async() => {
				const container = await fixture(html`
					<table class="d2l-table">
						<thead>
							<tr>
								<td>TD Header 1</td>
								<td>TD Header 2</td>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td>Cell 1</td>
								<td>Cell 2</td>
							</tr>
						</tbody>
					</table>
				`);

				await nextFrame();

				// Mock offsetHeight for td header cells
				const headerCell = container.querySelector('thead td');
				Object.defineProperty(headerCell, 'offsetHeight', { value: 32, configurable: true });

				const height = getStickyHeadersHeight(container);
				expect(height).to.equal(32);
			});

			it('should handle empty table with headers', async() => {
				const container = await fixture(html`
					<table class="d2l-table">
						<thead>
							<tr>
								<th>Empty Table Header</th>
							</tr>
						</thead>
					</table>
				`);

				await nextFrame();

				// Mock offsetHeight for header cell
				const headerCell = container.querySelector('thead th');
				Object.defineProperty(headerCell, 'offsetHeight', { value: 36, configurable: true });

				const height = getStickyHeadersHeight(container);
				expect(height).to.equal(36);
			});

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
