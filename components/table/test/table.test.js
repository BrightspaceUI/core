import '../table-col-sort-button.js';
import '../table-col-sort-button-item.js';
import '../table-controls.js';
import { css, LitElement } from 'lit';
import { defineCE, expect, fixture, html, nextFrame, runConstructor } from '@brightspace-ui/testing';
import { ensureElementVisible, getScrollContainer, getStickyHeadersHeight, tableStyles } from '../table-wrapper.js';
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

		describe('getScrollContainer function', () => {

			it('should return document.documentElement when container is null', () => {
				const scrollContainer = getScrollContainer(null);
				expect(scrollContainer).to.equal(document.documentElement);
			});

			it('should return document.documentElement when container is undefined', () => {
				const scrollContainer = getScrollContainer(undefined);
				expect(scrollContainer).to.equal(document.documentElement);
			});

			it('should return document.documentElement when no scrollable parent is found', async() => {
				const container = await fixture(html`
					<div style="overflow: visible;">
						<div style="overflow: visible;">
							<div id="target">Target element</div>
						</div>
					</div>
				`);

				const target = container.querySelector('#target');
				const scrollContainer = getScrollContainer(target.parentElement);
				expect(scrollContainer).to.equal(document.documentElement);
			});

			it('should find nearest parent with overflow: auto', async() => {
				const container = await fixture(html`
					<div style="overflow: visible;">
						<div style="overflow: auto;" id="scrollable">
							<div id="target">Target element</div>
						</div>
					</div>
				`);

				const target = container.querySelector('#target');
				const scrollableDiv = container.querySelector('#scrollable');
				const scrollContainer = getScrollContainer(target.parentElement);
				expect(scrollContainer).to.equal(scrollableDiv);
			});

			it('should find nearest parent with overflow: scroll', async() => {
				const container = await fixture(html`
					<div style="overflow: visible;">
						<div style="overflow: scroll;" id="scrollable">
							<div id="target">Target element</div>
						</div>
					</div>
				`);

				const target = container.querySelector('#target');
				const scrollableDiv = container.querySelector('#scrollable');
				const scrollContainer = getScrollContainer(target.parentElement);
				expect(scrollContainer).to.equal(scrollableDiv);
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
