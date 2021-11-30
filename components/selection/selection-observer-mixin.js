import { EventSubscriberController, ForPropertySubscriberController } from '../../helpers/subscriptionControllers.js';
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

		this._eventSubscriberController = new EventSubscriberController(this, {},
			{ eventName: 'd2l-selection-observer-subscribe', controllerId: 'observer' }
		);

		this._forPropertySubscriberController = new ForPropertySubscriberController(this,
			{ onUnsubscribe: this._clearSelectionInfo.bind(this) },
			{ forProperty: 'selectionFor', controllerId: 'observer' }
		);
	}

	connectedCallback() {
		super.connectedCallback();
		this._eventSubscriberController.hostConnected();
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		this._eventSubscriberController.hostDisconnected();
		this._forPropertySubscriberController.hostDisconnected();
	}

	updated(changedProperties) {
		super.updated(changedProperties);
		this._forPropertySubscriberController.hostUpdated(changedProperties);
	}

	_clearSelectionInfo() {
		this.selectionInfo = new SelectionInfo();
	}

	_getSelectionProvider() {
		if (this.selectionFor) {
			// Selection components currently only support one provider id in selectionFor
			return this._forPropertySubscriberController.providers[0];
		} else {
			return this._eventSubscriberController.provider;
		}
	}
};
