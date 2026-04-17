import { css, html, LitElement } from 'lit';
import { tableStyles } from '../../table/table-wrapper.js';

class TableView extends LitElement {
	static get styles() {
		return [tableStyles, css`
			:host([hidden]) {
				display: none;
			}
		`];
	}

	render() {
		return html`
			<d2l-table-wrapper>
				<table class="d2l-table">
					<thead>
					<tr>
						<th>Name</th>
						<th>Section</th>
						<th>Info</th>
					</tr>
					</thead>
					<tbody>
						<tr>
							<th>Jane Doe</th>
							<td>Section 1</td>
							<td>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc viverra felis sit amet magna eleifend lacinia. Duis faucibus commodo tellus.</td>
						</tr>
						<tr>
							<th>John Smith</th>
							<td>Section 2</td>
							<td>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc viverra felis sit amet magna eleifend lacinia. Duis faucibus commodo tellus.</td>
						</tr>
					</tbody>
				</table>
			</d2l-table-wrapper>
		`;
	}
}
customElements.define('d2l-demo-table-view', TableView);
