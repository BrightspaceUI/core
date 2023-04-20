import '../demo/table-test.js';
import { css, html, LitElement } from 'lit';
import { tableStyles } from '../table-wrapper.js';

const url = new URL(window.location.href);
const type = url.searchParams.get('type') === 'light' ? 'light' : 'default';

class TestTablePagingVisualDiff extends LitElement {

	static get styles() {
		return [tableStyles, css`
			.d2l-visual-diff {
				margin-bottom: 300px;
			}
			#table-controls {
				height: 300px;
				overflow-y: scroll;
			}
		`];
	}

	render() {
		return html`
			<div class="d2l-visual-diff">
				<div id="table-with-paging">
					<d2l-test-table condensed type="${type}" paging></d2l-test-table>
				</div>
			</div>
		`;
	}

}
customElements.define('d2l-test-table-paging-visual-diff', TestTablePagingVisualDiff);
