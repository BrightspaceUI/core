import '../colors/colors.js';
import '../icons/icon.js';
import '../icons/icon-custom.js';
import { html, LitElement } from 'lit';
import { SwitchMixin } from './switch-mixin.js';

/**
 * A generic switch with on/off semantics.
 * @attr {string} text - ACCESSIBILITY: REQUIRED: Acts as the primary label for the switch. Visible unless text-position is `hidden`.
 * @fires d2l-switch-before-change - Dispatched before on-state is updated. Can be canceled to allow the consumer to handle switching the on-state. This is useful if something needs to happen prior to the on-state being switched.
 */
class Switch extends SwitchMixin(LitElement) {

	get offIcon() {
		return html`
			<d2l-icon-custom size="tier1">
				<svg viewBox="0 0 18 18" height="18" width="18" xmlns="http://www.w3.org/2000/svg">
					<circle cx="9" cy="9" r="6" stroke="var(--d2l-color-ferrite)" stroke-width="3" fill="none" />
				</svg>
			</d2l-icon-custom>
		`;
	}

	get onIcon() {
		return html`<d2l-icon icon="tier1:check"></d2l-icon>`;
	}

}

customElements.define('d2l-switch', Switch);
