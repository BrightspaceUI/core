import { css, html, LitElement } from 'lit-element/lit-element.js';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { MenuItemMixin } from './menu-item-mixin.js';
import { menuItemStyles } from './menu-item-styles.js';

class MenuItemLink extends MenuItemMixin(LitElement) {

	static get properties() {
		return {
			href: { type: String },
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
					color: inherit;
					display: block;
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
		this.addEventListener('keydown', this._onKeyDown);
		this.addEventListener('click', this._onClick);
	}

	render() {
		return html`
			<a href="${ifDefined(this.href)}" target="${ifDefined(this.target)}" tabindex="-1">${this.text}</a>
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
