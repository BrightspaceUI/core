import '../colors/colors.js';
import './list-item-generic-layout.js';
import './list-item-placement-marker.js';
import { css, html } from 'lit-element/lit-element.js';
import { classMap } from 'lit-html/directives/class-map.js';
import { getFirstFocusableDescendant } from '../../helpers/focus.js';
import { getUniqueId } from '../../helpers/uniqueId.js';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { ListItemCheckboxMixin } from './list-item-checkbox-mixin.js';
import { ListItemDragDropMixin } from './list-item-drag-drop-mixin.js';
import { ListItemRoleMixin } from './list-item-role-mixin.js';
import { nothing } from 'lit-html';
import ResizeObserver from 'resize-observer-polyfill';
import { RtlMixin } from '../../mixins/rtl-mixin.js';

const ro = new ResizeObserver(entries => {
	entries.forEach(entry => {
		if (!entry || !entry.target || !entry.target.resizedCallback) {
			return;
		}
		entry.target.resizedCallback(entry.contentRect && entry.contentRect.width);
	});
});

const defaultBreakpoints = [842, 636, 580, 0];

export const ListItemMixin = superclass => class extends ListItemDragDropMixin(ListItemCheckboxMixin(ListItemRoleMixin(RtlMixin(superclass)))) {

	static get properties() {
		return {
			/**
			 * Breakpoints for responsiveness in pixels. There are four different breakpoints and only the four largest breakpoints will be used.
			 */
			breakpoints: { type: Array },
			_breakpoint: { type: Number },
			_dropdownOpen: { type: Boolean, attribute: '_dropdown-open', reflect: true },
			_hoveringPrimaryAction: { type: Boolean },
			_focusing: { type: Boolean },
			_focusingPrimaryAction: { type: Boolean },
			_tooltipShowing: { type: Boolean, attribute: '_tooltip-showing', reflect: true }
		};
	}

	static get styles() {

		const styles = [ css`
			:host {
				display: block;
				margin-top: -1px;
				position: relative;
			}
			:host[hidden] {
				display: none;
			}
			:host([_tooltip-showing]),
			:host([_dropdown-open]) {
				z-index: 10;
			}
			:host(:first-child) d2l-list-item-generic-layout[data-separators="between"] {
				border-top: 1px solid transparent;
			}
			:host(:last-child) d2l-list-item-generic-layout[data-separators="between"] {
				border-bottom: 1px solid transparent;
			}
			:host([dragging]) d2l-list-item-generic-layout {
				filter: grayscale(75%);
				opacity: 0.4;
			}
			:host([draggable]) .d2l-list-item-drag-image {
				transform: rotate(-1deg);
			}
			:host([draggable]) d2l-list-item-generic-layout {
				transform: rotate(1deg);
			}
			d2l-list-item-generic-layout {
				background: white;
				border-bottom: 1px solid var(--d2l-color-mica);
				border-top: 1px solid var(--d2l-color-mica);
			}
			d2l-list-item-generic-layout[data-separators="none"] {
				border-bottom: 1px solid transparent;
				border-top: 1px solid transparent;
			}
			[slot="content"].d2l-list-item-content-extend-separators {
				padding-left: 0.9rem;
				padding-right: 0.9rem;
			}
			.d2l-list-item-content ::slotted(*) {
				margin-top: 0.05rem;
			}
			.d2l-list-item-content.d2l-hovering,
			.d2l-list-item-content.d2l-focusing {
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
				padding: 0.55rem 0;
			}
			[slot="content"] ::slotted([slot="illustration"]),
			[slot="content"] .d2l-list-item-illustration * {
				border-radius: 6px;
				flex-grow: 0;
				flex-shrink: 0;
				margin: 0.15rem 0.9rem 0.15rem 0;
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
				margin: 0.15rem 0;
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
			input[type="checkbox"].d2l-input-checkbox {
				margin: 1.15rem 0.9rem 1.15rem 0;
			}
			d2l-list-item-drag-handle {
				margin: 0.8rem 0 0.8rem 0.4rem;
			}
			:host([dir="rtl"]) input[type="checkbox"].d2l-input-checkbox {
				margin-left: 0.9rem;
				margin-right: 0;
			}
			:host([selectable]:not([disabled]):not([draggable]):not([skeleton]):hover) d2l-list-item-generic-layout,
			:host([selectable]:not([disabled]):not([skeleton])) d2l-list-item-generic-layout.d2l-focusing,
			:host([selectable][draggable]:not([disabled]):not([skeleton])) d2l-list-item-generic-layout.d2l-hovering {
				background-color: var(--d2l-color-regolith);
			}
			:host([selected]:not([disabled])) d2l-list-item-generic-layout {
				background-color: #f3fbff;
			}
			:host([selected]:not([disabled])) d2l-list-item-generic-layout,
			:host([selected]:not([disabled])) d2l-list-item-generic-layout.d2l-focusing {
				border-color: #79b5df;
			}
			:host([selected]:not([disabled])) .d2l-list-item-active-border,
			:host([selected]:not([disabled])) d2l-list-item-generic-layout.d2l-focusing + .d2l-list-item-active-border {
				background: #79b5df;
				bottom: 0;
				height: 1px;
				position: absolute;
				width: 100%;
				z-index: 5;
			}
			:host([draggable][selected]:not([disabled])) .d2l-list-item-active-border,
			:host([draggable][selected]:not([disabled])) d2l-list-item-generic-layout.d2l-focusing + .d2l-list-item-active-border {
				transform: rotate(1deg);
			}
		`];

		super.styles && styles.unshift(super.styles);
		return styles;
	}

	constructor() {
		super();
		this._breakpoint = 0;
		this.breakpoints = defaultBreakpoints;
		this._contentId = getUniqueId();
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
		if (changedProperties.has('breakpoints')) {
			this.resizedCallback(this.offsetWidth);
		}
	}

	focus() {
		const node = getFirstFocusableDescendant(this);
		if (node) node.focus();
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

	_onFocusIn() {
		this._focusing = true;
	}

	_onFocusInPrimaryAction() {
		this._focusingPrimaryAction = true;
	}

	_onFocusOut() {
		this._focusing = false;
	}

	_onFocusOutPrimaryAction() {
		this._focusingPrimaryAction = false;
	}

	_onMouseEnterPrimaryAction() {
		this._hoveringPrimaryAction = true;
	}

	_onMouseLeavePrimaryAction() {
		this._hoveringPrimaryAction = false;
	}

	_renderListItem({ illustration, content, actions } = {}) {
		const classes = {
			'd2l-visible-on-ancestor-target': true,
			'd2l-focusing': this._focusing,
			'd2l-hovering': this._hovering,
		};
		const contentClasses = {
			'd2l-list-item-content': true,
			'd2l-list-item-content-extend-separators': this._extendSeparators,
			'd2l-hovering': this._hoveringPrimaryAction,
			'd2l-focusing': this._focusingPrimaryAction,
		};

		const primaryAction = this._renderPrimaryAction ? this._renderPrimaryAction(this._contentId) : null;

		return html`
			${this._renderTopPlacementMarker(html`<d2l-list-item-placement-marker></d2l-list-item-placement-marker>`)}
			${this._renderDropTarget()}
			<div class="d2l-list-item-drag-image">
				<d2l-list-item-generic-layout
					@focusin="${this._onFocusIn}"
					@focusout="${this._onFocusOut}"
					class="${classMap(classes)}"
					data-breakpoint="${this._breakpoint}"
					data-separators="${ifDefined(this._separators)}"
					?grid-active="${this.role === 'rowgroup'}">
					${this._renderDragHandle(this._renderOutsideControl)}
					${this._renderDragTarget(this._renderOutsideControlAction)}
					${this.selectable ? html`
					<div slot="control">${ this._renderCheckbox() }</div>
					<div slot="control-action">${ this._renderCheckboxAction('', this._contentId) }</div>` : nothing }
					${primaryAction ? html`
					<div slot="content-action"
						@focusin="${this._onFocusInPrimaryAction}"
						@focusout="${this._onFocusOutPrimaryAction}"
						@mouseenter="${this._onMouseEnterPrimaryAction}"
						@mouseleave="${this._onMouseLeavePrimaryAction}">
							${primaryAction}
					</div>` : nothing}
					<div slot="content"
						class="${classMap(contentClasses)}"
						id="${this._contentId}">
						<slot name="illustration" class="d2l-list-item-illustration">${illustration}</slot>
						<slot>${content}</slot>
					</div>
					<div class="d2l-list-item-actions-container" slot="actions">
						<slot name="actions" class="d2l-list-item-actions">${actions}</slot>
					</div>
				</d2l-list-item-generic-layout>
				<div class="d2l-list-item-active-border"></div>
			</div>
			${this._renderBottomPlacementMarker(html`<d2l-list-item-placement-marker></d2l-list-item-placement-marker>`)}
		`;

	}

	_renderOutsideControl(dragHandle) {
		return html`<div slot="outside-control">${dragHandle}</div>`;
	}

	_renderOutsideControlAction(dragTarget) {
		return html`<div slot="outside-control-action">${dragTarget}</div>`;
	}

};
