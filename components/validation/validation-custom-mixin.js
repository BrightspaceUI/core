import { EventSubscriberController, ForPropertySubscriberController } from '../../helpers/subscriptionControllers.js';

export const ValidationCustomMixin = superclass => class extends superclass {

	static get properties() {
		return {
			failureText: { type: String, attribute: 'failure-text' },
			for: { type: String }
		};
	}

	constructor() {
		super();

		this._eventSubscriberController = new EventSubscriberController(this, {},
			{ eventName: 'd2l-validation-custom-connected' }
		);

		this._forPropertySubscriberController = new ForPropertySubscriberController(this,
			{ onUnsubscribe: this._onUnsubscribe.bind(this) },
			{ forProperty: 'for' }
		);
	}

	get forElement() {
		if (this.for) {
			// Validation custom components only support one for element
			return this._forPropertySubscriberController.providers.length > 0 ? this._forPropertySubscriberController.providers[0] : null;
		} else {
			return this._eventSubscriberController.provider;
		}
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

	async validate() {
		throw new Error('ValidationCustomMixin requires validate to be overridden');
	}

	_onUnsubscribe() {
		if (this._forPropertySubscriberController.provider.length === 0) {
			throw new Error(`validation-custom failed to find element with id ${this.for}`);
		}
	}

};
