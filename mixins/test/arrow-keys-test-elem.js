import { html, LitElement } from 'lit-element/lit-element.js';
import { ArrowKeysMixin } from '../arrow-keys-mixin';

export class ArrowKeysTestElem extends ArrowKeysMixin(LitElement) {
	render() {
		const inner = html`
			<div class="d2l-arrowkeys-focusable" tabindex="-1"></div>
			<div class="d2l-arrowkeys-focusable" tabindex="-1"></div>
			<div class="d2l-arrowkeys-focusable" tabindex="-1"></div>
			<div class="d2l-arrowkeys-focusable" tabindex="-1"></div>
			<div class="d2l-arrowkeys-focusable" tabindex="-1"></div>`;

		return html`<div id="d2l-arrowkeys-mixin-test">
			${this.arrowKeysContainer(inner)}
		</div>`;
	}
}

customElements.define('arrow-keys-test-elem', ArrowKeysTestElem);
