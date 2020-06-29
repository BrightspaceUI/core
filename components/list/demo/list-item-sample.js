import '../list-item-generic-layout.js';
import '../list-item-placement-marker.js';
import '../list-item-drag-handle.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { classMap } from 'lit-html/directives/class-map.js';
import { getUniqueId } from '../../../helpers/uniqueId.js';
import { ListItemCheckboxMixin } from '../list-item-checkbox-mixin.js';
import { ListItemMixin } from '../list-item-mixin.js';
//import { ListItemDragMixin } from '../list-item-drag-mixin.js';
import { nothing } from 'lit-html';

class ListItemSample extends ListItemMixin(ListItemCheckboxMixin(LitElement)) {
	// TODO: Breakpoints to live elsewhere
	// TODO: draggable should be part of the ListItemDragMixin and removed here
	static get properties() {
		return {
			href: { type: String },
			draggable: { type: Boolean },
			_hovering: { type: Boolean },
			_focusing: { type: Boolean }
		};
	}

	static get styles() {
		return [ super.styles, css`
			[slot="control"] {
				width: 40px;
			}
			a[href].d2l-list-item-link {
				width: 100%;
				height: 100%;
			}
			:host([href]) {
				--d2l-list-item-content-text-color: var(--d2l-color-celestine);
			}
			.d2l-list-item-content.hovering,
			.d2l-list-item-content.focusing {
				--d2l-list-item-content-text-decoration: underline;
			}
			[slot="content-action"]:focus {
				outline: none;
			}
		`];
	}

	constructor() {
		super();
		this._contentId = getUniqueId();
	}

	render() {
		const classes = { hovering: this._hovering, focusing: this._focusing };

		return html`
			<d2l-list-item-placement-marker></d2l-list-item-placement-marker>
			<d2l-list-item-generic-layout ?grid-active="${this.role === 'rowgroup'}">
				${ this.draggable ? html`
				<div slot="outside-control">${ this._renderDragHandle ? this._renderDragHandle() : '=' }</div>
				` : nothing }
				${this.selectable ? html`
				<div slot="control">${ this._renderCheckbox() }</div>
				<div slot="control-action">${ this._renderCheckboxAction(null, this._contentId) }</div>
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
					id="${this._contentId}"
					class="d2l-list-item-content ${ classMap(classes) }">
					<slot></slot>
				</div>

				<div slot="actions">
					<slot name="actions"></slot>
				</div>
			</d2l-list-item-generic-layout>
		`;
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

	_renderDragHandle() {
		return html`<d2l-list-item-drag-handle ?disabled="${this.disabled}"></d2l-list-item-drag-handle>`;
	}
}

customElements.define('d2l-list-item-sample', ListItemSample);
