import { IdSubscriberController } from '../../controllers/subscriber/subscriberControllers.js';

export const FilterInfoSubscriberMixin = superclass => class extends superclass {

	static get properties() {
		return {
			/**
			 * Ids (space-delimited) of the `FilterInfoProviderMixin` components to subscribe to
			 * @type {string}
			 */
			filterIds: { type: String, attribute: 'filter-ids' },
			_allActiveFilters: { type: Object, attribute: false }
		};
	}

	constructor() {
		super();
		this._allActiveFilters = new Map();

		this._filters = new IdSubscriberController(this,
			{ onUnsubscribe: this._removeFilterInfo.bind(this) },
			{ idPropertyName: 'filterIds' }
		);
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		this._filters.hostDisconnected();
	}

	updated(changedProperties) {
		super.updated(changedProperties);
		this._filters.hostUpdated(changedProperties);
	}

	updateActiveFilters(filterId, activeFilters) {
		this._allActiveFilters.set(filterId, activeFilters);
		this.requestUpdate();
	}

	_removeFilterInfo(filterId) {
		this._allActiveFilters.delete(filterId);
		this.requestUpdate();
	}

};
