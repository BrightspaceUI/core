import { dedupeMixin } from '@open-wc/dedupe-mixin';
import { SkeletonMixin } from './skeleton-mixin.js';
import { SubscriberRegistryController } from '../../controllers/subscriber/subscriberControllers.js';

export const SkeletonGroupMixin = dedupeMixin(superclass => class extends SkeletonMixin(superclass) {

	static get properties() {
		// TODO: remove reflect
		return {
			_anySubscribersInSkeleton: { reflect: true },
			_setByParent: { reflect: true }
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

		this._skeletonActive = this._skeleton || this._anySubscribersInSkeleton || this._setByParent;
		subscribers.forEach(subscriber => {
			subscriber.setSkeletonActive(this._skeletonActive);
			subscriber._setByParent = !subscriber._skeleton && this._skeletonActive;
		});

		this._parentSkeleton?.registry?.onSubscriberChange();

	}

});
