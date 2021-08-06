import { cssEscape } from '../../helpers/dom.js';
import { SelectionInfo } from './selection-mixin.js';

export const SelectionObserverMixin = superclass => class extends superclass {

	static get properties() {
		return {
			/**
			 * Id of the SelectionMixin component this component wants to observe (if not located within that component)
			 */
			selectionFor: { type: String, reflect: true, attribute: 'selection-for' },
			/**
			 * The selection info (set by the selection component).
			 */
			selectionInfo: { type: Object },
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
			if (!this.selectionFor) {
				const evt = new CustomEvent('d2l-selection-observer-subscribe', {
					bubbles: true,
					composed: true,
					detail: {}
				});
				this.dispatchEvent(evt);
				this._provider = evt.detail.provider;
			} else {
				this._provider = this.getRootNode().querySelector(`#${cssEscape(this.selectionFor)}`);
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
