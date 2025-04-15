import '../colors/colors.js';
import { css } from 'lit';
import { ListItemButtonMixin } from './list-item-button-mixin.js';

export const ListItemNavMixin = superclass => class extends ListItemButtonMixin(superclass) {

	static get properties() {
		return {
			current: { type: Boolean, reflect: true },
			_childCurrent: { state: true },
		};
	}

	static get styles() {

		const styles = [ css`
			button[aria-current="page"] {
				border: 2px solid blue;
			}
			button[aria-current="location"] {
				border: 2px solid green;
			}
			.d2l-list-item-content ::slotted(*) {
				width: 100%; /* add vdiff for this case where hovering on tooltip causes the text to be wider than the button */
			}
		` ];

		super.styles && styles.unshift(super.styles);
		return styles;
	}

	constructor() {
		super();
		this.current = false;
		this._childCurrent = false;
	}

	connectedCallback() {
		super.connectedCallback();
		this.addEventListener('d2l-list-item-nav-set-current', async(e) => {
			if (e.target === this || !this._button) return;
			this._childCurrent = true;
		});
	}

	firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);

		if (this.current) {
			this._button.ariaCurrent = 'page';
			this.dispatchEvent(new CustomEvent('d2l-list-item-nav-set-current', { bubbles: true }));
		}
	}

	updated(changedProperties) {
		super.updated(changedProperties);
		if (changedProperties.has('current')) {
			// this._button.ariaCurrent = this.current;

			if (this.current) {
				this._button.ariaCurrent = 'page';
				/** @ignore */
				this.dispatchEvent(new CustomEvent('d2l-list-item-nav-top-level', { bubbles: true }));
			} else if (this._childCurrent) {
				this._button.ariaCurrent = 'location';
			} else {
				this._button.ariaCurrent = undefined;
				// handle removal
			}
		} else if (changedProperties.has('_childCurrent')) {
			if (this.current) {
				this._button.ariaCurrent = 'page';
			} else if (this._childCurrent) {
				this._button.ariaCurrent = 'location';
			} else {
				this._button.ariaCurrent = undefined;
			}
		}
	}

	dispatchResetEvent() {
		/** @ignore */
		this.dispatchEvent(new CustomEvent('d2l-list-item-nav-set-current', { bubbles: true }));
	}

	_onButtonClick(e) {
		if (!this._getDescendantClicked(e)) {
			// this.current = 'page';
			this.current = true;
			this._childCurrent = false;
		}
	}

};