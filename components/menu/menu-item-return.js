import '../icons/icon.js';
import { css, html, LitElement } from 'lit';
import { LocalizeCoreElement } from '../../helpers/localize-core-element.js';
import { MenuItemMixin } from './menu-item-mixin.js';
import { menuItemStyles } from './menu-item-styles.js';
import { RtlMixin } from '../../mixins/rtl/rtl-mixin.js';

class MenuItemReturn extends RtlMixin(LocalizeCoreElement(MenuItemMixin(LitElement))) {

	static get styles() {
		return [ menuItemStyles,
			css`
				:host {
					display: flex;
					padding: 0.75rem 1rem;
				}

				span {
					flex: auto;
					line-height: 1rem;
					overflow-x: hidden;
					overflow-y: hidden;
					text-decoration: none;
					text-overflow: ellipsis;
					white-space: nowrap;
				}

				d2l-icon {
					flex: none;
					margin-right: 1rem;
					margin-top: 0.1rem;
				}

				:host([dir="rtl"]) > d2l-icon {
					margin-left: 1rem;
					margin-right: 0;
				}
			`
		];
	}

	firstUpdated() {
		super.firstUpdated();
		this.setAttribute('aria-label', this.localize('components.menu-item-return.return'));
	}

	render() {
		return html`
			<d2l-icon icon="tier1:chevron-left"></d2l-icon>
			<span aria-hidden="true">${this.text}</span>
		`;
	}

	updated(changedProperties) {
		super.updated(changedProperties);

		changedProperties.forEach((oldValue, propName) => {
			if (propName === 'text') {
				this.setAttribute('aria-label', this.localize('components.menu-item-return.returnCurrentlyShowing', 'menuTitle', this.text));
			}
		});
	}

}

customElements.define('d2l-menu-item-return', MenuItemReturn);
