import { dedupeMixin } from '@open-wc/dedupe-mixin';
import { RtlMixin } from '../../mixins/rtl/rtl-mixin.js';
import { SubscriberRegistryController } from '../../controllers/subscriber/subscriberControllers.js';

export const SkeletonGroupMixin = dedupeMixin(superclass => class extends RtlMixin(superclass) {

	constructor() {
		super();

		this._skeletonSubscribers = new SubscriberRegistryController(this, 'skeleton', {
			updateSubscribers: this._checkSubscribersReadyToDisplay.bind(this)
		});
	}

	_checkSubscribersReadyToDisplay(subscribers) {
		const readyToDisplay = ![...subscribers.values()].some(subscriber => subscriber.skeleton);
		subscribers.forEach(subscriber => subscriber.changeDisplay(readyToDisplay));
	}
});
