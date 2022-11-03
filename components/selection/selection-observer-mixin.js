import { cssEscape } from '../../helpers/dom.js';
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
			selectionInfo: { type: Object },
			_provider: { state: true }
		};
	}

	constructor() {
		super();
		this.selectionInfo = new SelectionInfo();
		this.__provider = null;
	}

	connectedCallback() {
		super.connectedCallback();
		// delay subscription otherwise import/upgrade order can cause selection mixin to miss event
		requestAnimationFrame(() => {
			if (this.selectionFor || this._provider) return;

			const evt = new CustomEvent('d2l-selection-observer-subscribe', {
				bubbles: true,
				composed: true,
				detail: {}
			});
			this.dispatchEvent(evt);
			this._setProvider(evt.detail.provider, false);
		});
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		if (this._selectionForObserver) this._selectionForObserver.disconnect();
		if (this._provider) this._provider.unsubscribeObserver(this);
	}

	updated(changedProperties) {
		super.updated(changedProperties);

		if (changedProperties.has('selectionFor')) {
			if (this._selectionForObserver) this._selectionForObserver.disconnect();
			this._updateProvider();

			if (this.selectionFor) {
				this._selectionForObserver = new MutationObserver(() => this._updateProvider());

				this._selectionForObserver.observe(this.getRootNode(), {
					childList: true,
					subtree: true
				});
			}
		}
	}

	get _provider() {
		return this.__provider;
	}

	set _provider(newProvider) {
		this._setProvider(newProvider, true);
	}

	_setProvider(newProvider, updateSubscriptions) {
		const oldProvider = this.__provider;
		if (newProvider === oldProvider) return;

		this.__provider = newProvider;
		if (updateSubscriptions) {
			if (oldProvider) oldProvider.unsubscribeObserver(this);
			if (newProvider) newProvider.subscribeObserver(this);
			else this.selectionInfo = new SelectionInfo();
		}

		this.requestUpdate('_provider', oldProvider);
	}

	_updateProvider() {
		this._provider = this.selectionFor && this.getRootNode().querySelector(`#${cssEscape(this.selectionFor)}`);
	}
};
