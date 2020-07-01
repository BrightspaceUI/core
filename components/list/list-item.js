import '../colors/colors.js';
import './list-item-generic-layout.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { classMap } from 'lit-html/directives/class-map.js';
import { getFirstFocusableDescendant } from '../../helpers/focus.js';
import { getUniqueId } from '../../helpers/uniqueId.js';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { ListItemCheckboxMixin } from './list-item-checkbox-mixin.js';
import { ListItemMixin } from './list-item-mixin.js';
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

/**
 * A component for a "listitem" child within a list. It provides semantics, basic layout, breakpoints for responsiveness, a link for navigation, and selection.
 * @slot - Default content placed inside of the component
 * @slot illustration - Image associated with the list item located at the left of the item
 * @slot actions - Actions (e.g., button icons) associated with the listen item located at the right of the item
 * @fires d2l-list-item-selected - Dispatched when the component item is selected
 */
class ListItem extends ListItemCheckboxMixin(ListItemMixin(RtlMixin(LitElement))) {

	static get properties() {
		return {
			/**
			 * Breakpoints for responsiveness in pixels. There are four different breakpoints and only the four largest breakpoints will be used.
			 */
			breakpoints: { type: Array },
			/**
			 * Indicates a drag handle should be rendered for reordering an item
			 */
			draggable: { type: Boolean },
			/**
			 * Address of item link if navigable
			 */
			href: { type: String },
			_breakpoint: { type: Number },
			_hoveringLink: { type: Boolean },
			_focusing: { type: Boolean },
			_focusingLink: { type: Boolean }
		};
	}

	static get styles() {

		return [ super.styles, css`
			:host {
				display: block;
				position: relative;
				margin-top: -1px;
			}
			:host[hidden] {
				display: none;
			}
			:host([href]) {
				--d2l-list-item-content-text-color: var(--d2l-color-celestine);
			}
			:host(:first-child) d2l-list-item-generic-layout[data-separators="between"] {
				border-top: 1px solid transparent;
			}
			:host(:last-child) d2l-list-item-generic-layout[data-separators="between"] {
				border-bottom: 1px solid transparent;
			}
			d2l-list-item-generic-layout[data-separators="none"] {
				border-top: 1px solid transparent;
				border-bottom: 1px solid transparent;
			}
			d2l-list-item-generic-layout {
				position: relative;
				border-bottom: 1px solid transparent;
				border-bottom: 1px solid var(--d2l-color-mica);
				border-top: 1px solid var(--d2l-color-mica);
			}
			[slot="content"].d2l-list-item-content-extend-separators {
				padding-left: 0.9rem;
				padding-right: 0.9rem;
			}
			a[href].d2l-list-item-link {
				width: 100%;
				height: 100%;
			}
			.d2l-list-item-content ::slotted(*) {
				margin-top: 0.05rem;
			}
			.d2l-list-item-content.hovering,
			.d2l-list-item-content.focusing {
				--d2l-list-item-content-text-decoration: underline;
			}
			[slot="content-action"]:focus {
				outline: none;
			}
			[slot="content"] {
				justify-content: stretch;
				padding: 0.55rem 0px;
				display: flex;
			}
			[slot="content"] ::slotted([slot="illustration"]) {
				margin: 0.15rem 0.9rem 0.15rem 0;
				max-height: 2.6rem;
				max-width: 4.5rem;
				border-radius: 6px;
				overflow: hidden;
				flex-grow: 0;
				flex-shrink: 0;
			}
			:host([dir="rtl"]) [slot="content"] ::slotted([slot="illustration"]) {
				margin-left: 0.9rem;
				margin-right: 0;
			}
			.d2l-list-item-actions-container {
				padding: 0.55rem 0;
			}
			::slotted([slot="actions"]) {
				display: grid;
				grid-auto-columns: 1fr;
				grid-auto-flow: column;
				gap: 0.3rem;
				margin: 0.15rem 0;
			}

			[data-breakpoint="1"] ::slotted([slot="illustration"]),
			[data-breakpoint="1"] .d2l-list-item-content-flex ::slotted([slot="illustration"]) {
				margin-right: 1rem;
				max-height: 3.55rem;
				max-width: 6rem;
			}
			:host([dir="rtl"]) [data-breakpoint="1"] ::slotted([slot="illustration"]) {
				margin-left: 1rem;
				margin-right: 0;
			}
			[data-breakpoint="2"] ::slotted([slot="illustration"]) {
				margin-right: 1rem;
				max-height: 5.1rem;
				max-width: 9rem;
			}
			:host([dir="rtl"]) [data-breakpoint="2"] ::slotted([slot="illustration"]) {
				margin-left: 1rem;
				margin-right: 0;
			}
			[data-breakpoint="3"] ::slotted([slot="illustration"]) {
				margin-right: 1rem;
				max-height: 6rem;
				max-width: 10.8rem;
			}
			:host([dir="rtl"]) [data-breakpoint="3"] ::slotted([slot="illustration"]) {
				margin-left: 1rem;
				margin-right: 0;
			}
			input[type="checkbox"].d2l-input-checkbox {
				margin: 1.15rem 0.9rem 1.15rem 0;
			}
			:host([dir="rtl"]) input[type="checkbox"].d2l-input-checkbox {
				margin-left: 0.9rem;
				margin-right: 0;
			}
			:host([selectable]:not([disabled]):hover) d2l-list-item-generic-layout,
			:host([selectable]:not([disabled])) d2l-list-item-generic-layout.focusing {
				background-color: var(--d2l-color-regolith);
			}
			:host([selected]:not([disabled])) d2l-list-item-generic-layout {
				background-color: #F3FBFF;
			}
			:host([selected]:not([disabled])) d2l-list-item-generic-layout,
			:host([selected]:not([disabled])) d2l-list-item-generic-layout.focusing {
				border-color: #79B5DF;
			}
			:host([selected]:not([disabled])) .d2l-list-item-active-border,
			:host([selected]:not([disabled])) d2l-list-item-generic-layout.focusing + .d2l-list-item-active-border {
				position: absolute;
				width: 100%;
				bottom: 0;
				height: 1px;
				z-index: 5;
				background: #79B5DF;
			}

		`];
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

	render() {
		const classes = {
			'd2l-visible-on-ancestor-target': true,
			'focusing': this._focusing,
		};
		const contentClasses = {
			'd2l-list-item-content': true,
			'd2l-list-item-content-extend-separators': this._extendSeparators,
			'hovering': this._hoveringLink,
			'focusing': this._focusingLink,
		};

		return html`
			<d2l-list-item-generic-layout
				@focusin="${this._handleFocusIn}"
				@focusout="${this._handleFocusOut}"
				class="${classMap(classes)}"
				data-breakpoint="${this._breakpoint}"
				data-separators="${ifDefined(this._separators)}"
				?grid-active="${this.role === 'rowgroup'}">
				${ this.draggable ? html`
				<div slot="outside-control"></div>
				` : nothing }
				${this.selectable ? html`
				<div slot="control">
					${ this._renderCheckbox() }
				</div>
				<div slot="control-action">${ this._renderCheckboxAction('', this._contentId) }</div>
				` : nothing }
				${ this.href ? html`
				<a slot="content-action"
					href="${this.href}"
					aria-labelledby="${this._contentId}"
					@mouseenter="${this._handleMouseEnterLink}"
					@mouseleave="${this._handleMouseLeaveLink}"
					@focus="${this._handleFocusLink}"
					@blur="${this._handleBlurLink}"></a>
				` : nothing }
				<div slot="content"
					class="${classMap(contentClasses)}"
					id="${this._contentId}">
					<slot name="illustration"></slot>
					<slot></slot>
				</div>

				<div class="d2l-list-item-actions-container" slot="actions">
					<slot name="actions"></slot>
				</div>
			</d2l-list-item-generic-layout>
			<div class="d2l-list-item-active-border"></div>
		`;

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

	_handleBlurLink() {
		this._focusingLink = false;
	}

	_handleFocusIn() {
		this._focusing = true;
	}

	_handleFocusLink() {
		this._focusingLink = true;
	}

	_handleFocusOut() {
		this._focusing = false;
	}

	_handleMouseEnterLink() {
		this._hoveringLink = true;
	}

	_handleMouseLeaveLink() {
		this._hoveringLink = false;
	}

}

customElements.define('d2l-list-item', ListItem);
