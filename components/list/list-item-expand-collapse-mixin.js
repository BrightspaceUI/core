import '../button/button-icon.js';
import { css, html, nothing } from 'lit';
import { EventSubscriberController } from '../../controllers/subscriber/subscriberControllers.js';

export const ListItemExpandCollapseMixin = superclass => class extends superclass {

	static get properties() {
		return {
			/**
			 * Whether to allow the item to expand and collapse children
			 * @type {boolean}
			 */
			expandable: { type: Boolean },
			expanded: { type: Boolean, reflect: true },
			_siblingHasNestedItems: { state: true },
			_renderExpandCollapseSlot: { type: Boolean, reflect: true, attribute: '_render-expand-collapse-slot' }
		};
	}

	static get styles() {
		const styles = [ css`
			:host {
				--d2l-expand-collapse-slot-transition-duration: 0.3s;
			}
			.d2l-list-expand-collapse {
				padding: 0.4rem 0.3rem 0 0;
				transition:	width var(--d2l-expand-collapse-slot-transition-duration) cubic-bezier(0, 0.7, 0.5, 1);
				width: 0;
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
		` ];

		super.styles && styles.unshift(super.styles);
		return styles;
	}

	constructor() {
		super();
		this._siblingHasNestedItems = false;
		this._renderExpandCollapseSlot = false;
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
		if (changedProperties.has('_hasChildren') || changedProperties.has('_siblingHasNestedItems') || changedProperties.has('expandable')) {
			this._renderExpandCollapseSlot = this.expandable && (this._hasChildren || this._siblingHasNestedItems);
		}
	}

	updateSiblingHasChildren(siblingHasNestedItems) {
		this._siblingHasNestedItems = siblingHasNestedItems;
	}

	_renderExpandCollapse() {
		if (!this.expandable) {
			return nothing;
		}
		return html`
			<div slot="expand-collapse" class="d2l-list-expand-collapse" @click="${this._toggleExpandCollapse}">
				${this._hasChildren ? html`<d2l-button-icon
					icon="${this.expanded ? 'tier1:arrow-collapse-small' : 'tier1:arrow-expand-small' }"
					aria-expanded="${this.expanded ? 'true' : 'false'}"
					text="${this.label}"></d2l-button-icon>` : nothing}
			</div>`;
	}

	_renderExpandCollapseAction() {
		if (this.selectable || !(this.expandable && this._hasChildren) || this.noPrimaryAction) {
			return nothing;
		}

		return html`<div class="d2l-list-expand-collapse-action" @click="${this._toggleExpandCollapse}"></div>`;
	}

	_toggleExpandCollapse() {
		this.expanded = !this.expanded;
		this.dispatchEvent(new CustomEvent('d2l-list-item-expand-collapse-toggled', {
			detail: { key: this.key, expanded: this.expanded },
			composed: true,
			bubbles: true
		}));
	}
};
