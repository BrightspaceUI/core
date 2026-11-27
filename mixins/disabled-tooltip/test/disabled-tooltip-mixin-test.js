import { html, LitElement } from 'lit';
import { DisabledTooltipMixin } from '../disabled-tooltip-mixin.js';

class DisabledTooltipTest extends DisabledTooltipMixin(LitElement) {
	render() {
		return html`<button
			aria-disabled="${this._ariaDisabledAttribute}"
			id="${this._controlId}"
			?disabled="${this._disabled}">
			Control
		</button>
		${this._renderDisabledTooltip()}`;
	}
};

customElements.define('disabled-tooltip-test', DisabledTooltipTest);
