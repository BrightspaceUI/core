import '../../selection/selection-action.js';
import '../../selection/selection-input.js';
import '../../selection/selection-select-all.js';
import '../table-header.js';
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
				<d2l-table-wrapper type="${type}" id="no-sticky">
					<d2l-table-header slot="header" no-sticky>
						<d2l-selection-action icon="tier1:delete" text="Delete" requires-selection></d2l-selection-action>
						<d2l-selection-action icon="tier1:gear" text="Settings"></d2l-selection-action>
					</d2l-table-header>
					<table class="d2l-table">
						<thead>
							<tr>
								<th><d2l-selection-select-all></d2l-selection-select-all></th>
								<th>Column B</th>
							</tr>
						</thead>
						<tbody>
							<tr selected>
								<td><d2l-selection-input selected label="a" key="a"></d2l-selection-input></td>
								<td>this row is selected</td>
							</tr>
							<tr>
								<td><d2l-selection-input label="b" key="b"></d2l-selection-input></td>
								<td>this row is not selected</td>
							</tr>
						</tbody>
					</table>
				</d2l-table-wrapper>
			</div>
		`;
	}

}
customElements.define('d2l-test-table-header-visual-diff', TestTableVisualDiff);
