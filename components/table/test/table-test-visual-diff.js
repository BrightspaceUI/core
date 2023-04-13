import '../table-col-sort-button.js';
import '../demo/table-test.js';
import { css, html, LitElement } from 'lit';
import { tableStyles } from '../table-wrapper.js';

const url = new URL(window.location.href);
const type = url.searchParams.get('type') === 'light' ? 'light' : 'default';

class TestTableVisualDiff extends LitElement {

	static get styles() {
		return [tableStyles, css`
			.d2l-visual-diff {
				margin-bottom: 300px;
			}
		`];
	}

	render() {
		return html`
			<div class="d2l-visual-diff">
				<d2l-table-wrapper type="${type}" id="standard-thead">
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
				</d2l-table-wrapper>
			</div>

			<div class="d2l-visual-diff">
				<d2l-table-wrapper type="${type}" id="standard-no-thead-class">
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
				</d2l-table-wrapper>
			</div>

			<div class="d2l-visual-diff">
				<d2l-table-wrapper type="${type}" id="standard-no-thead-attr">
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
				</d2l-table-wrapper>
			</div>

			<div class="d2l-visual-diff">
				<d2l-table-wrapper type="${type}" id="vertical-align">
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
				</d2l-table-wrapper>
			</div>

			<div class="d2l-visual-diff">
				<d2l-table-wrapper type="${type}" id="empty">
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
				</d2l-table-wrapper>
			</div>

			<div class="d2l-visual-diff">
				<d2l-table-wrapper type="${type}" id="one-column">
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
				</d2l-table-wrapper>
			</div>

			<div class="d2l-visual-diff">
				<d2l-table-wrapper type="${type}" id="one-cell">
					<table class="d2l-table">
						<tbody>
							<tr>
								<td>Cell 1-A</td>
							</tr>
						</tbody>
					</table>
				</d2l-table-wrapper>
			</div>

			<div class="d2l-visual-diff">
				<d2l-table-wrapper type="${type}" id="no-header-tbody">
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
				</d2l-table-wrapper>
			</div>

			<div class="d2l-visual-diff">
				<d2l-table-wrapper type="${type}" id="no-header-no-tbody">
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
				</d2l-table-wrapper>
			</div>

			<div class="d2l-visual-diff">
				<d2l-table-wrapper type="${type}" id="rowspan">
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
				</d2l-table-wrapper>
			</div>

			<div class="d2l-visual-diff">
				<d2l-table-wrapper type="${type}" id="footer">
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
				</d2l-table-wrapper>
			</div>

			<div class="d2l-visual-diff">
				<d2l-table-wrapper type="${type}" id="selected-one-row">
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
				</d2l-table-wrapper>
			</div>

			<div class="d2l-visual-diff">
				<d2l-table-wrapper type="${type}" id="selected-top-bottom">
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
				</d2l-table-wrapper>
			</div>

			<div class="d2l-visual-diff">
				<d2l-table-wrapper type="${type}" id="selected-all">
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
				</d2l-table-wrapper>
			</div>

			<div class="d2l-visual-diff">
				<d2l-table-wrapper type="${type}" no-column-border id="no-column-border">
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
				</d2l-table-wrapper>
			</div>

			<div class="d2l-visual-diff">
				<d2l-table-wrapper type="${type}" id="no-column-border-legacy">
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
				</d2l-table-wrapper>
			</div>

			<div class="d2l-visual-diff">
				<d2l-table-wrapper type="${type}" id="overflow">
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
				</d2l-table-wrapper>
			</div>
			<div class="d2l-visual-diff">
				<d2l-table-wrapper type="${type}" id="col-sort-button">
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
				</d2l-table-wrapper>
			</div>
			<div class="d2l-visual-diff">
				<div id="table-with-paging">
					<d2l-test-table condensed type="${type}" paging></d2l-test-table>
				</div>
			</div>
		`;
	}

}
customElements.define('d2l-test-table-visual-diff', TestTableVisualDiff);
