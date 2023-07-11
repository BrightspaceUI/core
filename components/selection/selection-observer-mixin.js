import { EventSubscriberController, IdSubscriberController } from '../../controllers/subscriber/subscriberControllers.js';
import { SelectionInfo } from './selection-mixin.js';

export const SelectionObserverMixin = superclass => class extends superclass {

	static get properties() {
		return {
			/**
			 * Id of the `SelectionMixin` component this component wants to observe (if not located within that component)
			 * @type {string}
			 */
			selectionFor: { type: String, reflect: true, attribute: 'selection-for' },
			/**
			 * The selection info (set by the selection component)
			 * @ignore
			 * @type {object}
			 */
			selectionInfo: { type: Object }
		};
	}

	constructor() {
		super();
		this.selectionInfo = new SelectionInfo();

		this._eventSubscriberController = new EventSubscriberController(this, 'selection-observer', {});

		this._idSubscriberController = new IdSubscriberController(this, 'selection-observer', {
			idPropertyName: 'selectionFor',
			onUnsubscribe: this._clearSelectionInfo.bind(this)
		});
	}

	async getUpdateComplete() {
		await super.getUpdateComplete();
		await (this.selectionFor ? this._idSubscriberController._subscriptionComplete : this._eventSubscriberController._subscriptionComplete);
	}

	get _registry() {
		if (this.selectionFor) {
			// Selection components currently only support one provider id in selectionFor
			return this._idSubscriberController.registries[0] || null;
		} else {
			return this._eventSubscriberController.registry;
		}
	}

	_clearSelectionInfo() {
		this.selectionInfo = new SelectionInfo();
	}

};
