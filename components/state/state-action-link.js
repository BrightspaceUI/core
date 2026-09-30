import { html, LitElement, nothing } from 'lit';
import { bodyCompactStyles } from '../typography/styles.js';
import { FocusMixin } from '../../mixins/focus-mixin.js';
import { LinkMixin } from '../link/link-mixin.js';
import { linkStyles } from '../link/link.js';
import { PropertyRequiredMixin } from '../../mixins/property-required/property-required-mixin.js';

/**
 * `d2l-state-action-link` is an state action component that can be placed inside of the default slot of state components to add a link action.
 */
class StateActionLink extends LinkMixin(FocusMixin(PropertyRequiredMixin(LitElement))) {

	static properties = {
		/**
		 * REQUIRED: The action text to be used in the link
		 * @type {string}
		 */
		text: { type: String, required: true },
		/**
		 * REQUIRED: The action URL or URL fragment of the link
		 * @type {string}
		 */
		href: { type: String, required: true },
	};

	static styles = [super.styles, bodyCompactStyles, linkStyles];

	static get focusElementSelector() {
		return '.d2l-link';
	}

	get isStateActionLink() {
		return true;
	}

	render() {
		if (!this.text || !this.href) return nothing;
		const linkClasses = { 'd2l-body-compact': true, 'd2l-link': true };
		const inner = html`${this.text}${this._renderNewWindowIcon()}`;
		return this._render(inner, { linkClasses });
	}

}

customElements.define('d2l-state-action-link', StateActionLink);
