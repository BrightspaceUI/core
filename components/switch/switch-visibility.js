import '../icons/icon.js';
import { html, LitElement } from 'lit-element/lit-element.js';
import { SwitchMixin } from './switch-mixin.js';

class VisibilitySwitch extends SwitchMixin(LitElement) {

	constructor() {
		super();
		this.label = 'Visibility';
	}

	get offIcon() {
		return html`<d2l-icon icon="tier1:visibility-hide"></d2l-icon>`;
	}

	get onIcon() {
		return html`<d2l-icon icon="tier1:visibility-show"></d2l-icon>`;
	}

}

customElements.define('d2l-switch-visibility', VisibilitySwitch);
