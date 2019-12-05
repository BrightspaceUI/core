import { AsyncContainerMixin, asyncStates } from '../async-container-mixin.js';
import { html, LitElement } from 'lit-element/lit-element.js';

class AsyncContainer extends AsyncContainerMixin(LitElement) {

	render() {
		if (this.asyncState === asyncStates.complete) {
			return html`<slot></slot>`;
		} else if (this.asyncState === asyncStates.pending) {
			return html`<slot name="pending"></slot>`;
		} else {
			return html`<slot name="initial"></slot>`;
		}
	}

	updated(changedProperties) {
		if (!changedProperties.has('asyncState')) return;
		this.dispatchEvent(new CustomEvent('d2l-async-demo-container-changed', {
			composed: true,
			bubbles: true,
			detail: { state: this.asyncState }
		}));
	}

}

customElements.define('d2l-async-demo-container', AsyncContainer);
