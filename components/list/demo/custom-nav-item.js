import '../../colors/colors.js';
import { css, LitElement } from 'lit';
import { ListItemButtonMixin } from '../list-item-button-mixin.js';

/**
 * A component for a "listitem" child within a list. It provides semantics, basic layout, breakpoints for responsiveness, a link for navigation, and selection.
 * @slot - Default content placed inside of the component
 * @slot illustration - Image associated with the list item located at the left of the item
 * @slot actions - Actions (e.g., button icons) associated with the listen item located at the right of the item
 * @slot nested - Nested d2l-list element
 */
class ListItemCustomNavItem extends ListItemButtonMixin(LitElement) {

	static get properties() {
		return {
			/**
			 * possible values: page, location
			 */
			current: { type: String, reflect: true }
		};
	}

	static get styles() {

		const styles = [ css`
			:host([current="page"]) [slot="outside-control-container"] {
				margin-block: 1px;
				outline: 3px solid var(--d2l-button-focus-color, var(--d2l-color-celestine));
			}
			:host([current="location"]) [slot="outside-control-container"] {
				margin-block: 1px;
				outline: 3px solid var(--d2l-button-focus-color, var(--d2l-color-celestine-plus-2));
			}
			:host([current="page"]) [slot="control-container"]::after {
				border-color: transparent;
			}
			.d2l-list-item-content ::slotted(*) {
				width: 100%;
			}
		` ];

		super.styles && styles.unshift(super.styles);
		return styles;
	}

	constructor() {
		super();
		this.current = undefined;
	}

	connectedCallback() {
		super.connectedCallback();
	}

	firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);

		if (this.current) {
			this._button.setAttribute('aria-current', this.current);
		}
		this.addEventListener('d2l-list-item-custom-nav-item-set-current', async(e) => {
			if (e.target === this) return;
			this.current = 'location';
		});
	}

	render() {
		return this._renderListItem();
	}

	updated(changedProperties) {
		super.updated(changedProperties);
		if (changedProperties.has('current')) {
			if (this.current) {
				this._button.setAttribute('aria-current', this.current);
			} else {
				this._button.removeAttribute('aria-current');
			}
			if (this.current === 'page') {
				this.dispatchEvent(new CustomEvent('d2l-list-item-custom-nav-item-set-current', { bubbles: true, composed: true }));
			}
		}
	}

}

customElements.define('d2l-list-item-custom-nav-item', ListItemCustomNavItem);
