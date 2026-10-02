import '../button/button-subtle.js';
import { html, LitElement } from 'lit';
import { stateSimpleStyles, stateStyles } from '../state/state-styles.js';
import { bodyCompactStyles } from '../typography/styles.js';
import { emptyStateStyles } from './empty-state-styles.js';
import { StateMixin } from '../state/state-mixin.js';

/**
 * The `d2l-empty-state-simple` component is an empty state component that displays a description. An empty state action component can be placed inside of the default slot to add an optional action.
 * @slot - Slot for empty state actions
 */
class EmptyStateSimple extends StateMixin(LitElement) {

	static styles = [bodyCompactStyles, stateStyles, stateSimpleStyles, emptyStateStyles];

	render() {
		return html`
			<div class="state-container">
				<p class="d2l-body-compact d2l-state-description" tabindex="-1">${this.description}</p>
				<slot class="action-slot"></slot>
			</div>
		`;
	}

}

customElements.define('d2l-empty-state-simple', EmptyStateSimple);
