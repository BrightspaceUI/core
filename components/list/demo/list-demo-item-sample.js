import '../list-item-generic-layout.js';
import '../list-item-placement-marker.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { classMap } from 'lit-html/directives/class-map.js';
import { getUniqueId } from '../../../helpers/uniqueId.js';
import { ListItemCheckboxMixin } from '../list-item-checkbox-mixin.js';
<<<<<<< HEAD
import { ListItemDragMixin } from '../list-item-drag-mixin.js';
import { ListItemRoleMixin } from '../list-item-role-mixin.js';
import { nothing } from 'lit-html';

class ListDemoItemSample extends ListItemRoleMixin(ListItemDragMixin(ListItemCheckboxMixin(LitElement))) {
=======
import { ListItemDragDropMixin } from '../list-item-drag-mixin.js';
import { ListItemMixin } from '../list-item-mixin.js';
import { nothing } from 'lit-html';

class ListDemoItemSample extends ListItemMixin(ListItemDragDropMixin(ListItemCheckboxMixin(LitElement))) {
>>>>>>> polaris/dragndrop
	static get properties() {
		return {
			href: { type: String },
			_focusing: { type: Boolean },
			_hovering: { type: Boolean }
		};
	}

	static get styles() {
		return [ super.styles, css`
			:host([dragging]) d2l-list-item-generic-layout {
				filter: grayscale(75%);
				opacity: 0.4;
			}
			[slot="control"] {
				width: 40px;
			}
			a[href].d2l-list-item-link {
				height: 100%;
				width: 100%;
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
			.d2l-list-item-drag-image {
				transform: rotate(-1deg);
			}
			d2l-list-item-generic-layout {
				background: white;
				transform: rotate(1deg);
			}
			[slot="content"] {
				display: flex;
				justify-content: stretch;
				padding: 0.55rem 0;
			}
			[slot="content"] ::slotted([slot="illustration"]) {
				border-radius: 6px;
				flex-grow: 0;
				flex-shrink: 0;
				margin-right: 1rem;
				margin: 0.15rem 0.9rem 0.15rem 0;
				max-height: 5.1rem;
				max-width: 9rem;
				overflow: hidden;
			}
			:host([dir="rtl"]) [slot="content"] ::slotted([slot="illustration"]) {
				margin-left: 1rem;
				margin-right: 0;
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
			${this._renderTopPlacementMarker(html`<d2l-list-item-placement-marker></d2l-list-item-placement-marker>`)}
			${this._renderDropTarget()}
			<div class="d2l-list-item-drag-image">
				<d2l-list-item-generic-layout ?grid-active="${this.role === 'rowgroup'}">
					${this._renderDragHandle(this._renderOutsideControl)}
					${this._renderDraggableArea(this._renderOutsideControlAction)}
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
						<slot name="illustration"></slot>
						<slot></slot>
					</div>
					<div slot="actions">
						<slot name="actions"></slot>
					</div>
				</d2l-list-item-generic-layout>
			</div>
			${this._renderBottomPlacementMarker(html`<d2l-list-item-placement-marker></d2l-list-item-placement-marker>`)}
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

	_renderOutsideControl(dragHandle) {
		return html`<div slot="outside-control">${dragHandle}</div>`;
	}

	_renderOutsideControlAction(dragArea) {
		return html`<div slot="outside-control-action">${dragArea}</div>`;
	}
}

customElements.define('d2l-list-demo-item-sample', ListDemoItemSample);
