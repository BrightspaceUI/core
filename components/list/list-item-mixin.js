import '../colors/colors.js';
import './list-item-generic-layout.js';
import './list-item-placement-marker.js';
import '../tooltip/tooltip.js';
import { css, html, nothing } from 'lit';
import { findComposedAncestor, getComposedParent } from '../../helpers/dom.js';
import { classMap } from 'lit/directives/class-map.js';
import { getFirstFocusableDescendant } from '../../helpers/focus.js';
import { getUniqueId } from '../../helpers/uniqueId.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { ListItemCheckboxMixin } from './list-item-checkbox-mixin.js';
import { ListItemDragDropMixin } from './list-item-drag-drop-mixin.js';
import { ListItemRoleMixin } from './list-item-role-mixin.js';
import { LocalizeCoreElement } from '../../helpers/localize-core-element.js';
import ResizeObserver from 'resize-observer-polyfill';
import { RtlMixin } from '../../mixins/rtl-mixin.js';

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

const ro = new ResizeObserver(entries => {
	entries.forEach(entry => {
		if (!entry || !entry.target || !entry.target.resizedCallback) {
			return;
		}
		entry.target.resizedCallback(entry.contentRect && entry.contentRect.width);
	});
});

const defaultBreakpoints = [842, 636, 580, 0];

export const ListItemMixin = superclass => class extends LocalizeCoreElement(ListItemDragDropMixin(ListItemCheckboxMixin(ListItemRoleMixin(RtlMixin(superclass))))) {

	static get properties() {
		return {
			/**
			 * Breakpoints for responsiveness in pixels. There are four different breakpoints and only the four largest breakpoints will be used.
			 * @type {array}
			 */
			breakpoints: { type: Array },
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
			_breakpoint: { type: Number },
			_displayKeyboardTooltip: { type: Boolean },
			_dropdownOpen: { type: Boolean, attribute: '_dropdown-open', reflect: true },
			_fullscreenWithin: { type: Boolean, attribute: '_fullscreen-within', reflect: true },
			_hovering: { type: Boolean, reflect: true },
			_hoveringPrimaryAction: { type: Boolean, attribute: '_hovering-primary-action', reflect: true },
			_focusing: { type: Boolean, reflect: true },
			_focusingPrimaryAction: { type: Boolean, attribute: '_focusing-primary-action', reflect: true },
			_highlight: { type: Boolean, reflect: true },
			_highlighting: { type: Boolean, reflect: true },
			_tooltipShowing: { type: Boolean, attribute: '_tooltip-showing', reflect: true }
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

			:host([_tooltip-showing]),
			:host([_dropdown-open]) {
				z-index: 10; /* must be greater than adjacent selected items */
			}
			:host([_fullscreen-within]) {
				position: fixed; /* required for Safari */
				z-index: 1000; /* must be greater than floating workflow buttons */
			}

			:host([dragging]) d2l-list-item-generic-layout {
				filter: grayscale(75%);
				opacity: 0.4;
			}
			:host([dragging]) .d2l-list-item-drag-image {
				background: white;
			}

			[slot="control-container"] {
				position: relative;
				z-index: -1; /* must allow for interactive content to be accessible with mouse */
			}
			:host(:first-of-type) [slot="control-container"]::before,
			[slot="control-container"]::after {
				border-top: 1px solid var(--d2l-color-mica);
				content: "";
				position: absolute;
				width: 100%;
			}
			:host(:first-of-type) [slot="control-container"]::before {
				top: 0;
			}
			[slot="control-container"]::after {
				bottom: -2px;
			}

			:host(:first-of-type[_separators="between"]) [slot="control-container"]::before,
			:host(:last-of-type[_separators="between"]) [slot="control-container"]::after,
			:host([_separators="none"]) [slot="control-container"]::before,
			:host([_separators="none"]) [slot="control-container"]::after,
			:host([selectable][_hovering]) [slot="control-container"]::before,
			:host([selectable][_hovering]) [slot="control-container"]::after,
			:host([selectable][_focusing]) [slot="control-container"]::before,
			:host([selectable][_focusing]) [slot="control-container"]::after,
			:host([selected]) [slot="control-container"]::before,
			:host([selected]) [slot="control-container"]::after,
			:host(:first-of-type[_nested]) [slot="control-container"]::before {
				border-top-color: transparent;
			}

			:host([padding-type="none"]) d2l-list-item-generic-layout {
				border-bottom: 0;
				border-top: 0;
			}

			.d2l-list-item-content-extend-separators > [slot="control"] {
				width: 3rem;
			}
			.d2l-list-item-content-extend-separators > [slot="content"] {
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
			[slot="content"] .d2l-list-item-illustration * {
				border-radius: 6px;
				flex-grow: 0;
				flex-shrink: 0;
				margin-right: 0.9rem;
				max-height: 2.6rem;
				max-width: 4.5rem;
				overflow: hidden;
			}
			:host([dir="rtl"]) [slot="content"] ::slotted([slot="illustration"]),
			:host([dir="rtl"]) [slot="content"] .d2l-list-item-illustration * {
				margin-left: 0.9rem;
				margin-right: 0;
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
			.d2l-list-item-actions * {
				display: grid;
				gap: 0.3rem;
				grid-auto-columns: 1fr;
				grid-auto-flow: column;
			}

			.d2l-list-item-content-extend-separators ::slotted([slot="actions"]),
			.d2l-list-item-content-extend-separators .d2l-list-item-actions * {
				margin-right: 0.9rem;
			}
			:host([dir="rtl"]) .d2l-list-item-content-extend-separators ::slotted([slot="actions"]),
			:host([dir="rtl"]) .d2l-list-item-content-extend-separators .d2l-list-item-actions * {
				margin-left: 0.9rem;
				margin-right: 0;
			}

			[data-breakpoint="1"] ::slotted([slot="illustration"]),
			[data-breakpoint="1"] .d2l-list-item-illustration * {
				margin-right: 1rem;
				max-height: 3.55rem;
				max-width: 6rem;
			}
			:host([dir="rtl"]) [data-breakpoint="1"] ::slotted([slot="illustration"]),
			:host([dir="rtl"]) [data-breakpoint="1"] .d2l-list-item-illustration * {
				margin-left: 1rem;
				margin-right: 0;
			}
			[data-breakpoint="2"] ::slotted([slot="illustration"]),
			[data-breakpoint="2"] .d2l-list-item-illustration * {
				margin-right: 1rem;
				max-height: 5.1rem;
				max-width: 9rem;
			}
			:host([dir="rtl"]) [data-breakpoint="2"] ::slotted([slot="illustration"]),
			:host([dir="rtl"]) [data-breakpoint="2"] .d2l-list-item-illustration * {
				margin-left: 1rem;
				margin-right: 0;
			}
			[data-breakpoint="3"] ::slotted([slot="illustration"]),
			[data-breakpoint="3"] .d2l-list-item-illustration * {
				margin-right: 1rem;
				max-height: 6rem;
				max-width: 10.8rem;
			}
			:host([dir="rtl"]) [data-breakpoint="3"] ::slotted([slot="illustration"]),
			:host([dir="rtl"]) [data-breakpoint="3"] .d2l-list-item-illustration * {
				margin-left: 1rem;
				margin-right: 0;
			}
			d2l-selection-input {
				margin: 0.55rem 0.9rem 0.55rem 0;
			}
			.d2l-list-item-content-extend-separators d2l-selection-input {
				margin-left: 0.9rem;
			}
			d2l-list-item-drag-handle {
				margin: 0.25rem 0 0.25rem 0.4rem;
			}
			:host([dir="rtl"]) d2l-selection-input {
				margin-left: 0.9rem;
				margin-right: 0;
			}
			:host([dir="rtl"]) .d2l-list-item-content-extend-separators d2l-selection-input {
				margin-right: 0.9rem;
			}

			[slot="outside-control-container"] {
				border: 1px solid transparent;
				border-radius: 6px;
				margin: 0 -12px;
			}
			.d2l-list-item-content-extend-separators [slot="outside-control-container"] {
				border-left: none;
				border-radius: 0;
				border-right: none;
			}
			:host([draggable]) [slot="outside-control-container"],
			.d2l-list-item-content-extend-separators [slot="outside-control-container"] {
				margin: 0;
			}

			:host(:not([disabled]):not([skeleton])[selected]) [slot="outside-control-container"],
			:host(:not([disabled]):not([skeleton])[selectable][_hovering]) [slot="outside-control-container"],
			:host(:not([disabled]):not([skeleton])[selectable][_focusing]) [slot="outside-control-container"] {
				background-color: white;
				border-color: #b6cbe8; /* celestine alpha 0.3 */
			}
			:host(:not([disabled]):not([skeleton])[selectable][_hovering]) [slot="outside-control-container"] {
				box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
			}
			:host(:not([disabled]):not([skeleton])[selected]) [slot="outside-control-container"] {
				background-color: #f3fbff;
			}

			:host(:not([disabled]):not([skeleton])[padding-type="none"]) [slot="outside-control-container"] {
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
			:host(:not([disabled]):not([skeleton])[_hovering][_highlighting]) [slot="outside-control-container"],
			:host(:not([disabled]):not([skeleton])[_focusing][_highlighting]) [slot="outside-control-container"],
			:host(:not([disabled]):not([skeleton])[selected][_highlighting]) [slot="outside-control-container"] {
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

		`];

		super.styles && styles.unshift(super.styles);
		return styles;
	}

	constructor() {
		super();
		this.breakpoints = defaultBreakpoints;
		this.noPrimaryAction = false;
		this.paddingType = 'normal';
		this._breakpoint = 0;
		this._contentId = getUniqueId();
		this._displayKeyboardTooltip = false;
		this._fullscreenWithin = false;
		this._fullscreenWithinCount = 0;
	}

	get breakpoints() {
		return this._breakpoints;
	}

	set breakpoints(value) {
		const oldValue = this._breakpoints;
		if (value !== defaultBreakpoints) this._breakpoints = value.sort((a, b) => b - a).slice(0, 4);
		else this._breakpoints = defaultBreakpoints;
		this.requestUpdate('breakpoints', oldValue);
	}

	connectedCallback() {
		super.connectedCallback();
		ro.observe(this);
		if (this.role === 'rowgroup') {
			addTabListener();
		}
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		ro.unobserve(this);
	}

	firstUpdated(changedProperties) {
		this.addEventListener('d2l-dropdown-open', () => this._dropdownOpen = true);
		this.addEventListener('d2l-dropdown-close', () => this._dropdownOpen = false);
		this.addEventListener('d2l-tooltip-show', () => this._tooltipShowing = true);
		this.addEventListener('d2l-tooltip-hide', () => this._tooltipShowing = false);
		super.firstUpdated(changedProperties);
	}

	updated(changedProperties) {
		super.updated(changedProperties);
		if (changedProperties.has('breakpoints')) {
			this.resizedCallback(this.offsetWidth);
		}
	}

	focus() {
		this._tryFocus();
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

	resizedCallback(width) {
		const lastBreakpointIndexToCheck = 3;
		this.breakpoints.some((breakpoint, index) => {
			if (width >= breakpoint || index > lastBreakpointIndexToCheck) {
				this._breakpoint = lastBreakpointIndexToCheck - index - (lastBreakpointIndexToCheck - this.breakpoints.length + 1) * index;
				return true;
			}
		});
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

	_getRootList(node) {
		if (!node) node = this;
		let rootList;
		while (node) {
			if (node.tagName === 'D2L-LIST') rootList = node;
			node = getComposedParent(node);
		}
		return rootList;
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

	_onFullscreenWithin(e) {
		if (e.detail.state) this._fullscreenWithinCount += 1;
		else this._fullscreenWithinCount -= 1;
		this._fullscreenWithin = (this._fullscreenWithinCount > 0);
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

	_renderListItem({ illustration, content, actions, nested } = {}) {
		const classes = {
			'd2l-visible-on-ancestor-target': true,
			'd2l-list-item-content-extend-separators': this._extendSeparators,
			'd2l-dragging-over': this._draggingOver
		};

		const primaryAction = ((!this.noPrimaryAction && this._renderPrimaryAction) ? this._renderPrimaryAction(this._contentId) : null);
		const tooltipForId = (primaryAction ? this._primaryActionId : (this.selectable ? this._checkboxId : null));

		const innerView = html`
			<d2l-list-item-generic-layout
				align-nested="${ifDefined(this.draggable && this.selectable ? 'control' : undefined)}"
				@focusin="${this._onFocusIn}"
				@focusout="${this._onFocusOut}"
				@d2l-fullscreen-within="${this._onFullscreenWithin}"
				class="${classMap(classes)}"
				data-breakpoint="${this._breakpoint}"
				data-separators="${ifDefined(this._separators)}"
				?grid-active="${this.role === 'rowgroup'}"
				?no-primary-action="${this.noPrimaryAction}">
				<div slot="outside-control-container"></div>
				${this._renderDropTarget()}
				${this._renderDragHandle(this._renderOutsideControl)}
				${this._renderDragTarget(this.dragTargetHandleOnly ? this._renderOutsideControlHandleOnly : this._renderOutsideControlAction)}
				<div slot="control-container"></div>
				${this.selectable ? html`
				<div slot="control">${this._renderCheckbox()}</div>
				<div slot="control-action"
					@mouseenter="${this._onMouseEnter}"
					@mouseleave="${this._onMouseLeave}">
						${this._renderCheckboxAction('')}
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
					id="${this._contentId}">
					<slot name="illustration" class="d2l-list-item-illustration">${illustration}</slot>
					<slot>${content}</slot>
				</div>
				<div slot="actions"
					@mouseenter="${this._onMouseEnter}"
					@mouseleave="${this._onMouseLeave}"
					class="d2l-list-item-actions-container">
					<slot name="actions" class="d2l-list-item-actions">${actions}</slot>
				</div>
				<!--<button slot="add-after-1">add item</button>-->
				<button slot="add-after-2">add item</button>
				<div slot="nested" @d2l-selection-provider-connected="${this._onSelectionProviderConnected}">
					<slot name="nested" @slotchange="${this._onNestedSlotChange}">${nested}</slot>
				</div>
			</d2l-list-item-generic-layout>
		`;

		return html`
			${this._renderTopPlacementMarker(html`<d2l-list-item-placement-marker></d2l-list-item-placement-marker>`)}
			${this.draggable ? html`<div class="d2l-list-item-drag-image">${innerView}</div>` : innerView}
			${this._renderBottomPlacementMarker(html`<d2l-list-item-placement-marker></d2l-list-item-placement-marker>`)}
			${this._displayKeyboardTooltip && tooltipForId ? html`<d2l-tooltip align="start" announced for="${tooltipForId}" for-type="descriptor">${this._renderTooltipContent()}</d2l-tooltip>` : ''}
		`;

	}

	_renderOutsideControl(dragHandle) {
		return html`<div slot="outside-control">${dragHandle}</div>`;
	}

	_renderOutsideControlAction(dragTarget) {
		return html`<div slot="outside-control-action" @mouseenter="${this._onMouseEnter}" @mouseleave="${this._onMouseLeave}">${dragTarget}</div>`;
	}

	_renderOutsideControlHandleOnly(dragHandle) {
		return html`<div slot="outside-control" @mouseenter="${this._onMouseEnter}" @mouseleave="${this._onMouseLeave}">${dragHandle}</div>`;
	}

	_renderTooltipContent() {
		return html`
			<div>${this.localize('components.list-item-tooltip.title')}</div>
			<ul>
				<li><span class="d2l-list-item-tooltip-key">${this.localize('components.list-item-tooltip.enter-key')}</span> - ${this.localize('components.list-item-tooltip.enter-desc')}</li>
				<li><span class="d2l-list-item-tooltip-key">${this.localize('components.list-item-tooltip.up-down-key')}</span> - ${this.localize('components.list-item-tooltip.up-down-desc')}</li>
				<li><span class="d2l-list-item-tooltip-key">${this.localize('components.list-item-tooltip.left-right-key')}</span> - ${this.localize('components.list-item-tooltip.left-right-desc')}</li>
				<li><span class="d2l-list-item-tooltip-key">${this.localize('components.list-item-tooltip.page-up-down-key')}</span> - ${this.localize('components.list-item-tooltip.page-up-down-desc')}</li>
			</ul>
		`;
	}

	_tryFocus() {
		const node = getFirstFocusableDescendant(this);
		if (!node) return false;
		node.focus();
		return true;
	}

};
