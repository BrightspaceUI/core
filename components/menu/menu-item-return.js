import '../icons/icon.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { LocalizeStaticMixin } from '../../mixins/localize-static-mixin.js';
import { MenuItemMixin } from './menu-item-mixin.js';
import { menuItemStyles } from './menu-item-styles.js';
import { RtlMixin } from '../../mixins/rtl-mixin.js';

class MenuItemReturn extends RtlMixin(LocalizeStaticMixin(MenuItemMixin(LitElement))) {

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
					margin-right: 0;
					margin-left: 1rem;
				}
			`
		];
	}

	static get resources() {
		return {
			'ar': {
				'return': '',
				'returnCurrentlyShowing': '{menuTitle}'
			},
			'en': {
				'return': 'Returns to previous menu.',
				'returnCurrentlyShowing': 'Returns to previous menu. You are viewing {menuTitle}.'
			},
			'es': {
				'return': '',
				'returnCurrentlyShowing': '{menuTitle}'
			},
			'fi': {
				'return': '',
				'returnCurrentlyShowing': '{menuTitle}'
			},
			'fr': {
				'return': '',
				'returnCurrentlyShowing': '{menuTitle}'
			},
			'ja': {
				'return': '',
				'returnCurrentlyShowing': '{menuTitle}'
			},
			'ko': {
				'return': '',
				'returnCurrentlyShowing': '{menuTitle}'
			},
			'pt': {
				'return': '',
				'returnCurrentlyShowing': '{menuTitle}'
			},
			'sv': {
				'return': '',
				'returnCurrentlyShowing': '{menuTitle}'
			},
			'tr': {
				'return': '',
				'returnCurrentlyShowing': '{menuTitle}'
			},
			'zh': {
				'return': '',
				'returnCurrentlyShowing': '{menuTitle}'
			},
			'zh-tw': {
				'return': '',
				'returnCurrentlyShowing': '{menuTitle}'
			}
		};
	}

	firstUpdated() {
		super.firstUpdated();
		this.setAttribute('aria-label', this.localize('return'));
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
				this.setAttribute('aria-label', this.localize('returnCurrentlyShowing', 'menuTitle', this.text));
			}
		});
	}

}

customElements.define('d2l-menu-item-return', MenuItemReturn);
