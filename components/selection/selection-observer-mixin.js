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
			/**
			 * HtmlElement of the `SelectionMixin` component this component wants to observe (alternative to selectionFor)
			 * @type {string}
			 */
			selectionProvider: { attribute: false },
			_provider: { state: true }
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
			if (this.selectionFor || this.selectionProvider) return;

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
		if (this._selectionForObserver) this._selectionForObserver.disconnect();
		if (this._provider) this._provider.unsubscribeObserver(this);
	}

	updated(changedProperties) {
		super.updated(changedProperties);

		if (changedProperties.has('selectionFor')) {
			if (this._selectionForObserver) this._selectionForObserver.disconnect();
			this._updateProviderFor();

			if (this.selectionFor) {
				this._selectionForObserver = new MutationObserver(() => this._updateProviderFor());

				this._selectionForObserver.observe(this.getRootNode(), {
					childList: true,
					subtree: true
				});
			}
		}
		if (changedProperties.has('selectionProvider')) {
			this._updateProvider(this.selectionProvider);
		}
	}

	_updateProvider(selectionComponent) {
		if (this._provider === selectionComponent) return;
		if (this._provider) this._provider.unsubscribeObserver(this);

		this._provider = selectionComponent;
		if (this._provider) {
			this._provider.subscribeObserver(this);
		} else {
			this.selectionInfo = new SelectionInfo();
		}
	}

	_updateProviderFor() {
		const selectionComponent = this.selectionFor && this.getRootNode().querySelector(`#${cssEscape(this.selectionFor)}`);
		this._updateProvider(selectionComponent);
	}
};
