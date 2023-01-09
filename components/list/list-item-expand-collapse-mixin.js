import '../button/button-icon.js';
import '../loading-spinner/loading-spinner.js';
import { css, html, nothing } from 'lit';
import { EventSubscriberController } from '../../controllers/subscriber/subscriberControllers.js';

const dragIntervalDelay = 100;
const dragHoverDropTime = 1000;

export const ListItemExpandCollapseMixin = superclass => class extends superclass {

	static get properties() {
		return {
			/**
			 * Whether to show the expand collapse toggle
			 * @type {boolean}
			 */
			expandable: { type: Boolean },
			/**
			 * Default state for expand collapse toggle - if not set, collapsed will be the default state
			 * @type {boolean}
			 */
			expanded: { type: Boolean, reflect: true },
			_siblingHasNestedItems: { state: true },
			_renderExpandCollapseSlot: { type: Boolean, reflect: true, attribute: '_render-expand-collapse-slot' },
			_showChildrenLoadingSpinner: {  state: true }
		};
	}

	static get styles() {
		const styles = [ css`
			:host {
				--d2l-expand-collapse-slot-transition-duration: 0.3s;
			}
			.d2l-list-expand-collapse {
				padding: 0.4rem 0.3rem 0 0;
				transition: width var(--d2l-expand-collapse-slot-transition-duration) cubic-bezier(0, 0.7, 0.5, 1);
				width: 0;
			}
			:host([dir="rtl"]) .d2l-list-expand-collapse {
				padding: 0.4rem 0 0 0.3rem;
			}
			.d2l-list-expand-collapse d2l-button-icon {
				--d2l-button-icon-min-height: 1.2rem;
				--d2l-button-icon-min-width: 1.2rem;
			}
			.d2l-list-expand-collapse:hover d2l-button-icon {
				background-color: var(--d2l-button-icon-background-color-hover);
				border-radius: var(--d2l-button-icon-border-radius);
			}
			:host([_render-expand-collapse-slot]) .d2l-list-expand-collapse {
				width: 1.2rem;
			}
			.d2l-list-expand-collapse-action {
				cursor: pointer;
				display: block;
				height: 100%;
			}
			.d2l-list-children-loading {
				display: flex;
				justify-content: center;
				padding: 0.4rem;
			}
		` ];

		super.styles && styles.unshift(super.styles);
		return styles;
	}

	constructor() {
		super();
		this._siblingHasNestedItems = false;
		this._renderExpandCollapseSlot = false;
		this._showChildrenLoadingSpinner = false;
		this._parentChildUpdateSubscription = new EventSubscriberController(this, {}, { eventName: 'd2l-list-child-status' });
	}

	connectedCallback() {
		super.connectedCallback();
		// mixin requires key for events
		if (!this.key && this.expandable) {
			console.warn('ListItemExpandCollapseMixin requires a key.');
			this.expandable = false;
		}
	}

	updated(changedProperties) {
		if (changedProperties.has('_siblingHasNestedItems') || changedProperties.has('expandable')) {
			this._renderExpandCollapseSlot = this.expandable || this._siblingHasNestedItems;
		}
		if (changedProperties.has('_draggingOver') && this._draggingOver && this.dropNested && !this.expanded && this.expandable) {
			let elapsedHoverTime = 0;
			let dragIntervalId = null;
			const watchDraggingOver = () => {
				if (elapsedHoverTime === dragHoverDropTime) {
					if (this._draggingOver) {
						this._toggleExpandCollapse();
					}
					clearInterval(dragIntervalId);
				} else {
					if (!this._draggingOver) {
						clearInterval(dragIntervalId);
					} else {
						elapsedHoverTime += dragIntervalDelay;
					}
				}
			};
			// check if they are still hovered over same item every 100ms
			dragIntervalId = setInterval(watchDraggingOver, dragIntervalDelay);
		}
		if (changedProperties.has('expanded') || changedProperties.has('_hasChildren')) {
			this._showChildrenLoadingSpinner = this.expanded && !this._hasChildren;
		}
	}

	updateSiblingHasChildren(siblingHasNestedItems) {
		this._siblingHasNestedItems = siblingHasNestedItems;
	}

	_renderChildrenLoadingSpinner() {
		if (!this.expandable || !this._showChildrenLoadingSpinner) {
			return nothing;
		}
		return html`
			<div class="d2l-list-children-loading">
				<d2l-loading-spinner size="40"></d2l-loading-spinner>
			</div>`;
	}

	_renderExpandCollapse() {
		if (!this._renderExpandCollapseSlot) {
			return nothing;
		}
		return html`
			<div slot="expand-collapse" class="d2l-list-expand-collapse" @click="${this._toggleExpandCollapse}">
				${this.expandable ? html`<d2l-button-icon
					icon="${this.expanded ? 'tier1:arrow-collapse-small' : 'tier1:arrow-expand-small' }"
					aria-expanded="${this.expanded ? 'true' : 'false'}"
					text="${this.label}"></d2l-button-icon>` : nothing}
			</div>`;
	}

	_renderExpandCollapseAction() {
		if (this.selectable || !this.expandable || this.noPrimaryAction) {
			return nothing;
		}

		return html`<div class="d2l-list-expand-collapse-action" @click="${this._toggleExpandCollapse}"></div>`;
	}

	_toggleExpandCollapse() {
		if (!this.expandable) {
			return;
		}
		this.expanded = !this.expanded;
		this.dispatchEvent(new CustomEvent('d2l-list-item-expand-collapse-toggled', {
			detail: {
				key: this.key,
				oldState: !this.expanded,
				expanded: this.expanded },
			composed: true,
			bubbles: true
		}));
	}
};
