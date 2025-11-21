import { css, html, LitElement } from 'lit';
import { getFlag } from '../../helpers/flags.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { LinkMixin } from '../link/link-mixin.js';
import { LocalizeCoreElement } from '../../helpers/localize-core-element.js';
import { MenuItemMixin } from './menu-item-mixin.js';
import { menuItemStyles } from './menu-item-styles.js';

const newWindowIconEnabled = getFlag('GAUD-8295-menu-item-link-new-window-icon', true);

/**
 * A menu item component used for navigating.
 * @fires click - Dispatched when the link is clicked
 * @slot supporting - Allows supporting information to be displayed on the right-most side of the menu item
 */
class MenuItemLink extends (newWindowIconEnabled ? LinkMixin(MenuItemMixin(LitElement)) : LocalizeCoreElement(MenuItemMixin(LitElement))) {

	static get properties() {
		// remove this block when cleaning up GAUD-8295-menu-item-link-new-window-icon
		if (!newWindowIconEnabled) return {
			/**
			 * Prompts the user to save the linked URL instead of navigating to it.
			 * Must be to a resource on the same origin.
			 * Can be used with or without a value, when set the value becomes the filename.
			 * @type {string}
			 */
			download: { type: String },
			/**
			 * REQUIRED: The url the menu item link navigates to
			 * @type {string}
			 */
			href: { type: String },
			/**
			 * Where to display the linked URL
			 * @type {string}
			 */
			target: { type: String },
			_ariaDescription: { type: String, attribute: 'aria-description', reflect: true },
		};

		return {
			_ariaDescription: { type: String, attribute: 'aria-description', reflect: true },
		};
	}

	static get styles() {
		// remove this block when cleaning up GAUD-8295-menu-item-link-new-window-icon
		if (!newWindowIconEnabled) return [ menuItemStyles,
			css`
				:host {
					display: block;
					padding: 0;
				}

				:host > a {
					align-items: center;
					color: inherit;
					display: flex;
					line-height: 1rem;
					outline: none;
					overflow-x: hidden;
					padding: 0.75rem 1rem;
					text-decoration: none;
				}
			`
		];

		return [ super.styles, menuItemStyles,
			css`
				:host {
					display: block;
					padding: 0;
				}

				:host > a {
					align-items: center;
					color: inherit;
					display: flex;
					line-height: 1rem;
					outline: none;
					overflow-x: hidden;
					padding: 0.75rem 1rem;
					text-decoration: none;
				}

				:host([target="_blank"]) .d2l-menu-item-text {
					align-self: baseline;
					flex: 0 1 auto;
				}

				#new-window {
					align-self: baseline;
					flex: auto;
				}
			`
		];
	}

	constructor() {
		super();
		this._letClickPropagate = true;
	}

	firstUpdated() {
		super.firstUpdated();
		this.addEventListener('keydown', this._onKeyDown);
	}

	render() {
		// remove this block when cleaning up GAUD-8295-menu-item-link-new-window-icon
		if (!newWindowIconEnabled) {
			const rel = this.target ? 'noreferrer noopener' : undefined;
			return html`
				<a download="${ifDefined(this.download)}" href="${ifDefined(this.href)}" rel="${ifDefined(rel)}" target="${ifDefined(this.target)}" tabindex="-1">
					<div class="d2l-menu-item-text">${this.text}</div>
					<div class="d2l-menu-item-supporting"><slot name="supporting"></slot></div>
				</a>
			`;
		}

		const inner = html`
			<div class="d2l-menu-item-text">${this.text}</div>
			${this._renderNewWindowIcon()}
			<div class="d2l-menu-item-supporting"><slot name="supporting"></slot></div>
		`;
		return this._render(inner, { ariaLabel: this._ariaLabel, rel: this.target ? 'noreferrer noopener' : undefined, tabindex: -1 });

	}

	willUpdate(changedProperties) {
		super.willUpdate(changedProperties);
		if (newWindowIconEnabled && changedProperties.has('_ariaLabel') || changedProperties.has('target')) {
			this._ariaDescription = this.getNewWindowDescription(this._ariaLabel);
		}
	}

	// remove this function when cleaning up GAUD-8295-menu-item-link-new-window-icon
	getNewWindowDescription(label) {
		return label && this.target === '_blank' ? this.localize('components.link.open-in-new-window') : undefined;
	}

	_onKeyDown(e) {
		if (e.keyCode === this.__keyCodes.ENTER || e.keyCode === this.__keyCodes.SPACE) {
			this.shadowRoot.querySelector('a').click();
		}
	}
}

customElements.define('d2l-menu-item-link', MenuItemLink);
