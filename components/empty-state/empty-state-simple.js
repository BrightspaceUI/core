import '../button/button-subtle.js';
import { emptyStateSimpleStyles, emptyStateStyles } from './empty-state-styles.js';
import { html, LitElement } from 'lit';
import { bodyCompactStyles } from '../typography/styles.js';
import { PropertyRequiredMixin } from '../../mixins/property-required/property-required-mixin.js';
import { RtlMixin } from '../../mixins/rtl/rtl-mixin.js';

/**
 * The `d2l-empty-state-simple` component is an empty state component that displays a description. An empty state action component can be placed inside of the default slot to add an optional action.
 * @slot - Slot for empty state actions
 */
class EmptyStateSimple extends PropertyRequiredMixin(RtlMixin(LitElement)) {

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

	render() {
		return html`
			<div class="empty-state-container">
				<p class="d2l-body-compact d2l-empty-state-description">${this.description}</p>
				<slot class="action-slot"></slot>
			</div>
		`;
	}

}

customElements.define('d2l-empty-state-simple', EmptyStateSimple);
