/* eslint-disable sort-class-members/sort-class-members */
import '../colors/colors.js';
import '../dropdown/dropdown-menu.js';
import '../menu/menu-item.js';
import '../menu/menu-item-link.js';
import '../menu/menu-item-separator.js';
import '../button/button.js';
import '../button/button-subtle.js';
import '../dropdown/dropdown.js';
import '../dropdown/dropdown-button.js';
import '../dropdown/dropdown-button-subtle.js';
import '../dropdown/dropdown-more.js';
import '../menu/menu.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { DynamicResizeMixin } from '../../mixins/dynamic-resize-mixin.js';
import { LocalizeCoreElement } from '../../lang/localize-core-element.js';
import { offscreenStyles } from '../offscreen/offscreen.js';
import { RtlMixin } from '../../mixins/rtl-mixin.js';

/**
 *
 * A button group component that can be used to display a set of buttons
 *
 * @slot - Buttons, dropdown buttons, links or other items to be added to the container
 */
class ButtonGroup extends RtlMixin(LocalizeCoreElement(DynamicResizeMixin(LitElement))) {

	static get properties() {
		return {
			/**
			 * Setting this property to true will change the look of the dopdown button to a subtle button for subtle button groups
			 */
			subtle: {
				type: Boolean,
				attribute: 'subtle',
			},
			/**
			 * Setting this property to 'icon' will permanently change the dropdown opener to a ... icon
			 */
			openerType: {
				type: String,
				attribute: 'opener-type',
			},
		};
	}

	static get styles() {
		return [offscreenStyles,
			css`
			:host {
				display: block;
			}

			:host .d2l-button-group-container {
				display: flex;
				flex: 0 1 auto;
				flex-wrap: wrap;
			}

			:host .d2l-button-group-container ::slotted(d2l-button),
			:host .d2l-button-group-container ::slotted(d2l-button-icon),
			:host .d2l-button-group-container ::slotted(d2l-link),
			:host .d2l-button-group-container ::slotted(span),
			:host .d2l-button-group-container ::slotted(d2l-dropdown:not(.d2l-overflow-dropdown)),
			:host .d2l-button-group-container ::slotted(d2l-dropdown-button),
			:host .d2l-button-group-container ::slotted(d2l-dropdown-button-subtle),
			:host .d2l-button-group-container ::slotted(.d2l-button-group-custom-item) {
				margin-right: 0.6rem;
			}

			:host([dir="rtl"]) .d2l-button-group-container ::slotted(d2l-button),
			:host([dir="rtl"]) .d2l-button-group-container ::slotted(d2l-button-icon),
			:host([dir="rtl"]) .d2l-button-group-container ::slotted(d2l-link),
			:host([dir="rtl"]) .d2l-button-group-container ::slotted(span),
			:host([dir="rtl"]) .d2l-button-group-container ::slotted(d2l-dropdown:not(.d2l-overflow-dropdown)),
			:host([dir="rtl"]) .d2l-button-group-container ::slotted(d2l-dropdown-button),
			:host([dir="rtl"]) .d2l-button-group-container ::slotted(d2l-dropdown-button-subtle),
			:host([dir="rtl"]) .d2l-button-group-container ::slotted(.d2l-button-group-custom-item) {
				margin-left: 0.6rem;
				margin-right: 0;
			}

			:host([subtle]) .d2l-button-group-container ::slotted(d2l-button-subtle) {
				margin-right: 0.2rem;
			}

			:host([subtle][dir="rtl"]) .d2l-button-group-container ::slotted(d2l-button-subtle) {
				margin-left: 0.2rem;
				margin-right: 0;
			}

			:host([subtle]) .d2l-dropdown-subtle-opener-text,
			.d2l-dropdown-opener-text {
				margin-right: 0.3rem;
				vertical-align: middle;
			}

			:host(:dir(rtl)) .d2l-dropdown-opener-text,
			:host([subtle]:dir(rtl)) .d2l-dropdown-subtle-opener-text {
				margin-left: 0.3rem;
				margin-right: 0;
			}

			:host .d2l-button-group-container ::slotted([chomped]) {
				display: none !important;
			}`
		];
	}

	constructor() {
		super();
		this._getOverflowMenu = this._getOverflowMenu.bind(this);

		this._refId = 0;
		this._slotItems = [];
		this._overflowItems = [];
	}

	connectedCallback() {
		super.connectedCallback();
		this._addEventListeners();
	}

	_getOverflowMenu(overflowItems) {

		const moreActionsText = this.localize('components.button-group.moreActions');
		const menu = html`<d2l-dropdown-menu>
			<d2l-menu id="overflowMenu" label="${moreActionsText}">
				${overflowItems}
			</d2l-menu>
		</d2l-dropdown-menu>`;

		if (this._mini) {
			return html`<d2l-dropdown-more class="d2l-overflow-dropdown-mini" text="${moreActionsText}">
				${menu}
			</d2l-dropdown-more>`;
		}

		if (this.subtle) {
			return html`<d2l-dropdown-button-subtle class="d2l-overflow-dropdown" text="${moreActionsText}">
				${menu}
			</d2l-dropdown-button-subtle>`;
		}

		return html`<d2l-dropdown-button class="d2l-overflow-dropdown" text="${moreActionsText}">
			${menu}
		</d2l-dropdown-button>`;
	}
	render() {

		let overflowMenu;
		if (!this._overflowMenuHidden) {
			overflowMenu = this._getOverflowMenu(this._overflowItems);
		}

		return html`
			<div class="d2l-button-group-container">
				<slot id="buttons"></slot>
				${overflowMenu}
			</div>
		`;
	}

}

customElements.define('d2l-button-group', ButtonGroup);
