import { html, LitElement } from 'lit-element/lit-element.js';
import { LocalizeMixin } from '../../mixins/localize-mixin.js';

class LocalizeNoResourcesTest extends LocalizeMixin(LitElement) {

	render() {
		requestAnimationFrame(
			() => this.dispatchEvent(new CustomEvent('d2l-test-localize-render', {
				bubbles: false,
				composed: false
			}))
		);
		return html``;
	}

}

customElements.define('d2l-test-localize-no-resources', LocalizeNoResourcesTest);
