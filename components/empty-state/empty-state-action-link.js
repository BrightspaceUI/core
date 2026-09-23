import { html, LitElement } from 'lit';
import { bodyCompactStyles } from '../typography/styles.js';
import { FocusMixin } from '../../mixins/focus-mixin.js';
import { LinkMixin } from '../link/link-mixin.js';
import { linkStyles } from '../link/link.js';
import { PropertyRequiredMixin } from '../../mixins/property-required/property-required-mixin.js';

/**
 * `d2l-empty-state-action-link` is an empty state action component that can be placed inside of the default slot of `empty-state-simple` or `empty-state-illustrated` to add a link action to the component.
 */
class EmptyStateActionLink extends LinkMixin(FocusMixin(PropertyRequiredMixin(LitElement))) {

	static properties = {
		/**
		 * REQUIRED: The action text to be used in the subtle button
		 * @type {string}
		 */
		text: { type: String, required: true },
	};
	static styles = [super.styles, bodyCompactStyles, linkStyles];

	static get focusElementSelector() {
		return '.d2l-link';
	}

	render() {
		const linkClasses = { 'd2l-body-compact': true, 'd2l-link': true };
		const inner = html`${this.text}${this._renderNewWindowIcon()}`;
		return this._render(inner, { linkClasses });
	}

}

customElements.define('d2l-empty-state-action-link', EmptyStateActionLink);
