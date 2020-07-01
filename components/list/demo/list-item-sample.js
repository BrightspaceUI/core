import '../list-item-generic-layout.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { classMap } from 'lit-html/directives/class-map.js';
import { getUniqueId } from '../../../helpers/uniqueId.js';
import { ListItemCheckboxMixin } from '../list-item-checkbox-mixin.js';
import { ListItemDragMixin } from '../list-item-drag-mixin.js';
import { ListItemMixin } from '../list-item-mixin.js';
import { nothing } from 'lit-html';

class ListItemSample extends ListItemMixin(ListItemDragMixin(ListItemCheckboxMixin(LitElement))) {
	// TODO: Role and breakpoints to live elsewhere
	// TODO: draggable should be part of the ListItemDragMixin and removed here
	static get properties() {
		return {
			href: { type: String },
			_hovering: { type: Boolean },
			_focusing: { type: Boolean }
		};
	}

	static get styles() {
		const placementMarkerCss = css`
			.d2l-list-drag-indicator-wrapper {
				max-height: 12px;
				display: flex;
			}
			.d2l-list-drag-indicator {
				height: 12px;
				width: 100%;
			}
			.d2l-list-drag-indicator line{
				stroke: var(--d2l-color-celestine);
				stroke-width: 3px;
				stroke-linecap: round;
			}
			.d2l-list-drag-indicator-linecap {
				height: 12px;
				width: 5px;
			}
			.d2l-list-drag-indicator-circle {
				height: 12px;
				width: 12px;
				margin-right: -1px;
			}
			.d2l-list-drag-indicator-linecap line,
			.d2l-list-drag-indicator-circle circle{
				stroke: var(--d2l-color-celestine);
				stroke-width: 3px;
				stroke-linecap: round;
			}
		`;
		return [ super.styles, placementMarkerCss, css`
			:host([being-dragged]) d2l-list-item-generic-layout {
				filter: grayscale(75%);
				opacity: 0.4;
			}
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
			.d2l-list-item-drag-image {
				transform: rotate(-1deg);
			}
			d2l-list-item-generic-layout {
				background: white;
				transform: rotate(1deg);
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
			${this._renderTopPlacementMarker(this._renderDivider())}
			${this._renderDropArea()}
			<div class="d2l-list-item-drag-image">
				<d2l-list-item-generic-layout ?grid-active="${this.role === 'rowgroup'}">
					${this._renderDragHandle((dragHandle) => html`<div slot="outside-control">${dragHandle}</div>`)}
					${this._renderDraggableArea((dragArea) => html`<div slot="outside-control-action">${dragArea}</div>`)}
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
			</div>
			${this._renderBottomPlacementMarker(this._renderDivider())}
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

	_renderDivider() {
		return html`
			<div class="d2l-list-drag-indicator-wrapper">
				<svg viewBox="0 0 12 12" class="d2l-list-drag-indicator-circle">
					<circle cx="6" cy="6" r="4" fill="none"/>
				</svg>
				<svg class="d2l-list-drag-indicator">
					<line x1="0" y1="50%" x2="100%" y2="50%" />
				</svg>
				<svg viewBox="0 0 5 12" class="d2l-list-drag-indicator-linecap">
					<line x1="-5" y1="50%" x2="0" y2="50%" />
				</svg>
			</div>
		`;
	}
}

customElements.define('d2l-list-item-sample', ListItemSample);
