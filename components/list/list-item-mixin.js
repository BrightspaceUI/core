import '../button/button-add.js';
import '../colors/colors.js';
import './list-item-generic-layout.js';
import './list-item-placement-marker.js';
import '../tooltip/tooltip.js';
import '../expand-collapse/expand-collapse-content.js';
import { css, html, nothing } from 'lit';
import { findComposedAncestor, getComposedParent } from '../../helpers/dom.js';
import { classMap } from 'lit/directives/class-map.js';
import { composeMixins } from '../../helpers/composeMixins.js';
import { getFirstFocusableDescendant } from '../../helpers/focus.js';
import { getUniqueId } from '../../helpers/uniqueId.js';
import { getValidHexColor } from '../../helpers/color.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { LabelledMixin } from '../../mixins/labelled/labelled-mixin.js';
import { ListItemCheckboxMixin } from './list-item-checkbox-mixin.js';
import { ListItemDragDropMixin } from './list-item-drag-drop-mixin.js';
import { ListItemExpandCollapseMixin } from './list-item-expand-collapse-mixin.js';
import { ListItemRoleMixin } from './list-item-role-mixin.js';
import { LocalizeCoreElement } from '../../helpers/localize-core-element.js';
import { RtlMixin } from '../../mixins/rtl/rtl-mixin.js';
import { SkeletonMixin } from '../skeleton/skeleton-mixin.js';
import { styleMap } from 'lit/directives/style-map.js';

let tabPressed = false;
let tabListenerAdded = false;
function addTabListener() {
	if (tabListenerAdded) return;
	tabListenerAdded = true;
	document.addEventListener('keydown', e => {
		if (e.keyCode !== 9) return;
		tabPressed = true;
	});
	document.addEventListener('keyup', e => {
		if (e.keyCode !== 9) return;
		tabPressed = false;
	});
}

let hasDisplayedKeyboardTooltip = false;

/**
 * @property label - The hidden label for the checkbox and expand collapse control
 */
export const ListItemMixin = superclass => class extends composeMixins(
	superclass,
	LabelledMixin,
	LocalizeCoreElement,
	ListItemExpandCollapseMixin,
	ListItemDragDropMixin,
	ListItemCheckboxMixin,
	ListItemRoleMixin,
	RtlMixin,
	SkeletonMixin) {

	static get properties() {
		return {
			/**
			 * A color indicator to appear at the beginning of a list item. Expected value is a valid 3, 4, 6, or 8 character CSS color hex code (e.g., #006fbf).
			 * @type {string}
			 */
			color: { type: String },
			/**
			 * @ignore
			 */
			first: { type: Boolean, reflect: true },
			/**
			 * Whether to allow the drag target to be the handle only rather than the entire cell
			 * @type {boolean}
			 */
			dragTargetHandleOnly: { type: Boolean, attribute: 'drag-target-handle-only' },
			/**
			 * Whether to disable rendering the entire item as the primary action. Required if slotted content is interactive.
			 * @type {boolean}
			 */
			noPrimaryAction: { type: Boolean, attribute: 'no-primary-action' },
			/**
			 * How much padding to render list items with
			 * @type {'normal'|'none'}
			 */
			paddingType: { type: String, attribute: 'padding-type' },
			_addButtonText: { state: true },
			_displayKeyboardTooltip: { type: Boolean },
			_hasColorSlot: { type: Boolean, reflect: true, attribute: '_has-color-slot' },
			_hasNestedList: { type: Boolean, reflect: true, attribute: '_has-nested-list' },
			_hovering: { type: Boolean, reflect: true },
			_hoveringPrimaryAction: { type: Boolean, attribute: '_hovering-primary-action', reflect: true },
			_focusing: { type: Boolean, reflect: true },
			_focusingPrimaryAction: { type: Boolean, attribute: '_focusing-primary-action', reflect: true },
			_highlight: { type: Boolean, reflect: true },
			_highlighting: { type: Boolean, reflect: true },
			_showAddButton: { type: Boolean, attribute: '_show-add-button', reflect: true },
			_siblingHasColor: { state: true },
		};
	}

	static get styles() {

		const styles = [ css`
			:host {
				display: block;
				position: relative;
			}
			:host[hidden] {
				display: none;
			}

			:host([dragging]) d2l-list-item-generic-layout {
				filter: grayscale(75%);
				opacity: 0.4;
			}
			:host([dragging]) .d2l-list-item-drag-image {
				background: white;
			}

			[slot="control-container"] {
				pointer-events: none;
				position: relative;
			}

			:host(:first-of-type) [slot="control-container"]::before,
			[slot="control-container"]::after {
				border-top: 1px solid var(--d2l-color-mica);
				content: "";
				position: absolute;
				width: 100%;
			}
			:host([_show-add-button][_has-nested-list]) [slot="before-content"] {
				border-bottom: 1px solid var(--d2l-color-mica);
				margin-bottom: -1px;
			}
			:host([_show-add-button][_has-nested-list]:not([selection-disabled]):not([skeleton])[selected]) [slot="before-content"] {
				border-bottom-color: #b6cbe8;
			}
			:host(:first-of-type) [slot="control-container"]::before {
				top: 0;
			}
			[slot="control-container"]::after {
				bottom: -1px;
			}

			:host(:first-of-type[_separators="between"]) [slot="control-container"]::before,
			:host(:last-of-type[_separators="between"]) [slot="control-container"]::after,
			:host([_separators="none"]) [slot="control-container"]::before,
			:host([_separators="none"]) [slot="control-container"]::after,
			:host([_hovering-selection]) [slot="control-container"]::before,
			:host([_hovering-selection]) [slot="control-container"]::after,
			:host([_hovering-primary-action]) [slot="control-container"]::before,
			:host([_hovering-primary-action]) [slot="control-container"]::after,
			:host([selectable][_focusing]) [slot="control-container"]::before,
			:host([selectable][_focusing]) [slot="control-container"]::after,
			:host([_focusing-primary-action]) [slot="control-container"]::before,
			:host([_focusing-primary-action]) [slot="control-container"]::after,
			:host([selected]:not([selection-disabled]):not([skeleton])) [slot="control-container"]::before,
			:host([selected]:not([selection-disabled]):not([skeleton])) [slot="control-container"]::after,
			:host([_show-add-button]) [slot="control-container"]::after,
			:host([_show-add-button]) [slot="control-container"]::before,
			:host(:first-of-type[_nested]) [slot="control-container"]::before {
				border-top-color: transparent;
			}

			:host([padding-type="none"]) d2l-list-item-generic-layout {
				border-bottom: 0;
				border-top: 0;
			}

			:host(:not([_render-expand-collapse-slot])) .d2l-list-item-content-extend-separators > [slot="control"] {
				width: 3rem;
			}
			:host(:not([_has-color-slot])) .d2l-list-item-content-extend-separators > [slot="content"],
			:host(:not([_has-color-slot])[dir="rtl"]) .d2l-list-item-content-extend-separators > [slot="content"] {
				padding-left: 0.9rem;
				padding-right: 0.9rem;
			}
			:host([selectable]) .d2l-list-item-content-extend-separators > [slot="content"] {
				padding-left: 0;
			}
			:host([dir="rtl"][selectable]) .d2l-list-item-content-extend-separators > [slot="content"] {
				padding-left: 0.9rem;
				padding-right: 0;
			}

			:host([_hovering-primary-action]) .d2l-list-item-content,
			:host([_focusing-primary-action]) .d2l-list-item-content {
				--d2l-list-item-content-text-color: var(--d2l-color-celestine);
				--d2l-list-item-content-text-decoration: underline;
			}
			:host([_focusing-primary-action]) .d2l-list-item-content {
				--d2l-list-item-content-text-border-radius: 3px;
				--d2l-list-item-content-text-outline: 2px solid var(--d2l-color-celestine);
				--d2l-list-item-content-text-outline-offset: 1px;
			}
			[slot="content-action"] {
				height: 100%;
			}
			[slot="content-action"]:focus {
				outline: none;
			}
			[slot="content"] {
				display: flex;
				justify-content: stretch;
				padding: 0.55rem 0.55rem 0.55rem 0;
			}
			:host([dir="rtl"]) [slot="content"] {
				padding-left: 0.55rem;
				padding-right: 0;
			}
			:host([padding-type="none"]) [slot="content"] {
				padding-bottom: 0;
				padding-top: 0;
			}

			[slot="content"] ::slotted([slot="illustration"]),
			[slot="content"] .d2l-list-item-illustration > * {
				border-radius: 6px;
				flex-grow: 0;
				flex-shrink: 0;
				margin-inline-end: var(--d2l-list-item-illustration-margin-inline-end, 0.9rem);
				max-height: var(--d2l-list-item-illustration-max-height, 2.6rem);
				max-width: var(--d2l-list-item-illustration-max-width, 4.5rem);
				overflow: hidden;
			}
			[slot="content"] ::slotted(d2l-icon[slot="illustration"]),
			[slot="content"] .d2l-list-item-illustration d2l-icon {
				border-radius: 0;
				color: var(--d2l-list-item-content-text-color);
			}

			.d2l-list-item-actions-container {
				padding: 0.55rem 0;
			}

			::slotted([slot="actions"]),
			.d2l-list-item-actions > * {
				display: grid;
				gap: 0.3rem;
				grid-auto-columns: 1fr;
				grid-auto-flow: column;
			}

			.d2l-list-item-content-extend-separators ::slotted([slot="actions"]),
			.d2l-list-item-content-extend-separators .d2l-list-item-actions > * {
				margin-right: 0.9rem;
			}
			:host([dir="rtl"]) .d2l-list-item-content-extend-separators ::slotted([slot="actions"]),
			:host([dir="rtl"]) .d2l-list-item-content-extend-separators .d2l-list-item-actions > * {
				margin-left: 0.9rem;
				margin-right: 0;
			}

			d2l-selection-input {
				margin: 0.55rem 0.55rem 0.55rem 0;
			}
			:host(:not([_render-expand-collapse-slot])) .d2l-list-item-content-extend-separators d2l-selection-input {
				margin-inline-start: 0.9rem;
			}
			:host(:not([_render-expand-collapse-slot])[_has-color-slot]) .d2l-list-item-content-extend-separators d2l-selection-input {
				margin-inline-start: 0.6rem;
			}

			d2l-list-item-drag-handle {
				margin: 0.25rem 0.3rem;
			}
			:host([dir="rtl"]) d2l-selection-input {
				margin-left: 0.9rem;
				margin-right: 0;
			}

			[slot="outside-control-container"] {
				border: 1px solid transparent;
				border-radius: 6px;
				margin: 0 -12px;
			}
			.d2l-list-item-content-extend-separators [slot="outside-control-container"] {
				border-left: none !important;
				border-radius: 0 !important;
				border-right: none !important;
			}
			:host([draggable]) [slot="outside-control-container"],
			.d2l-list-item-content-extend-separators [slot="outside-control-container"] {
				margin: 0;
			}

			:host([_has-color-slot]) .d2l-list-item-content-extend-separators [slot="outside-control-container"],
			:host([dir="rtl"][_has-color-slot]) .d2l-list-item-content-extend-separators [slot="outside-control-container"] {
				margin-inline-end: 0 !important;
				margin-inline-start: 0 !important;
			}

			:host(:not([draggable])[_has-color-slot]) [slot="outside-control-container"] {
				margin-left: -6px;
			}
			:host(:not([draggable])[dir="rtl"][_has-color-slot]) [slot="outside-control-container"] {
				margin-left: 0;
				margin-right: -6px;
			}

			:host([_hovering-primary-action]) [slot="outside-control-container"],
			:host([_hovering-selection]) [slot="outside-control-container"],
			:host([_focusing-primary-action]) [slot="outside-control-container"],
			:host(:not([selection-disabled]):not([skeleton])[selected][_hovering-selection]) [slot="outside-control-container"],
			:host(:not([selection-disabled]):not([skeleton])[selectable][_focusing]) [slot="outside-control-container"] {
				background-color: white;
				border-color: #b6cbe8; /* celestine alpha 0.3 */
				margin-bottom: -1px;
			}
			/* below hides the border under the d2l-button-add */
			:host([_hovering-primary-action][_show-add-button]) [slot="outside-control-container"],
			:host([_hovering-selection][_show-add-button]) [slot="outside-control-container"],
			:host([_focusing-primary-action][_show-add-button]) [slot="outside-control-container"],
			:host(:not([selection-disabled]):not([skeleton])[selected][_show-add-button]) [slot="outside-control-container"],
			:host(:not([selection-disabled]):not([skeleton])[selected][_hovering-selection][_show-add-button]) [slot="outside-control-container"],
			:host(:not([selection-disabled]):not([skeleton])[selectable][_focusing][_show-add-button]) [slot="outside-control-container"] {
				background-clip: content-box, border-box;
				background-image: linear-gradient(white, white), linear-gradient(to right, #b6cbe8 20%, transparent 20%, transparent 80%, #b6cbe8 80%);
				background-origin: border-box;
				border: double 1px transparent;
				border-radius: 6px;
			}
			:host(:not([selection-disabled]):not([skeleton])[selected][_show-add-button]) [slot="outside-control-container"] {
				background-image: linear-gradient(#f3fbff, #f3fbff), linear-gradient(to right, #b6cbe8 20%, transparent 20%, transparent 80%, #b6cbe8 80%);
			}
			:host([_hovering-primary-action]) d2l-button-add,
			:host([_hovering-selection]) d2l-button-add,
			:host([_focusing-primary-action]) d2l-button-add,
			:host(:not([selection-disabled]):not([skeleton])[selectable][_focusing]) d2l-button-add,
			:host(:not([selection-disabled]):not([skeleton])[selected]) d2l-button-add {
				--d2l-button-add-line-color: #b6cbe8;
			}
			:host([_hovering-primary-action]) [slot="outside-control-container"],
			:host([_hovering-selection]) [slot="outside-control-container"] {
				box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
			}
			:host(:not([selection-disabled]):not([skeleton])[selected]) [slot="outside-control-container"] {
				background-color: #f3fbff;
				border-color: #b6cbe8; /* celestine alpha 0.3 */
				margin-bottom: -1px;
			}

			:host(:not([selection-disabled]):not([skeleton])[padding-type="none"]) [slot="outside-control-container"] {
				border-color: transparent;
				margin: 0;
			}

			:host([_highlight]) [slot="outside-control-container"] {
				transition: background-color 400ms linear, border-color 400ms linear;
			}
			:host([_highlight]:first-of-type) [slot="control-container"]::before,
			:host([_highlight]) [slot="control-container"]::after {
				transition: border-color 400ms linear;
			}
			:host([_highlighting]) [slot="outside-control-container"],
			:host([_hovering-selection][_highlighting]) [slot="outside-control-container"],
			:host(:not([selection-disabled]):not([skeleton])[_focusing][_highlighting]) [slot="outside-control-container"],
			:host(:not([selection-disabled]):not([skeleton])[selected][_highlighting]) [slot="outside-control-container"] {
				background-color: var(--d2l-color-celestine-plus-2);
				border-color: var(--d2l-color-celestine);
			}
			:host([_highlighting]:first-of-type) [slot="control-container"]::before,
			:host([_highlighting]) [slot="control-container"]::after {
				border-color: transparent;
			}

			d2l-tooltip > div {
				font-weight: 700;
			}
			d2l-tooltip > ul {
				padding-inline-start: 1rem;
			}
			.d2l-list-item-tooltip-key {
				font-weight: 700;
			}
			:host([skeleton]) {
				pointer-events: none;
			}

			.d2l-list-item-color-inner {
				border-radius: var(--d2l-list-item-color-border-radius, 6px);
				height: 100%;
				width: var(--d2l-list-item-color-width, 6px);
			}
			.d2l-list-item-color-outer {
				padding: 2px 12px 1px 0;
			}
			:host([dir="rtl"]) .d2l-list-item-color-outer {
				padding-left: 12px;
				padding-right: 0;
			}
			:host(:not([_nested])) .d2l-list-item-content-extend-separators .d2l-list-item-color-outer {
				padding-left: 3px;
			}
			:host(:not([_nested])[dir="rtl"]) .d2l-list-item-content-extend-separators .d2l-list-item-color-outer {
				padding-left: 12px;
				padding-right: 3px;
			}
			:host([selectable]:not([_render-expand-collapse-slot])) .d2l-list-item-content-extend-separators .d2l-list-item-color-outer {
				padding-right: 0;
			}
			:host([selectable]:not([_render-expand-collapse-slot])[dir="rtl"]) .d2l-list-item-content-extend-separators .d2l-list-item-color-outer {
				padding-left: 0;
			}
			.d2l-list-item-color-outer + .d2l-list-expand-collapse {
				margin-left: -6px;
			}
			:host([dir="rtl"]) .d2l-list-item-color-outer + .d2l-list-expand-collapse {
				margin-left: 0;
				margin-right: -6px;
			}

			[slot="add"],
			[slot="add-top"] {
				margin-bottom: -6px;
				margin-top: -5px;
			}
			:host([draggable][selectable][_hovering]) [slot="add"],
			:host([draggable][selectable][_focusing]) [slot="add"] {
				padding-inline-end: 6px;
			}
			.dragging [slot="add"] {
				display: none;
			}
		`];

		super.styles && styles.unshift(super.styles);
		return styles;
	}

	constructor() {
		super();
		this.first = false;
		this.noPrimaryAction = false;
		this.paddingType = 'normal';
		this._contentId = getUniqueId();
		this._displayKeyboardTooltip = false;
		this._hasColorSlot = false;
		this._hasNestedList = false;
		this._siblingHasColor = false;
	}

	get color() {
		return this._color;
	}

	set color(value) {
		const oldValue = this._color;
		this._color = getValidHexColor(value, true);
		this.requestUpdate('value', oldValue);
		/** @ignore */
		this.dispatchEvent(new CustomEvent('d2l-list-item-property-change', { bubbles: true, composed: true, detail: { name: 'color', value: this._color } }));
	}

	connectedCallback() {
		super.connectedCallback();
		if (this.role === 'rowgroup') {
			addTabListener();
		}
		if (!this.selectable && !this.expandable) {
			this.labelRequired = false;
		}
	}

	willUpdate(changedProperties) {
		if (changedProperties.has('_siblingHasColor') || changedProperties.has('color')) {
			this._hasColorSlot = this.color || this._siblingHasColor;
		}
	}

	focus() {
		this._tryFocus();
	}

	getRootList(node) {
		if (!node) node = this;
		let rootList;
		while (node) {
			if (node.tagName === 'D2L-LIST') rootList = node;
			node = getComposedParent(node);
		}
		return rootList;
	}

	async highlight() {
		if (this._highlight) return;
		const elem = this.shadowRoot.querySelector('[slot="outside-control-container"]');
		this._highlight = true;
		await this.updateComplete;
		elem.addEventListener('transitionend', () => {
			// more than one property is being animated so this rAF waits before wiring up the return phase listener
			setTimeout(() => {
				elem.addEventListener('transitionend', () => this._highlight = false, { once: true });
				this._highlighting = false;
			}, 1000);
		}, { once: true });
		this._highlighting = true;
	}

	scrollToAndHighlight(alignToTop = true) {
		this.scrollToItem(alignToTop);
		setTimeout(() => {
			this.highlight();
		}, 1000);
	}

	scrollToItem(alignToTop = true) {
		const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
		if (reduceMotion) this.scrollIntoView(alignToTop);
		else this.scrollIntoView({ behavior: 'smooth', block: alignToTop ? 'start' : 'end' });
	}

	updateParentHasAddButon(addButton, addButtonText) {
		this._addButtonText = addButtonText;
		this._showAddButton = addButton;
	}

	updateSiblingHasColor(siblingHasColor) {
		this._siblingHasColor = siblingHasColor;
	}

	_getFlattenedListItems(listItem) {
		const listItems = new Map();
		const lazyLoadListItems = new Map();
		this._getListItems(listItems, lazyLoadListItems, listItem);
		return { listItems, lazyLoadListItems };
	}

	_getListItems(listItems, lazyLoadListItems, listItem) {
		if (!listItem) {
			const rootList = this.getRootList();
			const rootListItems = rootList.getItems();
			rootListItems.forEach(listItem => this._getListItems(listItems, lazyLoadListItems, listItem));
		} else {
			listItems.set(listItem.key, listItem);
			if (listItem.expandable && !listItem._hasNestedList) {
				lazyLoadListItems.set(listItem.key, listItem);
			}
			if (listItem._hasNestedList) {
				const nestedList = listItem._getNestedList();
				nestedList.getItems().forEach(listItem => this._getListItems(listItems, lazyLoadListItems, listItem));
			}
		}
	}

	_getNestedList() {
		if (!this.shadowRoot) return;
		const nestedSlot = this.shadowRoot.querySelector('slot[name="nested"]');
		let nestedNodes = nestedSlot.assignedNodes();
		if (nestedNodes.length === 0) {
			nestedNodes = [...nestedSlot.childNodes];
		}

		return nestedNodes.find(node => (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'D2L-LIST'));
	}

	_getNextListItemSibling() {
		let nextElement = this.nextElementSibling;
		while (nextElement) {
			if (this._isListItem(nextElement)) return nextElement;
			nextElement = nextElement.nextElementSibling;
		}
	}

	_getParentList(node) {
		if (!node) node = this;
		let parentList;
		while (parentList?.tagName !== 'D2L-LIST') {
			node = getComposedParent(node);
			if (node.tagName === 'D2L-LIST') parentList = node;
		}
		return parentList;
	}

	_getParentListItem() {
		const parentListItem = findComposedAncestor(this.parentNode, node => this._isListItem(node));
		return parentListItem;
	}

	_getPreviousListItemSibling() {
		let previousElement = this.previousElementSibling;
		while (previousElement) {
			if (this._isListItem(previousElement)) return previousElement;
			previousElement = previousElement.previousElementSibling;
		}
	}

	_handleButtonAddClick(e) {
		const position = e.target.hasAttribute('data-is-first') ? 'before' : 'after';
		/** @ignore */
		this.dispatchEvent(new CustomEvent('d2l-list-item-add-button-click', { bubbles: true, detail: { position } }));
	}

	_isListItem(node) {
		if (!node) node = this;
		return node.role === 'rowgroup' || node.role === 'listitem';
	}

	_onFocusIn() {
		this._focusing = true;
		if (this.role !== 'rowgroup' || !tabPressed || hasDisplayedKeyboardTooltip) return;
		this._displayKeyboardTooltip = true;
		hasDisplayedKeyboardTooltip = true;
	}

	_onFocusInPrimaryAction() {
		this._focusingPrimaryAction = true;
	}

	_onFocusOut() {
		this._focusing = false;
		this._displayKeyboardTooltip = false;
	}

	_onFocusOutPrimaryAction() {
		this._focusingPrimaryAction = false;
	}

	_onMouseEnter() {
		this._hovering = true;
	}

	_onMouseEnterPrimaryAction() {
		this._hoveringPrimaryAction = true;
		this._hovering = true;
	}

	_onMouseLeave() {
		this._hovering = false;
	}

	_onMouseLeavePrimaryAction() {
		this._hoveringPrimaryAction = false;
		this._hovering = false;
	}

	_onNestedSlotChange() {
		if (this.selectable) {
			this._onNestedSlotChangeCheckboxMixin();
		}
		const nestedList = this._getNestedList();
		if (this._hasNestedList !== !!nestedList) {
			this._hasNestedList = !!nestedList;
			this._hasNestedListAddButton = nestedList.hasAttribute('add-button');
			/** @ignore */
			this.dispatchEvent(new CustomEvent('d2l-list-item-nested-change', { bubbles: true, composed: true }));
		}
	}

	_renderListItem({ illustration, content, actions, nested } = {}) {
		const classes = {
			'd2l-visible-on-ancestor-target': true,
			'd2l-list-item-content-extend-separators': this._extendSeparators,
			'd2l-dragging-over': this._draggingOver
		};
		const colorStyles = {
			backgroundColor: this._hasColorSlot ? this.color : undefined
		};
		const colorClasses = {
			'd2l-list-item-color-inner': true,
			'd2l-skeletize': this.color
		};

		const alignNested = ((this.draggable && this.selectable) || (this.expandable && this.selectable && this.color)) ? 'control' : undefined;
		const primaryAction = ((!this.noPrimaryAction && this._renderPrimaryAction) ? this._renderPrimaryAction(this._contentId) : null);
		const tooltipForId = (primaryAction ? this._primaryActionId : (this.selectable ? this._checkboxId : null));
		const addButtonText = this._addButtonText || this.localize('components.list-item.addItem');
		const innerView = html`
			<d2l-list-item-generic-layout
				align-nested="${ifDefined(alignNested)}"
				@focusin="${this._onFocusIn}"
				@focusout="${this._onFocusOut}"
				class="${classMap(classes)}"
				data-separators="${ifDefined(this._separators)}"
				?grid-active="${this.role === 'rowgroup'}"
				?no-primary-action="${this.noPrimaryAction}">
				${this._showAddButton && this.first ? html`
				<div slot="add-top">
					<d2l-button-add text="${addButtonText}" mode="icon-when-interacted" @click="${this._handleButtonAddClick}" data-is-first></d2l-button-add>
				</div>
				` : nothing}
				<div slot="outside-control-container"></div>
				<div slot="before-content"></div>
				${this._renderDropTarget()}
				${this._renderDragHandle(this._renderOutsideControl)}
				${this._renderDragTarget(this.dragTargetHandleOnly ? this._renderOutsideControlHandleOnly : this._renderOutsideControlAction)}
				<div slot="control-container"></div>
				${this._hasColorSlot ? html`
				<div slot="color-indicator" class="d2l-list-item-color-outer">
					<div class="${classMap(colorClasses)}" style="${styleMap(colorStyles)}"></div>
				</div>` : nothing}
				<div slot="expand-collapse" class="d2l-list-expand-collapse" @click="${this._toggleExpandCollapse}">
					${this._renderExpandCollapse()}
				</div>
				${this.selectable ? html`<div slot="control">${this._renderCheckbox()}</div>` : nothing}
				${this.selectable || this.expandable ? html`
				<div slot="control-action"
					@mouseenter="${this._onMouseEnter}"
					@mouseleave="${this._onMouseLeave}">
						${this._renderCheckboxAction('')}
						${this._renderExpandCollapseAction()}
				</div>` : nothing }
				${primaryAction ? html`
				<div slot="content-action"
					@focusin="${this._onFocusInPrimaryAction}"
					@focusout="${this._onFocusOutPrimaryAction}"
					@mouseenter="${this._onMouseEnterPrimaryAction}"
					@mouseleave="${this._onMouseLeavePrimaryAction}">
						${primaryAction}
				</div>` : nothing}
				<div slot="content"
					class="d2l-list-item-content"
					id="${this._contentId}"
					@mouseenter="${this._onMouseEnter}"
					@mouseleave="${this._onMouseLeave}">
					<slot name="illustration" class="d2l-list-item-illustration">${illustration}</slot>
					<slot>${content}</slot>
				</div>
				<div slot="actions"
					@mouseenter="${this._onMouseEnter}"
					@mouseleave="${this._onMouseLeave}"
					class="d2l-list-item-actions-container">
					<slot name="actions" class="d2l-list-item-actions">${actions}</slot>
				</div>
				${this._showAddButton && !this._hasNestedListAddButton ? html`
				<div slot="add">
					<d2l-button-add text="${addButtonText}" mode="icon-when-interacted" @click="${this._handleButtonAddClick}"></d2l-button-add>
				</div>
				` : nothing}
				${this._renderNested(nested)}
			</d2l-list-item-generic-layout>
		`;

		return html`
			${this._renderTopPlacementMarker(html`<d2l-list-item-placement-marker></d2l-list-item-placement-marker>`)}
			${this.draggable ? html`<div class="d2l-list-item-drag-image">${innerView}</div>` : innerView}
			${this._renderBottomPlacementMarker(html`<d2l-list-item-placement-marker></d2l-list-item-placement-marker>`)}
			${this._displayKeyboardTooltip && tooltipForId ? html`<d2l-tooltip align="start" announced for="${tooltipForId}" for-type="descriptor">${this.localizeHTML('components.list.keyboard')}</d2l-tooltip>` : ''}
		`;

	}

	_renderNested(nested) {
		const nestedSlot = html`<slot name="nested" @slotchange="${this._onNestedSlotChange}">${nested}</slot>`;
		return html`
			<div slot="nested" @d2l-selection-provider-connected="${this._onSelectionProviderConnected}">
				${this.expandable ? html`<d2l-expand-collapse-content ?expanded="${this.expanded}">${this._renderNestedLoadingSpinner()}${nestedSlot}</d2l-expand-collapse-content>` : nestedSlot}
			</div>
		`;
	}

	_renderOutsideControl(dragHandle) {
		return html`<div slot="outside-control">${dragHandle}</div>`;
	}

	_renderOutsideControlAction(dragTarget) {
		return html`<div slot="outside-control-action" @mouseenter="${this._onMouseEnter}" @mouseleave="${this._onMouseLeave}">${dragTarget}</div>`;
	}

	_renderOutsideControlHandleOnly(dragHandle) {
		return html`<div slot="outside-control" class="handle-only" @mouseenter="${this._onMouseEnter}" @mouseleave="${this._onMouseLeave}">${dragHandle}</div>`;
	}

	_tryFocus() {
		const node = getFirstFocusableDescendant(this);
		if (!node) return false;
		node.focus();
		return true;
	}

};
