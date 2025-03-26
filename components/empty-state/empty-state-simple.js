import '../button/button-subtle.js';
import { emptyStateSimpleStyles, emptyStateStyles } from './empty-state-styles.js';
import { html, LitElement } from 'lit';
import { bodyCompactStyles } from '../typography/styles.js';
import { PropertyRequiredMixin } from '../../mixins/property-required/property-required-mixin.js';
import { RtlMixin } from '../../mixins/rtl/rtl-mixin.js';
import { FocusMixin } from '../../mixins/focus/focus-mixin.js';
import { getFirstFocusableDescendant } from '../../helpers/focus.js';

/**
 * The `d2l-empty-state-simple` component is an empty state component that displays a description. An empty state action component can be placed inside of the default slot to add an optional action.
 * @slot - Slot for empty state actions
 */
class EmptyStateSimple extends FocusMixin(PropertyRequiredMixin(RtlMixin(LitElement))) {

	static get properties() {
		return {
			/**
			 * REQUIRED: A description giving details about the empty state
			 * @type {string}
			 */
			description: { type: String, required: true },
		};
	}

	static get styles() {
		return [bodyCompactStyles, emptyStateStyles, emptyStateSimpleStyles];
	}

	static get focusElementSelector() {
		return 'p.d2l-empty-state-description';
	}

	render() {
		return html`
			<div class="empty-state-container">
				<p class="d2l-body-compact d2l-empty-state-description" tabindex="-1">${this.description}</p>
				<slot class="action-slot"></slot>
			</div>
		`;
	}

	_getFocusTarget() {
		const slotElement = this.shadowRoot.querySelector('slot.action-slot');
		const focusTarget = getFirstFocusableDescendant(slotElement);
		return focusTarget ?? super._getFocusTarget();
	}

}

customElements.define('d2l-empty-state-simple', EmptyStateSimple);
