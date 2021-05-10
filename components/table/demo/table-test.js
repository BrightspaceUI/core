import { html, LitElement } from 'lit-element/lit-element.js';
import { RtlMixin } from '../../../mixins/rtl-mixin.js';
import { tableStyles } from '../table-wrapper.js';

class TestTable extends RtlMixin(LitElement) {

	static get properties() {
		return {
			type: { type: String },
			stickyHeaders: { attribute: 'sticky-headers', type: Boolean }
		};
	}

	static get styles() {
		return tableStyles;
	}

	constructor() {
		super();
		this.stickyHeaders = false;
		this.type = 'default';
	}

	render() {
		const type = this.type === 'light' ? 'light' : 'default';
		return html`
			<d2l-table-wrapper ?sticky-headers="${this.stickyHeaders}" type="${type}">
				<table class="d2l-table">
					<thead>
						<tr>
							<th>Column A</th>
							<th>Column B</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>Row 1-A</td>
							<td>Row 1-B</td>
						</tr>
						<tr>
							<td>Row 2-A</td>
							<td>Row 2-B</td>
						</tr>
						<tr>
							<td>Row 3-A</td>
							<td>Row 3-B</td>
						</tr>
					</tbody>
					<tfoot>
						<tr>
							<td>Footer A</td>
							<td>Footer B</td>
						</tr>
					</tfoot>
				</table>
			</d2l-table-wrapper>
		`;
	}

}
customElements.define('d2l-test-table', TestTable);
