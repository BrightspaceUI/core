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
		this.addEventListener('d2l-selection-observer-subscribe', this._handleSelectionObserverSubscribe);

		// delay subscription otherwise import/upgrade order can cause selection mixin to miss event
		requestAnimationFrame(() => {
			if (this.selectionFor) {
				this._handleSelectionFor();
				return this._provider?.subscribeObserver(this);
			}

			const evt = new CustomEvent('d2l-selection-observer-subscribe', {
				bubbles: true,
				composed: true,
				detail: {}
			});
			this.dispatchEvent(evt);
			this._provider = evt.detail.provider;
		});
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		this._disconnectSelectionForObserver();
		this._disconnectProvider();
		this.removeEventListener('d2l-selection-observer-subscribe', this._handleSelectionObserverSubscribe);
	}

	updated(changedProperties) {
		super.updated(changedProperties);

		if (changedProperties.has('selectionFor')) this._handleSelectionFor();
	}

	_disconnectProvider() {
		if (!this._provider) return;
		this._provider.unsubscribeObserver(this);
		this._provider = undefined;
	}

	_disconnectSelectionForObserver() {
		if (!this._selectionForObserver) return;
		this._selectionForObserver.disconnect();
		this._selectionForObserver = undefined;
	}

	_handleSelectionFor() {
		this._disconnectSelectionForObserver();
		this._updateProvider();

		if (this.selectionFor) {
			this._selectionForObserver = new MutationObserver(() => this._updateProvider());

			this._selectionForObserver.observe(this.getRootNode(), {
				childList: true,
				subtree: true
			});
		}
	}

	_handleSelectionObserverSubscribe(e) {
		if (this._provider) {
			const target = e.composedPath()[0];
			if (target === this) return;

			e.stopPropagation();
			e.detail.provider = this._provider;
			this._provider.subscribeObserver(target);
		}
	}

	_updateProvider() {
		const selectionComponent = this.selectionFor ? this.getRootNode().querySelector(`#${cssEscape(this.selectionFor)}`) : undefined;
		if (this._provider === selectionComponent) return;

		this._disconnectProvider();
		this._provider = selectionComponent;
		if (this._provider) {
			this._provider.subscribeObserver(this);
		} else {
			this.selectionInfo = new SelectionInfo();
		}
	}
};
