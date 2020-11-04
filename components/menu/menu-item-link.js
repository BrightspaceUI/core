import { css, html, LitElement } from 'lit-element/lit-element.js';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { MenuItemMixin } from './menu-item-mixin.js';
import { menuItemStyles } from './menu-item-styles.js';

/**
 * A menu item component used for navigating.
 * @fires click - Dispatched when the link is clicked
 * @fires d2l-menu-item-select - Dispatched when the menu item is selected
 * @fires d2l-menu-item-visibility-change - Dispatched when the visibility of the menu item changes
 */
class MenuItemLink extends MenuItemMixin(LitElement) {

	static get properties() {
		return {
			/**
			 * Prompts the user to save the linked URL instead of navigating to it.
			 * Must be to a resource on the same origin.
			 * Can be used with or without a value, when set the value becomes the filename.
			 */
			download: { type: String },
			/**
			 * The url the menu item link navigates to
			 */
			href: { type: String },
			/**
			 * Where to display the linked URL
			 */
			target: { type: String }
		};
	}

	static get styles() {
		return [ menuItemStyles,
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
					text-overflow: ellipsis;
					white-space: nowrap;
				}
			`
		];
	}

	firstUpdated() {
		super.firstUpdated();
		this.addEventListener('click', this._onClick);
		this.addEventListener('keydown', this._onKeyDown);
	}

	render() {
		const rel = this.target ? 'noreferrer noopener' : undefined;
		return html`
			<a download="${ifDefined(this.download)}" href="${ifDefined(this.href)}" rel="${ifDefined(rel)}" target="${ifDefined(this.target)}" tabindex="-1">
				<div class="d2l-menu-item-text">${this.text}</div>
				<div class="d2l-menu-item-supporting"><slot name="supporting"></slot></div>
			</a>
		`;
	}

	_getTarget() {
		if (this.target && this.target !== '') {
			return this.target;
		}
		let base = document.getElementsByTagName('base');
		if (base && base.length > 0) {
			base = base[0];
			return base.getAttribute('target');
		}
		return null;
	}

	_onClick() {
		this.shadowRoot.querySelector('a').dispatchEvent(new CustomEvent('click'));
	}

	_onKeyDown(e) {
		if (e.keyCode === this.__keyCodes.ENTER || e.keyCode === this.__keyCodes.SPACE) {
			const target = this._getTarget();
			if (target === '_parent') {
				window.parent.location.assign(this.href);
			} else if (target === '_top') {
				window.top.location.assign(this.href);
			} else {
				window.location.assign(this.href);
			}
		}
	}
}

customElements.define('d2l-menu-item-link', MenuItemLink);
