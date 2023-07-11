import { dedupeMixin } from '@open-wc/dedupe-mixin';
import { SubscriberRegistryController } from '../../controllers/subscriber/subscriberControllers.js';

export const SkeletonGroupMixin = dedupeMixin(superclass => class extends superclass {

	constructor() {
		super();

		this._skeletonActiveCached = true;
		this._skeletonSubscribers = new SubscriberRegistryController(this, 'skeleton', {
			onSubscribe: this.onSubscriberChange.bind(this),
			onUnsubscribe: this.onSubscriberChange.bind(this),
			updateSubscribers: this._checkSubscribersSkeletonState.bind(this),
		});
	}

	onSubscriberChange() {
		this._skeletonSubscribers.updateSubscribers();
	}

	_checkSubscribersSkeletonState(subscribers) {
		const skeletonActive = [...subscribers.values()].some(subscriber => subscriber._skeleton);
		if (skeletonActive !== this._skeletonActiveCached) {
			this._skeletonActiveCached = skeletonActive;
			subscribers.forEach(subscriber => subscriber.setSkeletonActive(skeletonActive));
		}
	}

});
