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
			expandCollapseEnabled: { type: Boolean, attribute: 'expand-collapse-enabled' },
			_hasChildren: { state: true },
			_showChildren: { type: Boolean, attribute: '_show-children', reflect: true },
			_siblingHasNestedItems: { state: true }
		};
	}

	static get styles() {
		const styles = [ css`
			.d2l-list-expand-collapse {
				padding: 0.4rem 0.4rem 0 0;
			}
			.d2l-list-expand-collapse d2l-button-icon {
				--d2l-button-icon-min-height: 1.2rem;
				--d2l-button-icon-min-width: 1.2rem;
			}
			.d2l-list-expand-collapse:hover d2l-button-icon {
				border-radius: var(--d2l-button-icon-border-radius);
				background-color: var(--d2l-button-icon-background-color-hover);
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
		this._hasChildren = false;
		this._showChildren = true;
		this._siblingHasNestedItems = false;

		this._parentChildUpdateSubscription = new EventSubscriberController(this, {}, { eventName: 'd2l-list-child-status' });
	}

	updateSiblingHasChildren(siblingHasNestedItems) {
		this._siblingHasNestedItems = siblingHasNestedItems;
	}

	_onNestedSlotChangeExpandCollapseMixin() {
		const nestedList = this._getNestedList();
		if (this._hasChildren !== !!nestedList) {
			this._hasChildren = !!nestedList;
			this.dispatchEvent(new CustomEvent('d2l-list-item-children-change', { bubbles: true, composed: true }));
		}
	}

	_renderExpandCollapse() {
		if (!this.expandCollapseEnabled || (!this._hasChildren && !this._siblingHasNestedItems)) {
			return nothing;
		}

		return html`
		<div slot="expand-collapse" class="d2l-list-expand-collapse" @click="${this._toggleExpandCollapse}">
			${this._hasChildren ? html`<d2l-button-icon icon="${this._showChildren ? 'tier1:arrow-collapse-small' : 'tier1:arrow-expand-small' }"></d2l-button-icon>` : nothing}
		</div>`;
	}

	_renderExpandCollapseAction() {
		if ((this.selectable && !this.disabled) || !(this.expandCollapseEnabled && this._hasChildren)) {
			return nothing;
		}

		return html`<div class="d2l-list-expand-collapse-action" @click="${this._toggleExpandCollapse}"></div>`;
	}

	_toggleExpandCollapse() {
		this._showChildren = !this._showChildren;
	}
};
