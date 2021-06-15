import { SelectionInfo } from './selection-mixin.js';

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
		this.selectionInfo = new SelectionInfo();
		this._provider = null;
		this._selectionSubscriber = true;
	}

	connectedCallback() {
		super.connectedCallback();
		const evt = new CustomEvent('d2l-selection-subscriber-subscribe', {
			bubbles: true,
			composed: true,
			detail: {}
		});
		this.dispatchEvent(evt);
		this._provider = evt.detail.provider;
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		if (!this._provider) return;
		this._provider.unsubscribeObserver(this);
	}

};
