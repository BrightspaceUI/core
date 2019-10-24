import { css, html, LitElement } from 'lit-element/lit-element.js';
import { bodySmallStyles } from '../../typography/styles.js';
import { listSelectionStates } from '../list.js';

class ListDemoControl extends LitElement {

	static get properties() {
		return {
			target: { type: String },
			_numberSelected: { type: Number }
		};
	}

	static get styles() {
		return [ bodySmallStyles, css`
			.d2l-list-demo-grid {
				background: white;
				border: 1px solid var(--d2l-color-tungsten);
				border-bottom: none;
				border-top-left-radius: 0.3rem;
				border-top-right-radius: 0.3rem;
				box-sizing: content-box;
				display: grid;
				grid-template-columns: repeat(4, auto);
				margin: 0 !important;
				margin-left: 0.3rem !important;
				max-width: 44.7rem;
				width: fit-content;
			}
			.d2l-list-demo-grid > *:nth-child(4n) {
				border-right: none;
			}
			.d2l-list-demo-grid > *:nth-child(-n+4) {
				border-top: none;
			}
			.d2l-list-demo-grid > * {
				border-right: 1px dotted var(--d2l-color-tungsten);
				border-top: 1px dotted var(--d2l-color-tungsten);
				padding: 0.3rem 0.9rem;
			}
		`];
	}

	constructor() {
		super();
		this._onListChange = this._onListChange.bind(this);
	}

	connectedCallback() {
		super.connectedCallback();
		const list = document.querySelector(`${this.target} d2l-list`);
		list.addEventListener('d2l-list-selection-change', this._onListChange);
	}

	disconnectedCallback() {
		const list = document.querySelector(`${this.target} d2l-list`);
		list.removeEventListener('d2l-list-selection-change', this._onListChange);
		super.disconnectedCallback();
	}

	render() {
		return html`
			<div class="d2l-body-small d2l-list-demo-grid">
				<label>
					separators:
					<select @change="${this._onChangeSeparators}">
						<option value="" selected>default (all)</option>
						<option value="none">none</option>
						<option value="between">between</option>
						<option value="all">all</option>
					</select>
				</label>
				<label>extend-separators: <input type="checkbox" @change="${this._onChangeExtendSeparators}"></label>
				<label>
					breakpoints:
					<select @change="${this._onChangeBreakpoints}">
						<option value="1200">3</option>
						<option value="800" selected>2</option>
						<option value="600">1</option>
						<option value="400">0</option>
						</select>
				</label>
				<label>illustration-outside: <input type="checkbox" @change="${this._onChangeIllustrationOutside}"></label>
				<label>selectable: <input type="checkbox" @change="${this._onChangeSelectable}"></label>
				<label>Add Action: <input type="checkbox" @change="${this._onChangeAddAction}"></label>
				<label>Select All: <input type="checkbox" class="select-all" @change="${this._onChangeSelectAll}"> ${this._numberSelected}</label>
			</div>
		`;
	}

	_onChangeAddAction(event) {
		const listItems = document.querySelectorAll(`${this.target} d2l-list d2l-list-item`);
		listItems.forEach(item => {
			event.target.checked
				? item.setAttribute('href', this.target)
				: item.removeAttribute('href');
		});
	}

	_onChangeBreakpoints(event) {
		const demoSnippet = document.querySelector(this.target);
		const list = document.querySelector(`${this.target} d2l-list`);
		const fixedMaxWidth = 900;
		if (event.target.value > fixedMaxWidth) {
			demoSnippet.style.maxWidth = `${event.target.value}px`;
		} else {
			demoSnippet.style.maxWidth = `${fixedMaxWidth}px`;
		}
		list.style.maxWidth = `${event.target.value}px`;
	}

	_onChangeExtendSeparators(event) {
		const list = document.querySelector(`${this.target} d2l-list`);
		list.toggleAttribute('extend-separators', event.target.checked);
	}

	_onChangeSelectAll() {
		const list = document.querySelector(`${this.target} d2l-list`);
		list.toggleSelectAll();
		this._updateSelectAll(list);
	}

	_onChangeSelectable(event) {
		const listItems = document.querySelectorAll(`${this.target} d2l-list d2l-list-item`);
		listItems.forEach(item => {
			item.toggleAttribute('selectable', event.target.checked);
		});
	}

	_onChangeSeparators(event) {
		const list = document.querySelector(`${this.target} d2l-list`);
		list.setAttribute('separators', event.target.value);
	}

	_onChangeIllustrationOutside(event) {
		const listItems = document.querySelectorAll(`${this.target} d2l-list d2l-list-item`);
		listItems.forEach(item => {
			item.toggleAttribute('illustration-outside', event.target.checked);
		});
	}

	_onListChange(event) {
		this._updateSelectAll(event.target);
	}

	_updateSelectAll(list) {
		const selectAll = this.shadowRoot.querySelector('.select-all');
		const selectionInfo = list.getSelectionInfo();
		this._numberSelected = selectionInfo.keys.length;
		selectAll.some = selectionInfo.state === listSelectionStates.some;
		selectAll.checked = selectionInfo.state === listSelectionStates.all;

		// This line allows you to see how and when the events fire. So check your console log.
		console.log('selectionInfo', selectionInfo); // eslint-disable-line
	}

}

customElements.define('d2l-list-demo-control', ListDemoControl);
