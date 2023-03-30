import { html } from 'lit';
import { SubscriberRegistryController } from '../../controllers/subscriber/subscriberControllers.js';

export const PageableMixin = superclass => class extends superclass {

	static get properties() {
		return {
			/**
			 * Total number of items. If not specified, neither it nor the count of items showing will be displayed.
			 * @type {number}
			 */
			itemCount: { type: Number, attribute: 'item-count', reflect: true },
			_itemShowingCount: { state: true },
		};
	}

	constructor() {
		super();

		this.itemCount = -1;
		this._itemShowingCount = 0;
		this._pageableSubscriberRegistry = new SubscriberRegistryController(this, 'pageable', {
			onSubscribe: this._updatePageableSubscriber.bind(this),
			updateSubscribers: this._updatePageableSubscribers.bind(this)
		});
	}

	firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);
		this._updateItemShowingCount();
	}

	updated(changedProperties) {
		super.updated(changedProperties);

		if (changedProperties.has('itemCount') || changedProperties.has('_itemShowingCount')) {
			this._pageableSubscriberRegistry.updateSubscribers();
		}
	}

	/* must be implemented by consumer */
	_getItemByIndex(index) { } // eslint-disable-line no-unused-vars

	/* must be implemented by consumer */
	_getItemShowingCount() { }

	_getLastItemIndex() {
		return this._itemShowingCount - 1;
	}

	_renderPagerContainer() {
		return html`<slot name="pager"></slot>`;
	}

	_updateItemShowingCount() {
		this._itemShowingCount = this._getItemShowingCount();
	}

	_updatePageableSubscriber(subscriber) {
		subscriber._pageableInfo = { itemShowingCount: this._itemShowingCount, itemCount: this.itemCount };
	}

	_updatePageableSubscribers(subscribers) {
		subscribers.forEach(subscriber => this._updatePageableSubscriber(subscriber));
	}

};
