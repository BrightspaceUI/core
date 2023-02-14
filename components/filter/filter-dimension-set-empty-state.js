import { LitElement } from 'lit';

/**
 * A component to customize the empty state parameters for a particular filter-dimension-set.
 */
class FilterDimensionSetEmptyState extends LitElement {

	static get properties() {
		return {
			/**
			 * Count for the value in the list. If no count is provided, no count will be displayed
			 * @type {string}
			 */
			actionHref: { type: String, attribute: 'action-href' },
			/**
			 * Whether this value in the filter is disabled or not
			 * @type {boolean}
			 */
			actionText: { type: String, attribute: 'action-text' },
			/**
			 * REQUIRED: The text that is displayed for the value
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

	updated(changedProperties) {
		super.updated(changedProperties);

		const changes = new Map();
		changedProperties.forEach((oldValue, prop) => {
			if (oldValue === undefined) return;

			if (prop === 'actionHref' || prop === 'actionText' || prop === 'description' || prop === 'type') {
				changes.set(prop, this[prop]);
			}
		});
		if (changes.size > 0) {
			/** @ignore */
			this.dispatchEvent(new CustomEvent('d2l-filter-dimension-set-empty-state-change', {
				bubbles: true,
				composed: false
			}));
		}
	}
}

customElements.define('d2l-filter-dimension-set-empty-state', FilterDimensionSetEmptyState);
