import '../list-item-content.js';
import '../list-item.js';
import '../list.js';
import { css, html, LitElement, nothing } from 'lit';
import { tableStyles } from '../../table/table-wrapper.js';

const styles = css`
	:host {
		display: block;
	}
	d2l-list:not([slot="nested"]) {
		border: solid 1px black;
		margin: 1rem;
		padding: 1rem;
	}
	.minimize-width {
		width: 1.5rem;
	}
`;

class ListNestedIterationsHelper extends LitElement {
	static get properties() {
		return {
			draggable: { type: Boolean }
		};
	}

	static get styles() {
		return [tableStyles, styles];
	}

	constructor() {
		super();
		this.draggable = false;
	}

	render() {
		const selectableOptions = [
			{ name: 'All are Selectable', parent: true, child: true },
			{ name: 'None are Selectable', parent: false, child: false },
			{ name: 'Children Selectable (Parent Not)', parent: false, child: true },
			{ name: 'Parent Selectable (Children Not)', parent: true, child: false }
		];

		const tableRows = selectableOptions.map(option => html`
			<tr class="d2l-table-header">
				<th rowspan="2" scope="rowgroup">${option.name}</th>
				<th scope="row">Exp/Collapsible Children</th>
				<td>${this._createList([option.parent, true], [option.child, true])}</td>
				<td>${this._createList([option.parent, false], [option.child, true])}</td>
			</tr>
			<tr class="d2l-table-header">
				<th scope="row">Non-Exp/Collapsible Children</th>
				<td>${this._createList([option.parent, true], [option.child, false])}</td>
				<td>${this._createList([option.parent, false], [option.child, false])}</td>
			</tr>
		`);

		return html`
			<d2l-table-wrapper>
				<table class="d2l-table">
					<thead>
						<tr>
							<th class="minimize-width"></th>
							<th class="minimize-width"></th>
							<th scope="col">Exp/Collapsible Parent</th>
							<th scope="col">Non-Exp/Collapsible Parent</th>
						</tr>
					</thead>
					<tbody>
						${tableRows}
					</tbody>
				</table>
			</d2l-table-wrapper>
		`;
	}

	_createList(parentOptions, childrenOptions) {
		return html`
			<d2l-list>
				${this._getParentItems(parentOptions, this._getChildItems(childrenOptions))}
			</d2l-list>
		`;
	}

	_getChildItems(childOptions) {
		const childText = 'L2 List Item';
		const items = [];

		for (let i = 0; i < 3; i++) {
			const childKey = `child-${i}-${childOptions[0]}-${childOptions[1]}`;
			items.push(html`
				<d2l-list-item key="${childKey}" label="${childText}" ?selectable="${!!childOptions[0]}" ?draggable="${this.draggable}" ?expandable="${childOptions[1] && i !== 1}">
					<d2l-list-item-content>${childText}</d2l-list-item-content>
				</d2l-list-item>
			`);
		}
		return items;
	}

	_getParentItems(parentOptions, nested) {
		const parentText = 'L1 List Item';
		const items = [];

		for (let i = 0; i < 3; i++) {
			const parentKey = `parent-${i}-${parentOptions[0]}-${parentOptions[1]}`;
			items.push(html`
				<d2l-list-item key="${parentKey}" label="${parentText}" ?selectable="${!!parentOptions[0]}" ?draggable="${this.draggable}" ?expandable="${parentOptions[1] && i !== 1}" ?expanded="${parentOptions[1] && i === 0}">
					<d2l-list-item-content>${parentText}</d2l-list-item-content>
					${i !== 0 ? nothing : html`
						<d2l-list slot="nested">${nested}</d2l-list>
					`}
				</d2l-list-item>
			`);
		}
		return items;
	}
}

customElements.define('d2l-demo-list-nested-iterations-helper', ListNestedIterationsHelper);
