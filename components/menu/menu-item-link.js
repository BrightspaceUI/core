import { css, html, LitElement } from 'lit';
import { LinkMixin } from '../link/link-mixin.js';
import { MenuItemMixin } from './menu-item-mixin.js';
import { menuItemStyles } from './menu-item-styles.js';

/**
 * A menu item component used for navigating.
 * @fires click - Dispatched when the link is clicked
 * @slot supporting - Allows supporting information to be displayed on the right-most side of the menu item
 */
class MenuItemLink extends LinkMixin(MenuItemMixin(LitElement)) {

	static get properties() {
		return {
			_ariaDescription: { type: String, attribute: 'aria-description', reflect: true },
		};
	}

	static get styles() {
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
		const inner = html`
			<div class="d2l-menu-item-text">${this.text}</div>
			${this._renderNewWindowIcon()}
			<div class="d2l-menu-item-supporting"><slot name="supporting"></slot></div>
		`;
		return this._render(inner, { ariaLabel: this._ariaLabel, rel: this.target ? 'noreferrer noopener' : undefined, tabindex: -1 });

	}

	willUpdate(changedProperties) {
		super.willUpdate(changedProperties);
		if (changedProperties.has('_ariaLabel') || changedProperties.has('target')) {
			this._ariaDescription = this.getNewWindowDescription(this._ariaLabel);
		}
	}

	_onKeyDown(e) {
		if (e.keyCode === this.__keyCodes.ENTER || e.keyCode === this.__keyCodes.SPACE) {
			this.shadowRoot.querySelector('a').click();
		}
	}
}

customElements.define('d2l-menu-item-link', MenuItemLink);
