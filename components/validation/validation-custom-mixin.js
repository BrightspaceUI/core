import { EventSubscriberController, IdSubscriberController } from '../../controllers/subscriber/subscriberControllers.js';

export const ValidationCustomMixin = superclass => class extends superclass {

	static get properties() {
		return {
			failureText: { type: String, attribute: 'failure-text' },
			for: { type: String }
		};
	}

	constructor() {
		super();
		this._forElement = null;

		// Will register to both the form (through the event) and the "for" element (if set and extends FormElementMixin)
		this._eventSubscriberController = new EventSubscriberController(this, 'validation-custom', {});
		this._idSubscriberController = new IdSubscriberController(this, 'validation-custom', {
			idPropertyName: 'for',
			onError: this._onError.bind(this)
		});
	}

	get forElement() {
		if (this.for) {
			// Validation custom components only support one "for" element
			return this._idSubscriberController.registries.length > 0 ? this._idSubscriberController.registries[0] : this._forElement;
		} else {
			return this._eventSubscriberController.registry;
		}
	}

	async validate() {
		throw new Error('ValidationCustomMixin requires validate to be overridden');
	}

	_onError() {
		// If the "for" element does not extend FormElementMixin, we must find it ourselves
		const root = this.getRootNode();
		this._forElement = root.getElementById(this.for);
		if (!this._forElement) {
			throw new Error(`validation-custom failed to find element with id ${this.for}`);
		}
	}
};
