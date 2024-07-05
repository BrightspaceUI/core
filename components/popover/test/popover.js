import { LitElement } from 'lit';
import { PopoverMixin } from '../popover-mixin.js';

class Popover extends PopoverMixin(LitElement) {
	static get styles() {
		return super.styles;
	}
	render() {
		return this._renderPopover();
	}
}
customElements.define('d2l-test-popover', Popover);
