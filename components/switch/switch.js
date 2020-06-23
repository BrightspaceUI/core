import '../colors/colors.js';
import '../icons/icon.js';
import '../icons/icon-custom.js';
import { html, LitElement } from 'lit-element/lit-element.js';
import { SwitchMixin } from './switch-mixin.js';

class Switch extends SwitchMixin(LitElement) {

	get offIcon() {
		return html`
			<d2l-icon-custom size="tier1">
				<svg viewBox="0 0 18 18" height="18" width="18" xmlns="http://www.w3.org/2000/svg">
					<circle cx="9" cy="9" r="6" stroke="var(--d2l-color-tungsten)" stroke-width="3" fill="none" />
				</svg>
			</d2l-icon-custom>
		`;
	}

	get onIcon() {
		return html`<d2l-icon icon="tier1:check"></d2l-icon>`;
	}

}

customElements.define('d2l-switch', Switch);
