import '../offscreen/offscreen.js';
import '../icons/icon.js';
import { html, LitElement, nothing } from 'lit';
import { _generateInlineLinkIconStyles } from '../icons/icon-styles.js';
import { bodyCompactStyles } from '../typography/styles.js';
import { FocusMixin } from '../../mixins/focus-mixin.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { linkStyles } from '../link/link.js';
import { LocalizeCoreElement } from '../../helpers/localize-core-element.js';
import { PropertyRequiredMixin } from '../../mixins/property-required/property-required-mixin.js';

const inlineLinkIconStyles = _generateInlineLinkIconStyles('#new-window');

/**
 * `d2l-empty-state-action-link` is an empty state action component that can be placed inside of the default slot of `empty-state-simple` or `empty-state-illustrated` to add a link action to the component.
 */
class EmptyStateActionLink extends LocalizeCoreElement(FocusMixin(PropertyRequiredMixin(LitElement))) {

	static properties = {
		/**
		 * REQUIRED: The action text to be used in the subtle button
		 * @type {string}
		 */
		text: { type: String, required: true },
		/**
		 * REQUIRED: The action URL or URL fragment of the link
		 * @type {string}
		 */
		href: { type: String, required: true },
		/**
		 * The target attribute specifies where to open the link.
		 * @type {string}
		 */
		target: { type: String },
	};
	static styles = [bodyCompactStyles, linkStyles, inlineLinkIconStyles];

	static get focusElementSelector() {
		return '.d2l-link';
	}

	render() {
		const newWindowElements = (this.target === '_blank')
			? html`<span id="new-window"><span style="font-size: 0;">&nbsp;</span><d2l-icon icon="tier1:new-window"></d2l-icon></span><d2l-offscreen>${this.localize('components.link.open-in-new-window')}</d2l-offscreen>`
			: nothing;
		const actionLink = this.text && this.href
			? html`
				<a class="d2l-body-compact d2l-link" href=${this.href} target=${ifDefined(this.target)}>${this.text}${newWindowElements}</a>`
			: nothing;

		return html`${actionLink}`;
	}

}

customElements.define('d2l-empty-state-action-link', EmptyStateActionLink);
