import { dedupeMixin } from '@open-wc/dedupe-mixin';
import { SkeletonMixin } from './skeleton-mixin.js';
import { SubscriberRegistryController } from '../../controllers/subscriber/subscriberControllers.js';

export const SkeletonGroupMixin = dedupeMixin(superclass => class extends SkeletonMixin(superclass) {

	static get properties() {
		return {
			_anySubscribersWithSkeletonActive : { state: true },
		};
	}

	constructor() {
		super();
		this._anySubscribersWithSkeletonActive  = false;
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
		this._anySubscribersWithSkeletonActive  = [...subscribers.values()].some(subscriber => (
			subscriber._skeletonSetExplicitly  || subscriber._anySubscribersWithSkeletonActive
		));

		this.setSkeletonActive(this._skeletonSetExplicitly  || this._anySubscribersWithSkeletonActive  || this._skeletonSetByParent);

		subscribers.forEach(subscriber => {
			subscriber.setSkeletonActive(this._skeletonActive);
			subscriber.setSkeletonSetByParent(this._skeletonActive && !subscriber._skeletonSetExplicitly);
		});

		this._parentSkeleton?.registry?.onSubscriberChange();
	}

});
