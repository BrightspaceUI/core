import '../colors/colors.js';
import './list-item-generic-layout.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { checkboxStyles } from '../inputs/input-checkbox-styles.js';
import { classMap } from 'lit-html/directives/class-map.js';
import { findComposedAncestor } from '../../helpers/dom.js';
import { getFirstFocusableDescendant } from '../../helpers/focus.js';
import { getUniqueId } from '../../helpers/uniqueId.js';
import { ifDefined } from 'lit-html/directives/if-defined.js';
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
class ListItem extends RtlMixin(LitElement) {

	static get properties() {
		return {
			/**
			 * Breakpoints for responsiveness in pixels. There are four different breakpoints and only the four largest breakpoints will be used.
			 */
			breakpoints: { type: Array },
			/**
			 * Disables the checkbox
			 */
			disabled: {type: Boolean },
			/**
			 * Indicates a drag handle should be rendered for reordering an item
			 */
			draggable: { type: Boolean },
			/**
			 * Address of item link if navigable
			 */
			href: { type: String },
			/**
			 * Value to identify item if selectable
			 */
			key: { type: String, reflect: true },
			/**
			 * @ignore
			 */
			role: { type: String, reflect: true },
			/**
			 * Indicates a checkbox should be rendered for selecting the item
			 */
			selectable: {type: Boolean },
			/**
			 * Whether the item is selected
			 */
			selected: { type: Boolean, reflect: true },
			_breakpoint: { type: Number },
			_hovering: { type: Boolean },
			_focusing: { type: Boolean }
		};
	}

	static get styles() {

		return [ checkboxStyles, css`
			:host {
				display: block;
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
		`];
	}

	constructor() {
		super();
		this._breakpoint = 0;
		this.breakpoints = defaultBreakpoints;
		this.disabled = false;
		this.selected = false;
		this.selectable = false;
		this._contentId = getUniqueId();
		this._checkBoxId = getUniqueId();
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

		const parent = findComposedAncestor(this.parentNode, (node) => {
			if (!node || node.nodeType !== 1) return false;
			return node.tagName === 'D2L-LIST';
		});
		if (parent !== null) {
			const separators = parent.getAttribute('separators');
			if (separators) this._separators = separators;
			this._extendSeparators = parent.hasAttribute('extend-separators');
		}

		ro.observe(this);
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		ro.unobserve(this);
	}

	render() {
		const classes = {
			'd2l-visible-on-ancestor-target': true
		};
		const contentClasses = {
			'd2l-list-item-content': true,
			'd2l-list-item-content-extend-separators': this._extendSeparators,
			'hovering': this._hovering,
			'focusing': this._focusing,
		};

		return html`
			<d2l-list-item-generic-layout
				class="${classMap(classes)}"
				data-breakpoint="${this._breakpoint}"
				data-separators="${ifDefined(this._separators)}"
				?grid-active="${this.role === 'rowgroup'}">
				${ this.draggable ? html`
				<div slot="outside-control"></div>
				` : nothing }
				${this.selectable ? html`
				<div slot="control">
					<input id="${this._checkBoxId}" class="d2l-input-checkbox" @change="${this._handleCheckboxChange}" type="checkbox" .checked="${this.selected}" ?disabled="${this.disabled}">
				</div>
				<div slot="control-action"></div>
				` : nothing }
				${ this.href ? html`
				<a slot="content-action"
					href="${this.href}"
					aria-labelledby="${this._contentId}"
					@mouseenter="${this._handleMouseEnter}"
					@mouseleave="${this._handleMouseLeave}"
					@focus="${this._handleFocus}"
					@blur="${this._handleBlur}"></a>
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
		`;

	}

	updated(changedProperties) {
		if (changedProperties.has('key')) {
			const oldValue = changedProperties.get('key');
			if (typeof oldValue !== 'undefined') {
				this.setSelected(undefined, true);
			}
		}
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

	setSelected(selected, suppressEvent) {
		this.selected = selected;
		if (!suppressEvent) this._dispatchSelected(selected);
	}

	_dispatchSelected(value) {
		this.dispatchEvent(new CustomEvent('d2l-list-item-selected', {
			detail: { key: this.key, selected: value },
			bubbles: true
		}));
	}

	_handleCheckboxChange(e) {
		this.setSelected(e.target.checked);
	}

	_handleBlur() {
		this._focusing = false;
	}

	_handleFocus() {
		this._focusing = true;
	}

	_handleMouseEnter() {
		this._hovering = true;
	}

	_handleMouseLeave() {
		this._hovering = false;
	}

}

customElements.define('d2l-list-item', ListItem);
