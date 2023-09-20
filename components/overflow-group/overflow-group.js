import '../colors/colors.js';
import '../dropdown/dropdown-menu.js';
import '../button/button.js';
import '../button/button-subtle.js';
import '../dropdown/dropdown.js';
import '../dropdown/dropdown-button.js';
import '../dropdown/dropdown-button-subtle.js';
import '../dropdown/dropdown-more.js';
import '../menu/menu.js';
import '../menu/menu-item.js';
import '../menu/menu-item-separator.js';
import '../menu/menu-item-link.js';
import { css, html, LitElement } from 'lit';
import { OVERFLOW_CLASS, OVERFLOW_MINI_CLASS, OverflowGroupMixin } from './overflow-group-mixin.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { RtlMixin } from '../../mixins/rtl/rtl-mixin.js';

const OPENER_STYLE = {
	DEFAULT: 'default',
	SUBTLE: 'subtle',
};

function createMenuItem(node) {
	const childText = node.text || node.firstChild && (node.firstChild.label || node.firstChild.text || node.firstChild.textContent.trim());
	const disabled = !!node.disabled;
	const handleItemSelect = () => {
		node.dispatchEvent(new CustomEvent('d2l-button-ghost-click'));
		node.click();
	};
	return html`<d2l-menu-item
		?disabled=${disabled}
		@d2l-menu-item-select=${handleItemSelect}
		text="${childText}"
		description="${ifDefined(node.description || node.ariaLabel)}">
	</d2l-menu-item>`;
}

function createMenuItemLink(node) {
	const text =  node.textContent.trim();
	const href =  node.href;
	const target = node.target;

	return html`<d2l-menu-item-link
		text="${text}"
		href="${href}"
		target="${target}">
	</d2l-menu-item-link>`;
}

function createMenuItemSeparator() {
	return html`<d2l-menu-item-separator></d2l-menu-item-separator>`;
}

/**
 *
 * A component that can be used to display a set of buttons, links or menus that will be put into a dropdown menu when they no longer fit on the first line of their container
 * @slot - Buttons, dropdown buttons, links or other items to be added to the container
 * @attr {'default'|'icon'} [opener-type="default"] - Set the opener type to 'icon' for a `...` menu icon instead of `More actions` text
 * @attr {boolean} auto-show - Use predefined classes on slot elements to set min and max buttons to show
*/
class OverflowGroup extends OverflowGroupMixin(RtlMixin(LitElement)) {

	static get properties() {
		return {
			/**
			 * Setting this property will change the style of the overflow menu opener
			 * @type {'default'|'subtle'}
			 * @default "default"
			 */
			openerStyle: {
				type: String,
				reflect: true,
				attribute: 'opener-style',
			}
		};
	}

	static get styles() {
		return [super.styles, css`
			:host([opener-style="subtle"]) {
				--d2l-button-icon-fill-color: var(--d2l-color-celestine);
				--d2l-button-icon-fill-color-hover: var(--d2l-color-celestine-minus-1);
			}

			::slotted(d2l-button),
			::slotted(d2l-link),
			::slotted(span),
			::slotted(d2l-dropdown:not(.d2l-overflow-dropdown)),
			::slotted(d2l-dropdown-button) {
				margin-right: 0.6rem;
			}
			:host([dir="rtl"]) ::slotted(d2l-button),
			:host([dir="rtl"]) ::slotted(d2l-link),
			:host([dir="rtl"]) ::slotted(span),
			:host([dir="rtl"]) ::slotted(d2l-dropdown:not(.d2l-overflow-dropdown)),
			:host([dir="rtl"]) ::slotted(d2l-dropdown-button) {
				margin-left: 0.6rem;
				margin-right: 0;
			}
			::slotted(d2l-button-subtle),
			::slotted(d2l-button-icon),
			::slotted(d2l-dropdown-button-subtle),
			::slotted(d2l-dropdown-more),
			::slotted(d2l-dropdown-context-menu),
			::slotted(d2l-selection-action),
			::slotted(d2l-selection-action-dropdown) {
				margin-right: 0.2rem;
			}
			:host([dir="rtl"]) ::slotted(d2l-button-subtle),
			:host([dir="rtl"]) ::slotted(d2l-button-icon),
			:host([dir="rtl"]) ::slotted(d2l-dropdown-button-subtle),
			:host([dir="rtl"]) ::slotted(d2l-dropdown-more),
			:host([dir="rtl"]) ::slotted(d2l-dropdown-context-menu),
			:host([dir="rtl"]) ::slotted(d2l-selection-action),
			:host([dir="rtl"]) ::slotted(d2l-selection-action-dropdown) {
				margin-left: 0.2rem;
				margin-right: 0;
			}
		`];
	}

	constructor() {
		super();
		this.openerStyle = OPENER_STYLE.DEFAULT;
	}

	convertToOverflowItem(node) {
		const tagName = node.tagName.toLowerCase();
		switch (tagName) {
			case 'd2l-button':
			case 'd2l-button-subtle':
			case 'button':
			case 'd2l-button-icon':
			case 'd2l-selection-action':
				return createMenuItem(node);
			case 'a':
			case 'd2l-link':
				return createMenuItemLink(node);
			case 'd2l-menu':
			case 'd2l-dropdown':
			case 'd2l-dropdown-button':
			case 'd2l-dropdown-button-subtle':
			case 'd2l-dropdown-context-menu':
			case 'd2l-dropdown-more':
			case 'd2l-selection-action-dropdown':
				return this._createMenuItemMenu(node);
			case 'd2l-menu-item':
			case 'd2l-selection-action-menu-item':
				// if the menu item has children treat it as a menu item menu
				if (node.children.length > 0) {
					return this._createMenuItemMenu(node);
				} else {
					return createMenuItem(node);
				}
		}
		if (node.getAttribute('role') === 'separator') {
			return createMenuItemSeparator();
		}
	}

	getOverflowContainer(overflowItems, mini) {
		const moreActionsText = this.localize('components.overflow-group.moreActions');
		const menu = html`<d2l-dropdown-menu class="vdiff-target">
			<d2l-menu label="${moreActionsText}">
				${overflowItems}
			</d2l-menu>
		</d2l-dropdown-menu>`;

		if (mini) {
			return html`<d2l-dropdown-more class="${OVERFLOW_MINI_CLASS} d2l-overflow-dropdown-mini" text="${moreActionsText}">
				${menu}
			</d2l-dropdown-more>`;
		}

		if (this.openerStyle === OPENER_STYLE.SUBTLE) {
			return html`<d2l-dropdown-button-subtle class="${OVERFLOW_CLASS} d2l-overflow-dropdown" text="${moreActionsText}">
				${menu}
			</d2l-dropdown-button-subtle>`;
		}

		return html`<d2l-dropdown-button class="${OVERFLOW_CLASS} d2l-overflow-dropdown" text="${moreActionsText}">
			${menu}
		</d2l-dropdown-button>`;
	}

	_createMenuItemMenu(node) {
		const menuOpener =
			node.querySelector('d2l-dropdown-button')
			||  node.querySelector('d2l-dropdown-button-subtle');

		const openerText = node.text || menuOpener.text;
		const disabled = !!node.disabled;
		const subMenu = node.querySelector('d2l-menu');

		const subItems = Array.from(subMenu.children).map((node) => this.convertToOverflowItem(node));

		return html`<d2l-menu-item
			?disabled=${disabled}
			text="${openerText}">
			<d2l-menu>
				${subItems}
			</d2l-menu>
		</d2l-menu-item>`;
	}

}

customElements.define('d2l-overflow-group', OverflowGroup);
