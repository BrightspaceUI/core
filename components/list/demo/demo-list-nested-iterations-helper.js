import '../../colors/colors.js';
import '../list-item-content.js';
import '../list-item.js';
import '../list.js';
import { css, html, LitElement, nothing } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';

class ListNestedIterationsHelper extends LitElement {
	static get properties() {
		return {
			isDraggable: { attribute: 'is-draggable', type: Boolean },
			separators: { type: String }
		};
	}

	static get styles() {
		return css`
			:host {
				display: block;
			}
			table {
				border-collapse: collapse;
				font-size: 0.8rem;
				table-layout: fixed;
				width: 100%;
			}
			table > * > tr > * {
				border: 1px solid var(--d2l-color-mica);
				font-weight: 400;
				height: 41px;
				padding: 0.5rem 1rem;
				text-align: start;
				vertical-align: middle;
			}
			table > * > tr > td {
				vertical-align: top;
			}
			table > thead > tr > th,
			table > * > tr.header > th {
				background-color: var(--d2l-color-regolith);
				font-size: 0.7rem;
				height: 27px;
				line-height: 0.9rem;
			}

			d2l-list:not([slot="nested"]) {
				border: solid 1px black;
				margin: 1rem;
				padding: 1rem;
			}
			.minimize-width {
				width: 4.5rem;
			}
		`;
	}

	constructor() {
		super();
		this.isDraggable = false;
	}

	render() {
		const selectableOptions = [
			{ name: 'All are Selectable', parent: true, child: true },
			{ name: 'None are Selectable', parent: false, child: false },
			{ name: 'Children Selectable (Parent Not)', parent: false, child: true },
			{ name: 'Parent Selectable (Children Not)', parent: true, child: false }
		];

		const tableRows = selectableOptions.map(option => html`
			<tr class="header">
				<th rowspan="4" scope="rowgroup">${option.name}</th>
				<th scope="row">Exp/Collapsible Children</th>
				<td>${this._createList([option.parent, true], [option.child, true])}</td>
				<td>${this._createList([option.parent, false], [option.child, true])}</td>
			</tr>
			<tr class="header">
				<th scope="row">Non-Exp/Collapsible Children</th>
				<td>${this._createList([option.parent, true], [option.child, false])}</td>
				<td>${this._createList([option.parent, false], [option.child, false])}</td>
			</tr>
			<tr class="header">
				<th scope="row">Color on Some</th>
				<td>${this._createList([option.parent, true, true], [option.child, true, true])}</td>
				<td>${this._createList([option.parent, false, true], [option.child, true, true])}</td>
			</tr>
			<tr class="header">
				<th scope="row">Color on All</th>
				<td>${this._createList([option.parent, true, false, true], [option.child, true, false, true])}</td>
				<td>${this._createList([option.parent, false, false, true], [option.child, true, false, true])}</td>
			</tr>
		`);

		return html`
			<table>
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
		`;
	}

	_createList(parentOptions, childrenOptions) {
		return html`
			<d2l-list separators=${ifDefined(this.separators)}>
				${this._getParentItems(parentOptions, this._getChildItems(childrenOptions))}
			</d2l-list>
		`;
	}

	/**
	 * childOptions:
	 * - 0: Selectable
	 * - 1: Expandable
	 * - 2: Color on first items
	 * - 3: Color on all items
	 */
	_getChildItems(childOptions) {
		const childL2Text = 'L2 List Item';
		const childL3Text = 'L3 List Item';
		const items = [];

		for (let i = 0; i < 3; i++) {
			const childKey = `child-${i}-${childOptions[0]}-${childOptions[1]}`;
			items.push(html`
				<d2l-list-item key="${childKey}" label="${childL2Text}" ?selectable="${!!childOptions[0]}" ?draggable="${this.isDraggable}" ?expandable="${childOptions[1] && i !== 1}" color="${ifDefined((childOptions[2] && i === 0) || childOptions[3] ? '#ff0000' : undefined)}">
					<d2l-list-item-content>${childL2Text}</d2l-list-item-content>
					${i === 1 || !childOptions[1] ? nothing : html`
						<d2l-list slot="nested" separators=${ifDefined(this.separators)}>
							<d2l-list-item key="${`${childKey}-child`}" label="${childL3Text}" ?selectable="${!!childOptions[0]}" ?draggable="${this.isDraggable}" color="${ifDefined(childOptions[3] ? '#00ff00' : undefined)}">
								<d2l-list-item-content>${childL3Text}</d2l-list-item-content>
							</d2l-list-item>
						</d2l-list>
					`}
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
				<d2l-list-item key="${parentKey}" label="${parentText}" ?selectable="${!!parentOptions[0]}" ?draggable="${this.isDraggable}" ?expandable="${parentOptions[1] && i !== 1}" ?expanded="${parentOptions[1] && i === 0}" color="${ifDefined((parentOptions[2] && i === 0) || parentOptions[3] ? '#ff0000' : undefined)}">
					<d2l-list-item-content>${parentText}</d2l-list-item-content>
					${i === 1 || (i === 2 && !parentOptions[1]) ? nothing : html`
						<d2l-list slot="nested" separators=${ifDefined(this.separators)}>${nested}</d2l-list>
					`}
				</d2l-list-item>
			`);
		}
		return items;
	}
}

customElements.define('d2l-demo-list-nested-iterations-helper', ListNestedIterationsHelper);
