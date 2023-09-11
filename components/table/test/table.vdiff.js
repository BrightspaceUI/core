import '../../inputs/input-number.js';
import '../../inputs/input-text.js';
import '../demo/table-test.js';
import '../table-col-sort-button.js';
import { defineCE, expect, fixture, focusElem, html, nextFrame } from '@brightspace-ui/testing';
import { LitElement } from 'lit';
import { tableStyles } from '../table-wrapper.js';

const colSortButtonFixture = html`
	<table class="d2l-table">
		<thead>
			<tr>
				<th><d2l-table-col-sort-button>Ascending</d2l-table-col-sort-button></th>
				<th><d2l-table-col-sort-button desc>Descending</d2l-table-col-sort-button></th>
				<th><d2l-table-col-sort-button nosort>No Sort</d2l-table-col-sort-button></th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td>Cell 1-A</td>
				<td>Cell 1-B</td>
				<td>Cell 1-C</td>
			</tr>
		</tbody>
	</table>
`;

describe('d2l-table', () => {

	['ltr', 'rtl'].forEach((dir) => {
		describe(dir, () => {
			['default', 'light'].forEach((type) => {

				async function createFixture(markup, opts) {
					const rtl = (dir === 'rtl');
					const tag = defineCE(
						class extends LitElement {
							static get styles() {
								return [tableStyles];
							}
							render() {
								const wrapper = html`
									<d2l-table-wrapper
										?no-column-border="${opts?.noColumnBorder}"
										?sticky-headers="${opts?.stickyHeaders}"
										style="--d2l-input-position: static;"
										type="${type}">${markup}</d2l-table-wrapper>`;
								if (!opts?.bottomMargin) {
									return wrapper;
								}
								return html`<div style="margin-bottom: 1000px;">${wrapper}</div>`;
							}
						}
					);
					return fixture(
						`<${tag}></${tag}>`,
						{
							rtl,
							viewport: opts?.viewport || { width: 500 }
						}
					);
				}

				describe(type, () => {

					describe('nonstick', () => {

						it('standard-thead', async() => {
							const elem = await createFixture(html`
								<table class="d2l-table">
									<thead>
										<tr>
											<th>Header A</th>
											<th>Header B</th>
											<th>Header C</th>
										</tr>
									</thead>
									<tbody>
										<tr>
											<td>Cell 1-A</td>
											<td>Cell 1-B</td>
											<td>Cell 1-C</td>
										</tr>
										<tr>
											<td>Cell 2-A</td>
											<td>Cell 2-B</td>
											<td>Cell 2-C</td>
										</tr>
										<tr>
											<td>Cell 3-A</td>
											<td>Cell 3-B</td>
											<td>Cell 3-C</td>
										</tr>
									</tbody>
								</table>
							`);
							await expect(elem).to.be.golden();
						});

						it('standard-no-thead-class', async() => {
							const elem = await createFixture(html`
								<table class="d2l-table">
									<tr class="d2l-table-header">
										<th>Header A</th>
										<th>Header B</th>
										<th>Header C</th>
									</tr>
									<tr>
										<td>Cell 1-A</td>
										<td>Cell 1-B</td>
										<td>Cell 1-C</td>
									</tr>
									<tr>
										<td>Cell 2-A</td>
										<td>Cell 2-B</td>
										<td>Cell 2-C</td>
									</tr>
									<tr>
										<td>Cell 3-A</td>
										<td>Cell 3-B</td>
										<td>Cell 3-C</td>
									</tr>
								</table>
							`);
							await expect(elem).to.be.golden();
						});

						it('standard-no-thead-attr', async() => {
							const elem = await createFixture(html`
								<table class="d2l-table">
									<tr header>
										<th>Header A</th>
										<th>Header B</th>
										<th>Header C</th>
									</tr>
									<tr>
										<td>Cell 1-A</td>
										<td>Cell 1-B</td>
										<td>Cell 1-C</td>
									</tr>
									<tr>
										<td>Cell 2-A</td>
										<td>Cell 2-B</td>
										<td>Cell 2-C</td>
									</tr>
									<tr>
										<td>Cell 3-A</td>
										<td>Cell 3-B</td>
										<td>Cell 3-C</td>
									</tr>
								</table>
							`);
							await expect(elem).to.be.golden();
						});

						it('vertical-align', async() => {
							const elem = await createFixture(html`
								<table class="d2l-table">
									<thead>
										<tr>
											<th>Header A</th>
											<th>Header B<br>line 2</th>
											<th>Header C</th>
										</tr>
									</thead>
									<tbody>
										<tr>
											<td>Cell 1-A</td>
											<td>Cell 1-B<br>line 2</td>
											<td>Cell 1-C</td>
										</tr>
									</tbody>
								</table>
							`);
							await expect(elem).to.be.golden();
						});

						it('empty', async() => {
							const elem = await createFixture(html`
								<table class="d2l-table">
									<thead>
										<tr>
											<th></th>
											<th></th>
											<th></th>
										</tr>
									</thead>
									<tbody>
										<tr>
											<td></td>
											<td></td>
											<td></td>
										</tr>
									</tbody>
								</table>
							`);
							await expect(elem).to.be.golden();
						});

						it('one-column', async() => {
							const elem = await createFixture(html`
								<table class="d2l-table">
									<thead>
										<tr>
											<th>Header A</th>
										</tr>
									</thead>
									<tbody>
										<tr>
											<td>Cell 1-A</td>
										</tr>
									</tbody>
								</table>
							`);
							await expect(elem).to.be.golden();
						});

						it('one-cell', async() => {
							const elem = await createFixture(html`
								<table class="d2l-table">
									<tbody>
										<tr>
											<td>Cell 1-A</td>
										</tr>
									</tbody>
								</table>
							`);
							await expect(elem).to.be.golden();
						});

						it('no-header-tbody', async() => {
							const elem = await createFixture(html`
								<table class="d2l-table">
									<tbody>
										<tr>
											<td>Cell 1-A</td>
											<td>Cell 1-B</td>
											<td>Cell 1-C</td>
										</tr>
										<tr>
											<td>Cell 2-A</td>
											<td>Cell 2-B</td>
											<td>Cell 2-C</td>
										</tr>
									</tbody>
								</table>
							`);
							await expect(elem).to.be.golden();
						});

						it('no-header-no-tbody', async() => {
							const elem = await createFixture(html`
								<table class="d2l-table">
									<tr>
										<td>Cell 1-A</td>
										<td>Cell 1-B</td>
										<td>Cell 1-C</td>
									</tr>
									<tr>
										<td>Cell 2-A</td>
										<td>Cell 2-B</td>
										<td>Cell 2-C</td>
									</tr>
								</table>
							`);
							await expect(elem).to.be.golden();
						});

						it('rowspan', async() => {
							const elem = await createFixture(html`
								<table class="d2l-table">
									<thead>
										<tr>
											<th rowspan="2">Country</th>
											<th colspan="3">Fruit</th>
										</tr>
										<tr>
											<th>Apples</th>
											<th>Bananas</th>
											<th>Pears</th>
										</tr>
									</thead>
									<tbody>
										<tr>
											<th>Canada</th>
											<td>$1.29</td>
											<td>$0.79</td>
											<td>$2.41</td>
										</tr>
										<tr>
											<th>Mexico</th>
											<td>$0.59</td>
											<td>$0.38</td>
											<td>$1.99</td>
										</tr>
									</tbody>
								</table>
							`);
							await expect(elem).to.be.golden();
						});

						it('footer', async() => {
							const elem = await createFixture(html`
								<table class="d2l-table">
									<thead>
										<tr>
											<th>Header A</th>
											<th>Header B</th>
											<th>Header C</th>
										</tr>
									</thead>
									<tbody>
										<tr>
											<td>Cell 1-A</td>
											<td>Cell 1-B</td>
											<td>Cell 1-C</td>
										</tr>
									</tbody>
									<tfoot>
										<tr>
											<td>Footer 1-A</td>
											<td>Footer 1-B</td>
											<td>Footer 1-C</td>
										</tr>
									</tfoot>
								</table>
							`);
							await expect(elem).to.be.golden();
						});

						it('selected-one-row', async() => {
							const elem = await createFixture(html`
								<table class="d2l-table">
									<thead>
										<tr>
											<th>Header A</th>
											<th>Header B</th>
											<th>Header C</th>
										</tr>
									</thead>
									<tbody>
										<tr>
											<td>Cell 1-A</td>
											<td>Cell 1-B</td>
											<td>Cell 1-C</td>
										</tr>
										<tr selected>
											<td>Cell 2-A</td>
											<td>Cell 2-B</td>
											<td>Cell 2-C</td>
										</tr>
										<tr>
											<td>Cell 3-A</td>
											<td>Cell 3-B</td>
											<td>Cell 3-C</td>
										</tr>
									</tbody>
								</table>
							`);
							await expect(elem).to.be.golden();
						});

						it('selected-top-bottom', async() => {
							const elem = await createFixture(html`
								<table class="d2l-table">
									<thead>
										<tr>
											<th>Header A</th>
											<th>Header B</th>
											<th>Header C</th>
										</tr>
									</thead>
									<tbody>
										<tr selected>
											<td>Cell 1-A</td>
											<td>Cell 1-B</td>
											<td>Cell 1-C</td>
										</tr>
										<tr>
											<td>Cell 2-A</td>
											<td>Cell 2-B</td>
											<td>Cell 2-C</td>
										</tr>
										<tr selected>
											<td>Cell 3-A</td>
											<td>Cell 3-B</td>
											<td>Cell 3-C</td>
										</tr>
									</tbody>
								</table>
							`);
							await expect(elem).to.be.golden();
						});

						it('selected-all', async() => {
							const elem = await createFixture(html`
								<table class="d2l-table">
									<thead>
										<tr>
											<th>Header A</th>
											<th>Header B</th>
											<th>Header C</th>
										</tr>
									</thead>
									<tbody>
										<tr selected>
											<td>Cell 1-A</td>
											<td>Cell 1-B</td>
											<td>Cell 1-C</td>
										</tr>
										<tr selected>
											<td>Cell 2-A</td>
											<td>Cell 2-B</td>
											<td>Cell 2-C</td>
										</tr>
										<tr selected>
											<td>Cell 3-A</td>
											<td>Cell 3-B</td>
											<td>Cell 3-C</td>
										</tr>
									</tbody>
								</table>
							`);
							await expect(elem).to.be.golden();
						});

						it('overflow', async() => {
							const elem = await createFixture(html`
								<table class="d2l-table">
									<thead>
										<tr>
											<th rowspan="2" style="width: 1%" class="top"><input type="checkbox"></th>
											<th rowspan="2">Country</th>
											<th colspan="5">Fruit Production (tons)</th>
										</tr>
										<tr>
											<th>Apples</th>
											<th>Oranges</th>
											<th>Bananas</th>
											<th>Peaches</th>
											<th>Grapes</th>
										</tr>
									</thead>
									<tbody>
										<tr>
											<td class="down"><input type="checkbox"></td>
											<th>Canada</th>
											<td>356,863</td>
											<td>0</td>
											<th>0</th>
											<td>23,239</td>
											<td class="over">90,911</td>
										</tr>
										<tr selected>
											<td><input type="checkbox" checked></td>
											<th>Australia</th>
											<td>308,298</td>
											<td>398,610</td>
											<td>354,241</td>
											<td>80,807</td>
											<td>1,772,911</td>
										</tr>
										<tr>
											<td><input type="checkbox"></td>
											<th>Mexico</th>
											<td>716,931</td>
											<td>4,603,253</td>
											<td>2,384,778</td>
											<td>176,909</td>
											<td>351,310</td>
										</tr>
									</tbody>
								</table>
							`);
							await expect(elem).to.be.golden();
						});

						it('no-column-border', async() => {
							const elem = await createFixture(html`
								<table class="d2l-table">
									<thead>
										<tr>
											<th>Header A</th>
											<th>Header B</th>
											<th>Header C</th>
										</tr>
									</thead>
									<tbody>
										<tr>
											<td>Cell 1-A</td>
											<td>Cell 1-B</td>
											<td>Cell 1-C</td>
										</tr>
										<tr>
											<td>Cell 2-A</td>
											<td>Cell 2-B</td>
											<td>Cell 2-C</td>
										</tr>
										<tr>
											<td>Cell 3-A</td>
											<td>Cell 3-B</td>
											<td>Cell 3-C</td>
										</tr>
									</tbody>
								</table>
							`, { noColumnBorder: true });
							await expect(elem).to.be.golden();
						});

						it('no-column-border-legacy', async() => {
							const elem = await createFixture(html`
								<table class="d2l-table" no-column-border>
									<thead>
										<tr>
											<th>Header A</th>
											<th>Header B</th>
											<th>Header C</th>
										</tr>
									</thead>
									<tbody>
										<tr>
											<td>Cell 1-A</td>
											<td>Cell 1-B</td>
											<td>Cell 1-C</td>
										</tr>
										<tr>
											<td>Cell 2-A</td>
											<td>Cell 2-B</td>
											<td>Cell 2-C</td>
										</tr>
										<tr>
											<td>Cell 3-A</td>
											<td>Cell 3-B</td>
											<td>Cell 3-C</td>
										</tr>
									</tbody>
								</table>
							`);
							await expect(elem).to.be.golden();
						});

						it('col-sort-button', async() => {
							const elem = await createFixture(colSortButtonFixture);
							await expect(elem).to.be.golden();
						});

						it('col-sort-button-focus', async() => {
							const elem = await createFixture(colSortButtonFixture);
							await focusElem(elem.shadowRoot.querySelector('d2l-table-col-sort-button'));
							await expect(elem).to.be.golden();
						});

					});

					describe('sticky', () => {
						[
							{
								name: 'one-row-thead',
								template: html`
									<table class="d2l-table">
										<thead>
											<tr class="top">
												<th>Header A</th>
												<th>Header B</th>
												<th>Header C</th>
											</tr>
										</thead>
										<tbody>
											<tr>
												<td>Cell 1-A</td>
												<td>Cell 1-B</td>
												<td>Cell 1-C</td>
											</tr>
											<tr class="down">
												<td>Cell 2-A</td>
												<td><d2l-input-text label="label" label-hidden value="Cell 2-B" input-width="100px"></d2l-input-text></td>
												<td>Cell 2-C</td>
											</tr>
											<tr>
												<td>Cell 3-A</td>
												<td>Cell 3-B</td>
												<td>Cell 3-C</td>
											</tr>
										</tbody>
									</table>
								`
							},
							{
								name: 'one-row-no-thead-class',
								template: html`
									<table class="d2l-table">
										<tr class="d2l-table-header top">
											<th>Header A</th>
											<th>Header B</th>
											<th>Header C</th>
										</tr>
										<tr>
											<td>Cell 1-A</td>
											<td>Cell 1-B</td>
											<td>Cell 1-C</td>
										</tr>
										<tr class="down">
											<td>Cell 2-A</td>
											<td><d2l-input-text label="label" label-hidden value="Cell 2-B" input-width="100px"></d2l-input-text></td>
											<td>Cell 2-C</td>
										</tr>
										<tr>
											<td>Cell 3-A</td>
											<td>Cell 3-B</td>
											<td>Cell 3-C</td>
										</tr>
									</table>
								`
							},
							{
								name: 'one-row-no-thead-attr',
								template: html`
									<table class="d2l-table">
										<tr header class="top">
											<th>Header A</th>
											<th>Header B</th>
											<th>Header C</th>
										</tr>
										<tr>
											<td>Cell 1-A</td>
											<td>Cell 1-B</td>
											<td>Cell 1-C</td>
										</tr>
										<tr class="down">
											<td>Cell 2-A</td>
											<td><d2l-input-text label="label" label-hidden value="Cell 2-B" input-width="100px"></d2l-input-text></td>
											<td>Cell 2-C</td>
										</tr>
										<tr>
											<td>Cell 3-A</td>
											<td>Cell 3-B</td>
											<td>Cell 3-C</td>
										</tr>
									</table>
								`
							},
							{
								name: 'multi-row-thead',
								template: html`
									<table class="d2l-table">
										<thead>
											<tr>
												<th rowspan="2" class="top">Country</th>
												<th colspan="5">Fruit Production (tons)</th>
											</tr>
											<tr>
												<th>Apples</th>
												<th>Oranges</th>
												<th>Bananas</th>
												<th>Peaches</th>
												<th>Grapes</th>
											</tr>
										</thead>
										<tbody>
											<tr>
												<th class="down">Canada</th>
												<td>356,863</td>
												<td>0</td>
												<th>0</th>
												<td>23,239</td>
												<td>90,911</td>
											</tr>
											<tr>
												<th>Australia</th>
												<td>308,298</td>
												<td>398,610</td>
												<td><d2l-input-number label="label" label-hidden value="354241"></d2l-input-number></td>
												<td>80,807</td>
												<td>1,772,911</td>
											</tr>
											<tr>
												<th>Mexico</th>
												<td>716,931</td>
												<td>4,603,253</td>
												<td>2,384,778</td>
												<td>176,909</td>
												<td>351,310</td>
											</tr>
										</tbody>
									</table>
								`
							},
							{
								name: 'multi-row-no-thead-class',
								template: html`
									<table class="d2l-table">
										<tr class="d2l-table-header">
											<th rowspan="2" class="top">Country</th>
											<th colspan="5">Fruit Production (tons)</th>
										</tr>
										<tr class="d2l-table-header">
											<th>Apples</th>
											<th>Oranges</th>
											<th>Bananas</th>
											<th>Peaches</th>
											<th>Grapes</th>
										</tr>
										<tr>
											<th class="down">Canada</th>
											<td>356,863</td>
											<td>0</td>
											<th>0</th>
											<td>23,239</td>
											<td>90,911</td>
										</tr>
										<tr>
											<th>Australia</th>
											<td>308,298</td>
											<td>398,610</td>
											<td><d2l-input-number label="label" label-hidden value="354241"></d2l-input-number></td>
											<td>80,807</td>
											<td>1,772,911</td>
										</tr>
										<tr>
											<th>Mexico</th>
											<td>716,931</td>
											<td>4,603,253</td>
											<td>2,384,778</td>
											<td>176,909</td>
											<td>351,310</td>
										</tr>
									</table>
								`
							},
							{
								name: 'multi-row-no-thead-attr',
								template: html`
									<table class="d2l-table">
										<tr header>
											<th rowspan="2" class="top">Country</th>
											<th colspan="5">Fruit Production (tons)</th>
										</tr>
										<tr header>
											<th>Apples</th>
											<th>Oranges</th>
											<th>Bananas</th>
											<th>Peaches</th>
											<th>Grapes</th>
										</tr>
										<tr>
											<th class="down">Canada</th>
											<td>356,863</td>
											<td>0</td>
											<th>0</th>
											<td>23,239</td>
											<td>90,911</td>
										</tr>
										<tr>
											<th>Australia</th>
											<td>308,298</td>
											<td>398,610</td>
											<td><d2l-input-number label="label" label-hidden value="354241"></d2l-input-number></td>
											<td>80,807</td>
											<td>1,772,911</td>
										</tr>
										<tr>
											<th>Mexico</th>
											<td>716,931</td>
											<td>4,603,253</td>
											<td>2,384,778</td>
											<td>176,909</td>
											<td>351,310</td>
										</tr>
									</table>
								`
							},
							{
								name: 'selected-one-row',
								template: html`
									<table class="d2l-table">
										<tr header>
											<th rowspan="2" style="width: 1%" class="top"><input type="checkbox"></th>
											<th rowspan="2">Country</th>
											<th colspan="5">Fruit Production (tons)</th>
										</tr>
										<tr header>
											<th>Apples</th>
											<th>Oranges</th>
											<th>Bananas</th>
											<th>Peaches</th>
											<th>Grapes</th>
										</tr>
										<tr>
											<td class="down"><input type="checkbox"></td>
											<th>Canada</th>
											<td>356,863</td>
											<td>0</td>
											<th>0</th>
											<td>23,239</td>
											<td>90,911</td>
										</tr>
										<tr selected>
											<td><input type="checkbox" checked></td>
											<th>Australia</th>
											<td>308,298</td>
											<td>398,610</td>
											<td><d2l-input-number label="label" label-hidden value="354241"></d2l-input-number></td>
											<td>80,807</td>
											<td>1,772,911</td>
										</tr>
										<tr>
											<td><input type="checkbox"></td>
											<th>Mexico</th>
											<td>716,931</td>
											<td>4,603,253</td>
											<td>2,384,778</td>
											<td>176,909</td>
											<td>351,310</td>
										</tr>
									</table>
								`
							},
							{
								name: 'selected-top-bottom',
								template: html`
									<table class="d2l-table">
										<tr header>
											<th rowspan="2" style="width: 1%" class="top"><input type="checkbox"></th>
											<th rowspan="2">Country</th>
											<th colspan="5">Fruit Production (tons)</th>
										</tr>
										<tr header>
											<th>Apples</th>
											<th>Oranges</th>
											<th>Bananas</th>
											<th>Peaches</th>
											<th>Grapes</th>
										</tr>
										<tr selected>
											<td class="down"><input type="checkbox" checked></td>
											<th>Canada</th>
											<td>356,863</td>
											<td>0</td>
											<th>0</th>
											<td>23,239</td>
											<td>90,911</td>
										</tr>
										<tr>
											<td><input type="checkbox"></td>
											<th>Australia</th>
											<td>308,298</td>
											<td>398,610</td>
											<td><d2l-input-number label="label" label-hidden value="354241"></d2l-input-number></td>
											<td>80,807</td>
											<td>1,772,911</td>
										</tr>
										<tr selected>
											<td><input type="checkbox" checked></td>
											<th>Mexico</th>
											<td>716,931</td>
											<td>4,603,253</td>
											<td>2,384,778</td>
											<td>176,909</td>
											<td>351,310</td>
										</tr>
									</table>
								`
							},
							{
								name: 'selected-all',
								template: html`
									<table class="d2l-table">
										<tr header>
											<th rowspan="2" style="width: 1%" class="top"><input type="checkbox"></th>
											<th rowspan="2">Country</th>
											<th colspan="5">Fruit Production (tons)</th>
										</tr>
										<tr header>
											<th>Apples</th>
											<th>Oranges</th>
											<th>Bananas</th>
											<th>Peaches</th>
											<th>Grapes</th>
										</tr>
										<tr selected>
											<td class="down"><input type="checkbox" checked></td>
											<th>Canada</th>
											<td>356,863</td>
											<td>0</td>
											<th>0</th>
											<td>23,239</td>
											<td>90,911</td>
										</tr>
										<tr selected>
											<td><input type="checkbox" checked></td>
											<th>Australia</th>
											<td>308,298</td>
											<td>398,610</td>
											<td><d2l-input-number label="label" label-hidden value="354241"></d2l-input-number></td>
											<td>80,807</td>
											<td>1,772,911</td>
										</tr>
										<tr selected>
											<td><input type="checkbox" checked></td>
											<th>Mexico</th>
											<td>716,931</td>
											<td>4,603,253</td>
											<td>2,384,778</td>
											<td>176,909</td>
											<td>351,310</td>
										</tr>
									</table>
								`
							}
						].forEach(({ name, template }) => {
							['top', 'down'].forEach((position) => {
								it(`${name}-${position}`, async() => {
									const elem = await createFixture(
										template,
										{ bottomMargin: true, stickyHeaders: true, viewport: { height: 300, width: 500 } }
									);
									elem.shadowRoot.querySelector(`.${position}`).scrollIntoView();
									await expect(elem).to.be.golden();
								});
							});
						});

						[
							{
								name: 'fixed-column-class',
								template: html`
									<table class="d2l-table">
										<thead>
											<tr>
												<th rowspan="2" style="width: 1%" class="top"><input type="checkbox"></th>
												<th rowspan="2" class="d2l-table-sticky-cell">Country</th>
												<th colspan="5">Fruit Production (tons)</th>
											</tr>
											<tr>
												<th>Apples</th>
												<th>Oranges</th>
												<th>Bananas</th>
												<th>Peaches</th>
												<th>Grapes</th>
											</tr>
										</thead>
										<tbody>
											<tr>
												<td class="down"><input type="checkbox"></td>
												<th class="d2l-table-sticky-cell">Canada</th>
												<td>356,863</td>
												<td>0</td>
												<th>0</th>
												<td>23,239</td>
												<td class="over">90,911</td>
											</tr>
											<tr selected>
												<td><input type="checkbox" checked></td>
												<th class="d2l-table-sticky-cell">Australia</th>
												<td><d2l-input-number label="label" label-hidden value="308298"></d2l-input-number></td>
												<td>398,610</td>
												<td>354,241</td>
												<td>80,807</td>
												<td>1,772,911</td>
											</tr>
											<tr>
												<td><input type="checkbox"></td>
												<th class="d2l-table-sticky-cell">Mexico</th>
												<td>716,931</td>
												<td>4,603,253</td>
												<td>2,384,778</td>
												<td>176,909</td>
												<td>351,310</td>
											</tr>
										</tbody>
									</table>
								`
							},
							{
								name: 'fixed-column-attr',
								template: html`
									<table class="d2l-table">
										<thead>
											<tr>
												<th rowspan="2" style="width: 1%" class="top"><input type="checkbox"></th>
												<th rowspan="2" sticky>Country</th>
												<th colspan="5">Fruit Production (tons)</th>
											</tr>
											<tr>
												<th>Apples</th>
												<th>Oranges</th>
												<th>Bananas</th>
												<th>Peaches</th>
												<th>Grapes</th>
											</tr>
										</thead>
										<tbody>
											<tr>
												<td class="down"><input type="checkbox"></td>
												<th sticky>Canada</th>
												<td>356,863</td>
												<td>0</td>
												<th>0</th>
												<td>23,239</td>
												<td class="over">90,911</td>
											</tr>
											<tr selected>
												<td><input type="checkbox" checked></td>
												<th sticky>Australia</th>
												<td><d2l-input-number label="label" label-hidden value="308298"></d2l-input-number></td>
												<td>398,610</td>
												<td>354,241</td>
												<td>80,807</td>
												<td>1,772,911</td>
											</tr>
											<tr>
												<td><input type="checkbox"></td>
												<th sticky>Mexico</th>
												<td>716,931</td>
												<td>4,603,253</td>
												<td>2,384,778</td>
												<td>176,909</td>
												<td>351,310</td>
											</tr>
										</tbody>
									</table>
								`
							}
						].forEach(({ name, template }) => {
							['top', 'down', 'over'].forEach((position) => {
								it(`${name}-${position}`, async() => {
									const elem = await createFixture(
										template,
										{ bottomMargin: true, stickyHeaders: true, viewport: { height: 300, width: 500 } }
									);
									elem.shadowRoot.querySelector(`.${position}`).scrollIntoView();
									await expect(elem).to.be.golden();
								});
							});
						});

						it('one-column', async() => {
							const elem = await createFixture(html`
								<table class="d2l-table">
									<thead>
										<tr class="top">
											<th>Header A</th>
										</tr>
									</thead>
									<tbody>
										<tr class="down over">
											<td>Cell 1-A</td>
										</tr>
									</tbody>
								</table>
							`, { stickyHeaders: true });
							await expect(elem).to.be.golden();
						});

						[
							{
								name: 'grades-row-header',
								template: html`
									<table class="d2l-table">
										<thead>
											<tr>
												<th rowspan="2" class="top" sticky>Name</th>
												<th colspan="5" style="z-index: 3">
													Category
													<span style="position: relative;">
														&nbsp;&#8964;
														<div style="background-color: blue; color: white; position: absolute; top: 20px; left: 0px; padding: 10px; width: 145px; height: 175px;">Dropdown simulator</div>
													</span>
												</th>
											</tr>
											<tr>
												<th style="white-space: nowrap">Item 1</th>
												<th style="white-space: nowrap">Item 2</th>
												<th style="white-space: nowrap">Item 3</th>
												<th style="white-space: nowrap">Item 4</th>
												<th style="white-space: nowrap">Item 5</th>
											</tr>
										</thead>
										<tbody>
											<tr>
												<th sticky style="white-space: nowrap">Albert, Eddie</th>
												<td>5/10</td>
												<td>9/10</td>
												<td>3/5</td>
												<td>9/10</td>
												<td class="over">9/10</td>
											</tr>
											<tr>
												<th sticky style="white-space: nowrap">Bedelia, Bonnie</th>
												<td>3/10</td>
												<td>7/10</td>
												<td>5/5</td>
												<td>7/10</td>
												<td>7/10</td>
											</tr>
											<tr>
												<th sticky style="white-space: nowrap">Benson, Robbie</th>
												<td>8/10</td>
												<td>6/10</td>
												<td>1/5</td>
												<td>6/10</td>
												<td>6/10</td>
											</tr>
										</tbody>
									</table>
								`
							},
							{
								name: 'grades-column-header',
								template: html`
									<table class="d2l-table">
										<thead>
											<tr>
												<th rowspan="2" class="top" sticky>Name</th>
												<th colspan="5">Category</th>
											</tr>
											<tr>
												<th style="white-space: nowrap">Item 1</th>
												<th style="white-space: nowrap">Item 2</th>
												<th style="white-space: nowrap">Item 3</th>
												<th style="white-space: nowrap">Item 4</th>
												<th style="white-space: nowrap">Item 5</th>
											</tr>
										</thead>
										<tbody>
											<tr>
												<th sticky style="white-space: nowrap; z-index: 2">
													Albert, Eddie
													<span style="position: relative;">
														&nbsp;&#8964;
														<div style="background-color: blue; color: white; position: absolute; top: 20px; left: 0px; padding: 10px; width: 145px; height: 175px;">Dropdown simulator</div>
													</span>
												</th>
												<td>5/10</td>
												<td>9/10</td>
												<td>3/5</td>
												<td>9/10</td>
												<td class="over">9/10</td>
											</tr>
											<tr>
												<th sticky style="white-space: nowrap">Bedelia, Bonnie</th>
												<td>3/10</td>
												<td>7/10</td>
												<td>5/5</td>
												<td>7/10</td>
												<td>7/10</td>
											</tr>
											<tr>
												<th sticky style="white-space: nowrap">Benson, Robbie</th>
												<td>8/10</td>
												<td>6/10</td>
												<td>1/5</td>
												<td>6/10</td>
												<td>6/10</td>
											</tr>
										</tbody>
									</table>
								`
							}
						].forEach(({ name, template }) => {
							['top', 'over'].forEach(position => {
								it(`${name}-${position}`, async() => {
									const elem = await createFixture(template, { bottomMargin: true, stickyHeaders: true });
									elem.shadowRoot.querySelector(`.${position}`).scrollIntoView(true);
									await expect(elem).to.be.golden({ margin: 0 });
								});
							});
						});

					});

					describe('table-controls', () => {

						[
							{ name: 'no-sticky', stickyControls: false, stickyHeaders: false, visibleBackground: false },
							{ name: 'sticky-controls', stickyControls: true, stickyHeaders: false, visibleBackground: false },
							{ name: 'all-sticky', stickyControls: true, stickyHeaders: true, visibleBackground: false },
							{ name: 'visible-background', stickyControls: true, stickyHeaders: true, visibleBackground: true },
						].forEach(condition1 => {
							describe(condition1.name, () => {

								[
									{ name: '1-top', scroll: 0 },
									{ name: '2-scrolled', scroll: 1000 },
								].forEach(condition2 => {
									it(condition2.name, async() => {
										const elem = await fixture(
											html`
												<div style="height: 300px;overflow-y: scroll;">
													<d2l-test-table
														condensed
														?sticky-controls="${condition1.stickyControls}"
														?sticky-headers="${condition1.stickyHeaders}"
														type="${type}"
														?visible-background="${condition1.visibleBackground}">
													</d2l-test-table>
												</div>
											`,
											{ rtl: dir === 'rtl', viewport: { width: 500 } }
										);
										elem.scrollTo(0, condition2.scroll);
										await nextFrame();
										await expect(elem).to.be.golden();
									});
								});

							});
						});

					});

					describe('paging', () => {

						it('table-with-paging', async() => {
							const elem = await fixture(
								html`<d2l-test-table condensed type="${type}" paging></d2l-test-table>`,
								{ rtl: dir === 'rtl', viewport: { width: 500 } }
							);
							await expect(elem).to.be.golden();
						});

					});

				});
			});
		});
	});

});
