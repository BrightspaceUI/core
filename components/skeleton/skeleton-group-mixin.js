import { dedupeMixin } from '@open-wc/dedupe-mixin';
import { SkeletonMixin } from './skeleton-mixin.js';
import { SubscriberRegistryController } from '../../controllers/subscriber/subscriberControllers.js';

export const SkeletonGroupMixin = dedupeMixin(superclass => class extends SkeletonMixin(superclass) {

	static get properties() {
		return {
			_anySubscribersInSkeleton: { state: true },
			_setByParent: { state: true }
		};
	}

	constructor() {
		super();
		this._anySubscribersInSkeleton = false;
		this._setByParent = false;
		this._skeletonSubscribers = new SubscriberRegistryController(this, 'skeleton', {
			onSubscribe: this.onSubscriberChange.bind(this),
			onUnsubscribe: this.onSubscriberChange.bind(this),
			updateSubscribers: this._checkSubscribersSkeletonState.bind(this),
		});
	}

	updated(changedProperties) {
		if (changedProperties.has('skeleton')) {
			this._skeletonSubscribers.updateSubscribers();
		}
	}

	onSubscriberChange() {
		this._skeletonSubscribers.updateSubscribers();
	}

	_checkSubscribersSkeletonState(subscribers) {
		this._anySubscribersInSkeleton = [...subscribers.values()].some(subscriber => (
			subscriber._skeleton || subscriber._anySubscribersInSkeleton
		));

		this.setSkeletonActive(this._skeleton || this._anySubscribersInSkeleton || this._setByParent);

		subscribers.forEach(subscriber => {
			subscriber.setSkeletonActive(this._skeletonActive);
			subscriber._setByParent = this._skeletonActive && !subscriber._skeleton;
		});

		this._parentSkeleton?.registry?.onSubscriberChange();
	}

});
