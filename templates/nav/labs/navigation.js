import './navigation-band.js';
import './navigation-skip-main.js';
import { css, html, LitElement, nothing } from 'lit';
import { getNextFocusable } from '../../../helpers/focus.js';

/**
 * Primary navigation wrapper component.
 * @slot - Default content placed inside of the component
 * @slot navigation-band - Content placed inside band
 */
class Navigation extends LitElement {

	static get properties() {
		return {
			hasSkipNav: { attribute: 'has-skip-nav', type: Boolean }
		};
	}

	static get styles() {
		return css`
			:host {
				display: block;
				position: relative;
			}
			.d2l-labs-navigation-shadow-drop-border {
				background-color: rgba(0, 0, 0, 0.02);
				bottom: -4px;
				display: var(--d2l-labs-navigation-shadow-drop-border-display, block);
				height: 4px;
				pointer-events: none;
				position: absolute;
				width: 100%;
			}
		`;
	}

	constructor() {
		super();
		this.hasSkipNav = false;
	}

	render() {
		const skipNav = this.hasSkipNav ? html`<d2l-labs-navigation-skip-main @d2l-labs-navigation-skip-fail="${this._handleSkipNavFail}"></d2l-labs-navigation-skip-main>` : nothing;
		return html`
			${skipNav}<d2l-labs-navigation-band><slot name="navigation-band"></slot></d2l-labs-navigation-band>
			<slot></slot>
			<div class="d2l-labs-navigation-shadow-drop-border"></div>
		`;
	}

	_handleSkipNavFail() {
		const nextFocusable = getNextFocusable(this.shadowRoot.querySelector('.d2l-labs-navigation-shadow-drop-border'));
		if (nextFocusable) {
			nextFocusable.focus();
		}
	}

}

customElements.define('d2l-labs-navigation', Navigation);
