import '../dialog-fullscreen.js';
import '../../button/button-subtle.js';
import '../../dropdown/dropdown.js';
import '../../dropdown/dropdown-menu.js';
import '../../filter/filter.js';
import '../../filter/filter-dimension-set.js';
import '../../filter/filter-dimension-set-value.js';
import '../../menu/menu.js';
import '../../menu/menu-item-radio.js';

import { html, LitElement } from 'lit';

class DialogWithBrokenFilter extends LitElement {

	static get properties() {
		return {
			_loaded: { state: true }
		};
	}

	constructor() {
		super();
		this._loaded = false;
	}

	render() {
		return html`
			<d2l-button-subtle
				text="Open Me"
				@click="${this._openDialog}">
			</d2l-button-subtle>
			<d2l-dialog-fullscreen title-text="Testing" id="dialog" @d2l-dialog-close="${this._closeDialog}">
				${this._renderContents()}
			</d2l-dialog-fullscreen>
		`;
	}

	_closeDialog() {
		this._loaded = false;
	}

	_openDialog() {
		this.shadowRoot.querySelector('#dialog').opened = true;
		setTimeout(() => this._loaded = true, 1000);
	}

	_renderContents() {
		return !this._loaded ? html`Loading...` : html`
			<d2l-filter>
				<d2l-filter-dimension-set key="course" text="I won't work until you open the other dropdown" selection-single>
					<d2l-filter-dimension-set-value key="art" text="Art"></d2l-filter-dimension-set-value>
					<d2l-filter-dimension-set-value key="astronomy" text="Astronomy"></d2l-filter-dimension-set-value>
					<d2l-filter-dimension-set-value key="biology" text="Biology"></d2l-filter-dimension-set-value>
					<d2l-filter-dimension-set-value key="chemistry" text="Chemistry"></d2l-filter-dimension-set-value>
					<d2l-filter-dimension-set-value key="drama" text="Drama"></d2l-filter-dimension-set-value>
					<d2l-filter-dimension-set-value key="english" text="English"></d2l-filter-dimension-set-value>
					<d2l-filter-dimension-set-value key="how-to" text="How To Write a How To Article With a Flashy Title"></d2l-filter-dimension-set-value>
					<d2l-filter-dimension-set-value key="math" text="Math"></d2l-filter-dimension-set-value>
					<d2l-filter-dimension-set-value key="physics" text="Physics"></d2l-filter-dimension-set-value>
					<d2l-filter-dimension-set-value key="stats" text="Statistics"></d2l-filter-dimension-set-value>
					<d2l-filter-dimension-set-value key="writerscraft" text="Writer's Craft"></d2l-filter-dimension-set-value>
				</d2l-filter-dimension-set>
			</d2l-filter>
			<d2l-dropdown>
				<d2l-button-subtle class="d2l-dropdown-opener" icon="tier1:chevron-down" icon-right text="Sort Learners"></d2l-button-subtle>
				<d2l-dropdown-menu no-auto-focus no-padding>
					<d2l-menu label="Sort Orders">
						<d2l-menu-item-radio value="first_asc" text="First Name A to Z"></d2l-menu-item-radio>
						<d2l-menu-item-radio value="first_desc" text="First Name Z to A" ></d2l-menu-item-radio>
						<d2l-menu-item-radio value="last_asc" text="Last Name A to Z"></d2l-menu-item-radio>
						<d2l-menu-item-radio value="last_desc" text="Last Name Z to A"></d2l-menu-item-radio>
					</d2l-menu>
				</d2l-dropdown-menu>
			</d2l-dropdown>
		`;
	}
}
customElements.define('d2l-dialog-with-broken-filter', DialogWithBrokenFilter);
