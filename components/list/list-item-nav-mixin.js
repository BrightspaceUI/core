import '../colors/colors.js';
import { css } from 'lit';
import { getUniqueId } from '../../helpers/uniqueId.js';
import { ListItemButtonMixin } from './list-item-button-mixin.js';
import { getIsInteractiveChildClicked } from './list-item-mixin.js';

export const ListItemNavMixin = superclass => class extends ListItemButtonMixin(superclass) {

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
			:host([current="page"]) [slot="control-container"]::after {
				border-color: transparent;
			}
		` ];

		super.styles && styles.unshift(super.styles);
		return styles;
	}

	constructor() {
		super();
		this.current = undefined;
		this._primaryActionId = getUniqueId();
	}

	firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);

		if (this.current) this._button.setAttribute('aria-current', this.current);

		this.addEventListener('d2l-list-item-menu-item-set-current', async(e) => {
			if (e.target === this) return;
			this.current = 'location';
		});
	}

	updated(changedProperties) {
		super.updated(changedProperties);
		if (changedProperties.has('current')) {
			if (this.current) {
				this._button.setAttribute('aria-current', this.current);
			} else {
				this._button.removeAttribute('aria-current');
			}
		}
	}

	dispatchResetEvent() {
		this.dispatchEvent(new CustomEvent('d2l-list-item-menu-item-set-current', { bubbles: true }));
	}

	_onButtonClick(e) {
		if (!getIsInteractiveChildClicked(e, this.shadowRoot.querySelector(`#${this._primaryActionId}`))) {
			this.current = 'page';
		}
		super._onButtonClick(e);
	}

};