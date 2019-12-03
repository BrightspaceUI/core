import '../../loading-spinner/loading-spinner.js';
import { AsyncContainerMixin, asyncStates } from '../async-container-mixin.js';
import { html, LitElement } from 'lit-element/lit-element.js';

class AsyncContainer extends AsyncContainerMixin(LitElement) {

	static get properties() {
		return {
			_showPending: { type: Boolean }
		};
	}

	constructor() {
		super();
		this._showPending = false;
	}

	render() {
		if (this.asyncState === asyncStates.complete) {
			return html`<slot></slot>`;
		} else if (this.asyncState === asyncStates.pending && this._showPending) {
			return html`<d2l-loading-spinner></d2l-loading-spinner>`;
		} else {
			return html`<slot name="initial"></slot>`;
		}
	}

	updated(changedProperties) {
		if (!changedProperties.has('asyncState')) return;
		if (this.asyncState === asyncStates.pending && changedProperties.get('asyncState') === asyncStates.initial) {
			setTimeout(() => {
				if (this.asyncState === asyncStates.pending) this._showPending = true;
			}, 100);
		} else {
			this._showPending = false;
		}
	}

}

customElements.define('d2l-async-demo-container', AsyncContainer);
