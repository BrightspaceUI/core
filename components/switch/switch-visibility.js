import '../icons/icon.js';
import { html, LitElement } from 'lit-element/lit-element.js';
import { LocalizeCoreElement } from '../../lang/localize-core-element.js';
import { SwitchMixin } from './switch-mixin.js';

class VisibilitySwitch extends LocalizeCoreElement(SwitchMixin(LitElement)) {

	get text() {
		return (this._text ? this._text : this.localize('components.switch.visibility'));
	}

	set text(val) {
		const oldVal = this._text;
		if (oldVal !== val) {
			this._text = val;
			this.requestUpdate('text', oldVal);
		}
	}

	get offIcon() {
		return html`<d2l-icon icon="tier1:visibility-hide"></d2l-icon>`;
	}

	get onIcon() {
		return html`<d2l-icon icon="tier1:visibility-show"></d2l-icon>`;
	}

}

customElements.define('d2l-switch-visibility', VisibilitySwitch);
