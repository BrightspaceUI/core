import { CollectionMixin } from '../../mixins/collection/collection-mixin.js';
import { html } from 'lit';
import { SubscriberRegistryController } from '../../controllers/subscriber/subscriberControllers.js';

/**
 * @template {LitElementClassType} S
 * @param {S} superclass
 */
export const PageableMixin = superclass => class extends CollectionMixin(superclass) {

	static get properties() {
		return {
			_itemShowingCount: { state: true },
		};
	}

	constructor(...args) {
		super(...args);

		this._itemShowingCount = 0;
		this._pageableSubscriberRegistry = new SubscriberRegistryController(this, 'pageable', {
			onSubscribe: this._updatePageableSubscriber.bind(this),
			onUnsubscribe: this._clearPageableSubscriber.bind(this),
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

	_clearPageableSubscriber(subscriber) {
		subscriber._pageableInfo = null;
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

	_updatePageableSubscriber(subscriber, doUpdate = true) {
		if (doUpdate) this._updateItemShowingCount();
		subscriber._pageableInfo = { itemShowingCount: this._itemShowingCount, itemCount: this.itemCount };
	}

	_updatePageableSubscribers(subscribers) {
		subscribers.forEach(subscriber => this._updatePageableSubscriber(subscriber, false));
	}

};
