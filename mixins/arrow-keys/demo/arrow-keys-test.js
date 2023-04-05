import '../../../components/colors/colors.js';
import { css, html, LitElement } from 'lit';
import { ArrowKeysMixin } from '../arrow-keys-mixin.js';

export class ArrowKeysTest extends ArrowKeysMixin(LitElement) {

	static get styles() {
		return css`
			:host {
				display: inline-block;
			}
			.d2l-arrowkeys-focusable {
				border: 2px solid var(--d2l-color-ferrite);
				border-radius: 4px;
				display: inline-block;
				padding: 1rem;
			}
			.d2l-arrowkeys-focusable:focus {
				border: 2px solid var(--d2l-color-celestine);
			}
		`;
	}

	render() {
		const inner = html`
			<div class="d2l-arrowkeys-focusable" tabindex="0"></div>
			<div class="d2l-arrowkeys-focusable" tabindex="-1"></div>
			<div class="d2l-arrowkeys-focusable" tabindex="-1"></div>
			<div class="d2l-arrowkeys-focusable" tabindex="-1"></div>
			<div class="d2l-arrowkeys-focusable" tabindex="-1"></div>`;

		return html`<div id="d2l-arrowkeys-mixin-test">
			${this.arrowKeysContainer(inner)}
		</div>`;
	}
}

customElements.define('d2l-test-arrow-keys', ArrowKeysTest);
