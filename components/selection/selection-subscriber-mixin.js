import { selectionStates } from './selection-mixin.js';

export const SelectionSubscriberMixin = superclass => class extends superclass {

	static get properties() {
		return {
			/**
			 * The selection info (set by the selection component).
			 */
			selectionInfo: { type: Object }
		};
	}

	constructor() {
		super();
		this.selectionInfo = { keys: [], state: selectionStates.none };
		this._selectionSubscriber = true;
	}

	connectedCallback() {
		super.connectedCallback();
		this.dispatchEvent(new CustomEvent('d2l-selection-subscriber-subscribe', {
			bubbles: true,
			composed: true
		}));
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		this.dispatchEvent(new CustomEvent('d2l-selection-subscriber-unsubscribe', {
			bubbles: true,
			composed: true
		}));
	}

};
