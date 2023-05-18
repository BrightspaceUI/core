import '../../../components/inputs/input-number.js';
import '../../../components/inputs/input-text.js';
import { css, html, LitElement } from 'lit';
import { tableStyles } from '../table-wrapper.js';

const url = new URL(window.location.href);
const type = url.searchParams.get('type') === 'light' ? 'light' : 'default';

class TestTableStickyVisualDiff extends LitElement {

	static get styles() {
		return [tableStyles, css`
			.d2l-visual-diff {
				margin-bottom: 300px;
				max-width: 600px;
			}
		`];
	}

	render() {
		return html`
			<div class="d2l-visual-diff">
				<d2l-table-wrapper type="${type}" sticky-headers id="one-row-thead">
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
								<td class="over">Cell 2-C</td>
							</tr>
							<tr>
								<td>Cell 3-A</td>
								<td>Cell 3-B</td>
								<td>Cell 3-C</td>
							</tr>
						</tbody>
					</table>
				</d2l-table-wrapper>
			</div>
			<div class="d2l-visual-diff">
				<d2l-table-wrapper type="${type}" sticky-headers id="one-row-no-thead-class">
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
							<td class="over">Cell 2-C</td>
						</tr>
						<tr>
							<td>Cell 3-A</td>
							<td>Cell 3-B</td>
							<td>Cell 3-C</td>
						</tr>
					</table>
				</d2l-table-wrapper>
			</div>
			<div class="d2l-visual-diff">
				<d2l-table-wrapper type="${type}" sticky-headers id="one-row-no-thead-attr">
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
							<td class="over">Cell 2-C</td>
						</tr>
						<tr>
							<td>Cell 3-A</td>
							<td>Cell 3-B</td>
							<td>Cell 3-C</td>
						</tr>
					</table>
				</d2l-table-wrapper>
			</div>
			<div class="d2l-visual-diff">
				<d2l-table-wrapper type="${type}" sticky-headers id="multi-row-thead">
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
								<td class="over">90,911</td>
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
				</d2l-table-wrapper>
			</div>
			<div class="d2l-visual-diff">
				<d2l-table-wrapper type="${type}" sticky-headers id="multi-row-no-thead-class">
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
							<td class="over">90,911</td>
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
				</d2l-table-wrapper>
			</div>
			<div class="d2l-visual-diff">
				<d2l-table-wrapper type="${type}" sticky-headers id="multi-row-no-thead-attr">
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
							<td class="over">90,911</td>
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
				</d2l-table-wrapper>
			</div>
			<div class="d2l-visual-diff">
				<d2l-table-wrapper type="${type}" sticky-headers id="selected-one-row">
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
							<td class="over">90,911</td>
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
				</d2l-table-wrapper>
			</div>
			<div class="d2l-visual-diff">
				<d2l-table-wrapper type="${type}" sticky-headers id="selected-top-bottom">
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
							<td class="over">90,911</td>
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
				</d2l-table-wrapper>
			</div>
			<div class="d2l-visual-diff">
				<d2l-table-wrapper type="${type}" sticky-headers id="selected-all">
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
							<td class="over">90,911</td>
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
				</d2l-table-wrapper>
			</div>
			<div class="d2l-visual-diff">
				<d2l-table-wrapper type="${type}" sticky-headers id="fixed-column-class">
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
				</d2l-table-wrapper>
			</div>
			<div class="d2l-visual-diff">
				<d2l-table-wrapper type="${type}" sticky-headers id="fixed-column-attr">
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
				</d2l-table-wrapper>
			</div>
			<div class="d2l-visual-diff">
				<d2l-table-wrapper type="${type}" sticky-headers id="one-column">
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
				</d2l-table-wrapper>
			</div>
			<div class="d2l-visual-diff">
				<d2l-table-wrapper type="${type}" sticky-headers id="grades-row-header">
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
				</d2l-table-wrapper>
			</div>
			<div class="d2l-visual-diff">
				<d2l-table-wrapper type="${type}" sticky-headers id="grades-column-header">
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
				</d2l-table-wrapper>
			</div>
		`;
	}

}
customElements.define('d2l-test-table-sticky-visual-diff', TestTableStickyVisualDiff);
