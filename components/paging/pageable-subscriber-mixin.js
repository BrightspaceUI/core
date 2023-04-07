import { EventSubscriberController, IdSubscriberController } from '../../controllers/subscriber/subscriberControllers.js';

export const PageableSubscriberMixin = superclass => class extends superclass {

	static get properties() {
		return {
			/**
			 * Id of the `PageableMixin` component this component wants to observe (if not located within that component)
			 * @type {string}
			 */
			pageableFor: { type: String, reflect: true, attribute: 'pageable-for' },
			_pageableInfo: { state: true }
		};
	}

	constructor() {
		super();

		this._pageableInfo = null;
		this._pageableEventSubscriber = new EventSubscriberController(this, 'pageable');
		this._pageableIdSubscriber = new IdSubscriberController(this, 'pageable', { idPropertyName: 'pageableFor' });
	}

	async getUpdateComplete() {
		await super.getUpdateComplete();
		await (this.pageableFor ? this._pageableIdSubscriber._subscriptionComplete : this._pageableEventSubscriber._subscriptionComplete);
	}

	_getPageableRegistries() {
		return this.pageableFor ? this._pageableIdSubscriber.registries : [ this._pageableEventSubscriber.registry ];
	}

};
