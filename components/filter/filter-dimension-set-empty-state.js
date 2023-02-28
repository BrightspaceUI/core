import { LitElement } from 'lit';

/**
 * A component to customize the empty state parameters for a particular filter-dimension-set.
 * This component does not render anything, but instead gathers data needed for the d2l-filter.
 */
class FilterDimensionSetEmptyState extends LitElement {

	static get properties() {
		return {
			/**
			 * The href that will be used for the empty state action. When set with action-text, d2l-filter will render a link action.
			 * @type {string}
			 */
			actionHref: { type: String, attribute: 'action-href' },
			/**
			 * The text that will be displayed in the empty state action. When set, d2l-filter renders a button action, or a link if action-href is also defined.
			 * @type {string}
			 */
			actionText: { type: String, attribute: 'action-text' },
			/**
			 * REQUIRED: The text that is displayed in the empty state description
			 * @type {string}
			 */
			description: { type: String }
		};
	}

	constructor() {
		super();
		this.actionHref = '';
		this.actionText = '';
		this.description = '';
	}

}

customElements.define('d2l-filter-dimension-set-empty-state', FilterDimensionSetEmptyState);
