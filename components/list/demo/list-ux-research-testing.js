import '../../button/button.js';
import '../../button/button-icon.js';
import '../../button/button-subtle.js';
import '../../button/button-toggle.js';
import '../../dialog/dialog.js';
import '../../filter/filter.js';
import '../../filter/filter-dimension-set.js';
import '../../filter/filter-dimension-set-date-text-value.js';
import '../../filter/filter-dimension-set-date-time-range-value.js';
import '../../filter/filter-dimension-set-value.js';
import '../../inputs/input-text.js';
import '../list-item-content.js';
import '../list-item.js';
import '../list.js';
import { css, html, LitElement } from 'lit';
import { getDateFromISODate } from '../../../helpers/dateTime.js';
import { heading1Styles } from '../../typography/styles.js';
import { repeat } from 'lit/directives/repeat.js';

const items = [{
	key: '1',
	primaryText: 'Blue Whale',
	dateAdded: '2023-10-03',
	pressed: false
}, {
	key: '2',
	primaryText: 'Cheetah',
	dateAdded: '2023-11-30',
	pressed: true
}, {
	key: '3',
	primaryText: 'Elephant',
	dateAdded: '2024-01-06',
	pressed: false
}, {
	key: '4',
	primaryText: 'Giraffe',
	dateAdded: '2024-01-07',
	pressed: false
}];

class DemoListUxResearch extends LitElement {

	static get properties() {
		return {
			_showFavorites: { state: true },
			_showNotFavorites: { state: true },
			_startValue: { state: true },
			_endValue: { state: true }
		};
	}

	static get styles() {
		return [heading1Styles, css`
			:host {
				display: block;
                margin: auto;
                max-width: 930px;
			}
			header,
			.list-header-container {
				align-items: center;
				display: flex;
			}

			.d2l-heading-1,
			.list-header-container span {
				flex-grow: 1;
				margin: 0;
			}

			header {
				margin-bottom: 2.5rem;
			}
			.list-header-container {
				margin-bottom: 1.5rem;
			}
		`];
	}

	constructor() {
		super();
		this._showFavorites = false;
		this._showNotFavorites = false;
		this._startValue = null;
		this._endValue = null;
	}

	render() {
		return html`
			<header>
				<h1 class="d2l-heading-1">My Animals</h1>
				<d2l-button-toggle>
					<d2l-button-subtle slot="not-pressed" icon="tier1:lock-unlock" text="Not Public" description="Click to make public."></d2l-button-subtle>
					<d2l-button-subtle slot="pressed" icon="tier1:lock-locked" text="Public" description="Click to make not public."></d2l-button-subtle>
				</d2l-button-toggle>
			</header>
			<div class="list-header-container">
				<span>
					<d2l-button @click="${this._showDialog}" primary>Add an Animal</d2l-button>
				</span>
				<d2l-filter id="filter-single" @d2l-filter-change="${this._handleFilterChange}">
					<d2l-filter-dimension-set key="favorites" text="Favourites" selection-single>
						<d2l-filter-dimension-set-value key="yes" text="Favourited"></d2l-filter-dimension-set-value>
						<d2l-filter-dimension-set-value key="no" text="Not Favourited"></d2l-filter-dimension-set-value>
					</d2l-filter-dimension-set>
					<d2l-filter-dimension-set key="dates" text="Date Added">
						<d2l-filter-dimension-set-date-text-value key="7days" range="7days"></d2l-filter-dimension-set-date-text-value>
						<d2l-filter-dimension-set-date-text-value key="30days" range="30days"></d2l-filter-dimension-set-date-text-value>
						<d2l-filter-dimension-set-date-time-range-value key="custom" type="date"></d2l-filter-dimension-set-date-time-range-value>
					</d2l-filter-dimension-set>
				</d2l-filter>
			</div>
			<d2l-dialog id="dialog" title-text="Add an Animal" @d2l-dialog-close="${this._resetDialog}">
				<d2l-input-text label="Name">
					<div slot="inline-help">
						Names should be unique
					</div>
				</d2l-input-text>
				<d2l-button slot="footer" primary data-dialog-action="done" @click="${this._addAnimal}">Add</d2l-button>
				<d2l-button slot="footer" data-dialog-action>Cancel</d2l-button>
			</d2l-dialog>
			<d2l-list>
				${repeat(items, item => item.key, item => {
		if ((this._showFavorites && !item.pressed) || (this._showNotFavorites && item.pressed)) return;
		if (this._startValue) {
			const dateAdded = getDateFromISODate(item.dateAdded);
			if (dateAdded.getTime() < getDateFromISODate(this._startValue).getTime()) return;
		}
		if (this._endValue) {
			const dateAdded = getDateFromISODate(item.dateAdded);
			if (dateAdded.getTime() > getDateFromISODate(this._endValue).getTime()) return;
		}

		return html`
			<d2l-list-item key="${item.key}" label="${item.primaryText}">
				<d2l-list-item-content>
					<div>${item.primaryText}</div>
					<div slot="supporting-info">Date added: ${item.dateAdded}</div>
				</d2l-list-item-content>
				<div slot="actions">
					<d2l-button-toggle @d2l-button-toggle-change="${this._handleToggle}" ?pressed="${item.pressed}">
						<d2l-button-icon slot="not-pressed" icon="tier1:subscribe-hollow" text="Not Favourited" description="Click to favourite."></d2l-button-icon>
						<d2l-button-icon slot="pressed" icon="tier1:subscribe-filled" text="Favourited" description="Click to unfavourite."></d2l-button-icon>
					</d2l-button-toggle>
				</div>
			</d2l-list-item>
		`;
	})}
			</d2l-list>
		`;
	}

	_addAnimal() {
		items.push({
			key: Math.random().toString(),
			primaryText: this.shadowRoot.querySelector('d2l-input-text').value,
			dateAdded: new Date().toISOString().substring(0, 10),
			pressed: false
		});
		this.requestUpdate();
	}

	_handleFilterChange(e) {
		const dimensions = e.detail.dimensions;
		if (!dimensions || dimensions.length === 0) return;

		if (e.detail.allCleared) {
			this._showFavorites = false;
			this._showNotFavorites = false;
			this._startValue = null;
			this._endValue = null;

			return;
		}

		dimensions.forEach((dimension) => {
			if (dimension.dimensionKey === 'favorites') {
				if (dimension.cleared) {
					this._showFavorites = false;
					this._showNotFavorites = false;
					return;
				}

				dimension.changes.forEach(change => {
					if (change.valueKey === 'yes') {
						this._showFavorites = change.selected;
					} else if (change.valueKey === 'no') {
						this._showNotFavorites = change.selected;
					}
				});
			} else if (dimension.dimensionKey === 'dates') {
				if (dimension.cleared) {
					this._startValue = null;
					this._endValue = null;
					return;
				}

				dimension.changes.forEach(change => {
					if (!change.selected) return;
					this._startValue = change.startValue;
					this._endValue = change.endValue;
				});
			}
		});
	}

	_handleToggle(e) {
		const item = items.find(item => item.key === e.target.parentElement.parentElement.key);
		item.pressed = e.target.pressed;
		this.requestUpdate();
	}

	_resetDialog() {
		this.shadowRoot.querySelector('d2l-input-text').value = '';
	}

	_showDialog() {
		const dialog = this.shadowRoot.querySelector('#dialog');
		dialog.opened = true;
	}

}
customElements.define('d2l-demo-list-ux-research-testing', DemoListUxResearch);
