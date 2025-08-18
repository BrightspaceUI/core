import '../../button/button.js';
import '../../inputs/input-text.js';
import '../table-col-sort-button.js';
import '../table-controls.js';
import '../table-wrapper.js';
import { expect, fixture, focusElem, html, nextFrame } from '@brightspace-ui/testing';
import { mockFlag, resetFlag } from '../../../helpers/flags.js';

describe('d2l-table-wrapper-focus-scrolling-vdiff', () => {

	before(() => {
		mockFlag('d2l-table-focus-scrolling', true);
	});

	after(() => {
		resetFlag('d2l-table-focus-scrolling');
	});

	function createTestTable(stickyHeaders = false, scrollWrapper = false, tableType = 'default') {
		return html`
			<d2l-table-wrapper
				?sticky-headers="${stickyHeaders}"
				?sticky-headers-scroll-wrapper="${scrollWrapper}"
				type="${tableType}">
				<d2l-table-controls slot="controls">
					<div>Table Controls with Focus Test</div>
				</d2l-table-controls>
				<table class="d2l-table">
					<thead>
						<tr>
							<th><d2l-table-col-sort-button id="header-sort-1">Name</d2l-table-col-sort-button></th>
							<th><d2l-table-col-sort-button id="header-sort-2">Age</d2l-table-col-sort-button></th>
							<th>Actions</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>John Doe</td>
							<td>25</td>
							<td><d2l-button id="action-btn-1" primary>Edit</d2l-button></td>
						</tr>
						<tr>
							<td>Jane Smith</td>
							<td>30</td>
							<td><d2l-button id="action-btn-2">View</d2l-button></td>
						</tr>
						<tr>
							<td>Bob Johnson</td>
							<td>35</td>
							<td><d2l-input-text id="input-1" label="Edit Name" value="Bob Johnson"></d2l-input-text></td>
						</tr>
						<tr>
							<td>Alice Brown</td>
							<td>28</td>
							<td><d2l-button id="action-btn-3">Delete</d2l-button></td>
						</tr>
						<tr>
							<td>Charlie Wilson</td>
							<td>42</td>
							<td><d2l-input-text id="input-2" label="Edit Name" value="Charlie Wilson"></d2l-input-text></td>
						</tr>
					</tbody>
				</table>
			</d2l-table-wrapper>
		`;
	}

	[
		{ name: 'default-sticky-controls', stickyHeaders: true, scrollWrapper: false },
		{ name: 'default-sticky-scroll-wrapper', stickyHeaders: true, scrollWrapper: true },
		{ name: 'light-sticky-controls', stickyHeaders: true, scrollWrapper: false, type: 'light' },
		{ name: 'default-non-sticky', stickyHeaders: false, scrollWrapper: false }
	].forEach(({ name, stickyHeaders, scrollWrapper, type }) => {

		describe(name, () => {

			it('baseline', async() => {
				const elem = await fixture(createTestTable(stickyHeaders, scrollWrapper, type), {
					viewport: { width: 800, height: 600 }
				});
				await nextFrame();
				await expect(elem).to.be.golden();
			});

			it('header-button-focus', async() => {
				const elem = await fixture(createTestTable(stickyHeaders, scrollWrapper, type), {
					viewport: { width: 800, height: 600 }
				});
				await nextFrame();

				const headerButton = elem.querySelector('#header-sort-1');
				await focusElem(headerButton);
				await nextFrame();

				await expect(elem).to.be.golden();
			});

			it('body-button-focus', async() => {
				const elem = await fixture(createTestTable(stickyHeaders, scrollWrapper, type), {
					viewport: { width: 800, height: 600 }
				});
				await nextFrame();

				const bodyButton = elem.querySelector('#action-btn-2');
				await focusElem(bodyButton);
				await nextFrame();

				await expect(elem).to.be.golden();
			});

			it('input-focus', async() => {
				const elem = await fixture(createTestTable(stickyHeaders, scrollWrapper, type), {
					viewport: { width: 800, height: 600 }
				});
				await nextFrame();

				const input = elem.querySelector('#input-1');
				await focusElem(input);
				await nextFrame();

				await expect(elem).to.be.golden();
			});

			if (stickyHeaders) {
				it('scrolled-focus-visibility', async() => {
					const elem = await fixture(html`
						<div style="height: 300px; overflow: auto;">
							<div style="height: 200px; background: #f0f0f0;">Spacer content above table</div>
							${createTestTable(stickyHeaders, scrollWrapper, type)}
							<div style="height: 500px; background: #f0f0f0;">Spacer content below table</div>
						</div>
					`, { viewport: { width: 800, height: 600 } });
					await nextFrame();

					// Scroll to position where sticky headers would interfere
					const container = elem;
					container.scrollTop = 150;
					await nextFrame();

					// Focus on an element that would be hidden
					const button = elem.querySelector('#action-btn-3');
					await focusElem(button);
					await nextFrame();

					await expect(elem).to.be.golden();
				});
			}

		});

	});

	describe('scroll-behavior-scenarios', () => {

		it('table-with-many-rows-focus-scroll', async() => {
			const longTableElem = await fixture(html`
				<div style="height: 400px; overflow: auto;" id="scroll-container">
					<d2l-table-wrapper sticky-headers>
						<d2l-table-controls slot="controls">
							<div>Long Table Controls</div>
						</d2l-table-controls>
						<table class="d2l-table">
							<thead>
								<tr>
									<th>Index</th>
									<th>Name</th>
									<th>Action</th>
								</tr>
							</thead>
							<tbody>
								${Array.from({ length: 20 }, (_, i) => html`
									<tr>
										<td>${i + 1}</td>
										<td>Item ${i + 1}</td>
										<td><d2l-button id="btn-${i + 1}">Action ${i + 1}</d2l-button></td>
									</tr>
								`)}
							</tbody>
						</table>
					</d2l-table-wrapper>
				</div>
			`, { viewport: { width: 800, height: 600 } });
			await nextFrame();

			// Scroll to middle of table
			const scrollContainer = longTableElem;
			scrollContainer.scrollTop = 200;
			await nextFrame();

			// Focus on a button that should trigger scroll adjustment
			const button = longTableElem.querySelector('#btn-15');
			await focusElem(button);
			await nextFrame();

			await expect(longTableElem).to.be.golden();
		});

		it('multiple-sticky-elements-focus', async() => {
			const multiStickyElem = await fixture(html`
				<div style="height: 400px; overflow: auto;">
					<div style="position: sticky; top: 0; background: yellow; padding: 10px; z-index: 10;">
						External Sticky Header
					</div>
					<d2l-table-wrapper sticky-headers>
						<d2l-table-controls slot="controls">
							<div>Table Controls</div>
						</d2l-table-controls>
						<table class="d2l-table">
							<thead>
								<tr>
									<th>Name</th>
									<th>Value</th>
									<th>Action</th>
								</tr>
							</thead>
							<tbody>
								${Array.from({ length: 15 }, (_, i) => html`
									<tr>
										<td>Row ${i + 1}</td>
										<td>Value ${i + 1}</td>
										<td><d2l-button id="multi-btn-${i + 1}">Edit</d2l-button></td>
									</tr>
								`)}
							</tbody>
						</table>
					</d2l-table-wrapper>
				</div>
			`, { viewport: { width: 800, height: 600 } });
			await nextFrame();

			// Scroll to position where multiple sticky elements interfere
			const scrollContainer = multiStickyElem;
			scrollContainer.scrollTop = 100;
			await nextFrame();

			// Focus on a button
			const button = multiStickyElem.querySelector('#multi-btn-8');
			await focusElem(button);
			await nextFrame();

			await expect(multiStickyElem).to.be.golden();
		});

	});

});
