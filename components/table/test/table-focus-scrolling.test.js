import '../table-col-sort-button.js';
import '../table-controls.js';
import '../table-wrapper.js';
import { aTimeout, expect, fixture, focusElem, html, nextFrame } from '@brightspace-ui/testing';
import { mockFlag, resetFlag } from '../../../helpers/flags.js';
import sinon from 'sinon';

describe('d2l-table-wrapper focus scrolling', () => {

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
			await aTimeout(50);

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

			await aTimeout(50); // Wait for requestAnimationFrame

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
			await aTimeout(50);

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
			await aTimeout(50);

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
			await aTimeout(50);

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
			await aTimeout(50);

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

});
