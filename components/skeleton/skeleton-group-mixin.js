import { dedupeMixin } from '@open-wc/dedupe-mixin';
import { SkeletonMixin } from './skeleton-mixin.js';
import { SubscriberRegistryController } from '../../controllers/subscriber/subscriberControllers.js';

export const SkeletonGroupMixin = dedupeMixin(superclass => class extends SkeletonMixin(superclass) {

	constructor() {
		super();

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
		this.skeleton = skeletonActive;
		subscribers.forEach(subscriber => subscriber.setSkeletonActive(skeletonActive));
	}

});
