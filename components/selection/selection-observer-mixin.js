import { SelectionInfo } from './selection-mixin.js';

export const SelectionObserverMixin = superclass => class extends superclass {

	static get properties() {
		return {
			/**
			 * The selection info (set by the selection component).
			 */
			selectionInfo: { type: Object },
			/**
			 * Id of the collection this component wants to subscribe to (if not located with that collection)
			 */
			subscribedTo: { type: String, reflect: true, attribute: 'subscribed-to' },
			_provider: { type: Object, attribute: false }
		};
	}

	constructor() {
		super();
		this.selectionInfo = new SelectionInfo();
		this._provider = null;
	}

	connectedCallback() {
		super.connectedCallback();
		// delay subscription otherwise import/upgrade order can cause selection mixin to miss event
		requestAnimationFrame(() => {
			if (!this.subscribedTo) {
				const evt = new CustomEvent('d2l-selection-observer-subscribe', {
					bubbles: true,
					composed: true,
					detail: {}
				});
				this.dispatchEvent(evt);
				this._provider = evt.detail.provider;
			} else {
				this._provider = this.getRootNode().querySelector(`#${this.subscribedTo}`);
				if (this._provider) this._provider.subscribeObserver(this);
			}
		});
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		if (!this._provider) return;
		this._provider.unsubscribeObserver(this);
	}

};
