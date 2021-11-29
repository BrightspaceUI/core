import { SelectionInfo } from './selection-mixin.js';
import { SubscriberController } from '../../helpers/subscriptionControllers.js';

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

		this._subscriberController = new SubscriberController(this,
			{ onUnsubscribe: this._clearSelectionInfo.bind(this) },
			{ eventName: 'd2l-selection-observer-subscribe', forProperty: 'selectionFor', controllerId: 'observer' }
		);
	}

	connectedCallback() {
		super.connectedCallback();
		this._subscriberController.hostConnected();
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		this._subscriberController.hostDisconnected();
	}

	updated(changedProperties) {
		super.updated(changedProperties);
		this._subscriberController.hostUpdated(changedProperties);
	}

	_clearSelectionInfo() {
		this.selectionInfo = new SelectionInfo();
	}
};
