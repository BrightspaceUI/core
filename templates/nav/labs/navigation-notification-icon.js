import '../../../components/colors/colors.js';
import { css, html, LitElement } from 'lit';
import { RtlMixin } from '../../../mixins/rtl-mixin.js';

class NavigationNotificationIcon extends RtlMixin(LitElement) {

	static get properties() {
		return {
			thinBorder: { attribute: 'thin-border', reflect: true, type: Boolean }
		};
	}

	static get styles() {
		return css`
			:host {
				display: inline-block;
				height: 100%;
				position: absolute;
				right: calc(-100% + 11px);
				top: calc(-50% + 11px);
				width: 100%;
			}
			:host([hidden]) {
				display: none;
			}
			:host([dir="rtl"]) {
				left: calc(-50% - 4px);
				right: auto;
			}
			.d2l-labs-navigation-notification-icon-indicator {
				background: var(--d2l-color-primary-accent-indicator);
				border: 2px solid white;
				border-radius: 50%;
				height: 10px;
				width: 10px;
			}
			:host([thin-border]) .d2l-labs-navigation-notification-icon-indicator {
				border-width: 1px;
			}
		`;
	}

	constructor() {
		super();
		this.thinBorder = false;
	}

	render() {
		return html`<div class="d2l-labs-navigation-notification-icon-indicator"></div>`;
	}

}

window.customElements.define('d2l-labs-navigation-notification-icon', NavigationNotificationIcon);
