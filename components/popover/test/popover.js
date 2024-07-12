import { LitElement } from 'lit';
import { PopoverMixin } from '../popover-mixin.js';

class Popover extends PopoverMixin(LitElement) {

	static get properties() {
		return {
			/**
			 * Whether to disable auto-close/light-dismiss
			 * @type {boolean}
			 */
			noAutoClose: { type: Boolean, reflect: true, attribute: 'no-auto-close' },
			/**
			 * Whether to disable auto-focus on the first focusable element when opened
			 * @type {boolean}
			 */
			noAutoFocus: { type: Boolean, reflect: true, attribute: 'no-auto-focus' },
			/**
			 * Whether the popover is open or not
			 * @type {boolean}
			 */
			opened: { type: Boolean, reflect: true },
			/**
			 * Whether to render a d2l-focus-trap around the content
			 * @type {boolean}
			*/
			trapFocus: { type: Boolean, reflect: true, attribute: 'trap-focus' }
		};
	}

	static get styles() {
		return super.styles;
	}

	constructor() {
		super();
		this.noAutoClose = false;
		this.noAutoFocus = false;
		this.opened = false;
		this.trapFocus = false;
	}

	connectedCallback() {
		super.connectedCallback();
		this.addEventListener('d2l-popover-open', () => this.opened = true);
		this.addEventListener('d2l-popover-close', () => this.opened = false);
	}

	render() {
		return this._renderPopover();
	}

	willUpdate(changedProperties) {
		if (changedProperties.has('noAutoClose') || changedProperties.has('noAutoFocus') || changedProperties.has('trapFocus')) {
			super.configure({
				noAutoClose: this.noAutoClose,
				noAutoFocus: this.noAutoFocus,
				trapFocus: this.trapFocus
			});
		}
		if (changedProperties.has('opened')) {
			if (this.opened) this.open(true);
			else if (changedProperties.get('opened')) this.close();
		}
	}

}
customElements.define('d2l-test-popover', Popover);
