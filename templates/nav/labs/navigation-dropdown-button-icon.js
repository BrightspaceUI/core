import '../../../components/icons/icon.js';
import '../../../components/tooltip/tooltip.js';
import './navigation-notification-icon.js';
import { css, html, LitElement, nothing } from 'lit';
import { highlightBorderStyles, highlightButtonStyles } from './navigation-styles.js';
import { DropdownOpenerMixin } from '../../../components/dropdown/dropdown-opener-mixin.js';
import { getUniqueId } from '../../../helpers/uniqueId.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { offscreenStyles } from '../../../components/offscreen/offscreen.js';

class NavigationDropdownButtonIcon extends DropdownOpenerMixin(LitElement) {

	static get properties() {
		return {
			icon: { type: String },
			hasNotification: { attribute: 'has-notification', reflect: true, type: Boolean },
			text: { type: String },
			notificationText: { attribute: 'notification-text', type: String },
			tooltipOffset: { attribute: 'tooltip-offset', type: Number }
		};
	}

	static get styles() {
		return [highlightBorderStyles, highlightButtonStyles, offscreenStyles, css`
			:host {
				display: inline-block;
				height: 100%;
				position: relative;
			}
			:host([hidden]) {
				display: none;
			}
			.icon-container {
				display: inline-block;
				position: relative;
			}
		`];
	}

	constructor() {
		super();
		this.hasNotification = false;
		this._buttonId = getUniqueId();
		this._describedById = getUniqueId();
	}

	render() {
		const { ariaDescribedBy, ariaDescription, contents } = this._getRenderSettings();
		const highlightBorder = !this.disabled ? html`<span class="d2l-labs-navigation-highlight-border"></span>` : nothing;
		const tooltip = !this.dropdownOpened ? html`<d2l-tooltip close-on-click for="${this._buttonId}" for-type="label" position="bottom" offset="${ifDefined(this.tooltipOffset)}" class="vdiff-target">${this.text}</d2l-tooltip>` : nothing;
		return html`
			<button
				aria-describedby="${ifDefined(ariaDescribedBy)}"
				aria-label="${this.text}"
				?disabled="${this.disabled}"
				id="${this._buttonId}"
				type="button">${highlightBorder}${contents}</button>
			${ariaDescription}
			${tooltip}
			<slot></slot>
		`;
	}

	getOpenerElement() {
		return this.shadowRoot?.querySelector('button');
	}

	_getRenderSettings() {
		const icon = html`<d2l-icon icon="${this.icon}"></d2l-icon>`;
		if (this.hasNotification) {
			return {
				ariaDescribedBy: this._describedById,
				ariaDescription: html`<span class="d2l-offscreen" id="${this._describedById}">${this.notificationText}</span>`,
				contents: html`<span class="icon-container">${icon}<d2l-labs-navigation-notification-icon></d2l-labs-navigation-notification-icon></span>`
			};
		}
		return {
			ariaDescribedBy: undefined,
			ariaDescription: nothing,
			contents: icon
		};
	}

}

customElements.define('d2l-labs-navigation-dropdown-button-icon', NavigationDropdownButtonIcon);
