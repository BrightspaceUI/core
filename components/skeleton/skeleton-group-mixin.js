import { dedupeMixin } from '@open-wc/dedupe-mixin';
import { SubscriberRegistryController } from '../../controllers/subscriber/subscriberControllers.js';

export const SkeletonGroupMixin = dedupeMixin(superclass => class extends superclass {

	constructor() {
		super();

		this._readyToDisplayCached = false;
		this._skeletonSubscribers = new SubscriberRegistryController(this, 'skeleton', {
			updateSubscribers: this._checkSubscribersReadyToDisplay.bind(this)
		});
	}

	_checkSubscribersReadyToDisplay(subscribers) {
		const readyToDisplay = ![...subscribers.values()].some(subscriber => subscriber.skeleton);
		if (readyToDisplay !== this._readyToDisplayCached) {
			this._readyToDisplayCached = readyToDisplay;
			subscribers.forEach(subscriber => subscriber.changeDisplay(readyToDisplay));
		}
	}
});
