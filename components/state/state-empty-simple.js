import '../button/button-subtle.js';
import { stateSimpleStyles, stateStyles } from './state-styles.js';
import { html, LitElement } from 'lit';
import { bodyCompactStyles } from '../typography/styles.js';
import { StateMixin } from './state-mixin.js';

/**
 * The `d2l-state-simple` component is an state component that displays a description. An state action component can be placed inside of the default slot to add an optional action.
 * @slot - Slot for state actions
 */
class StateEmptySimple extends StateMixin(LitElement) {

	static styles = [bodyCompactStyles, stateStyles, stateSimpleStyles];

	render() {
		return html`
			<div class="state-container">
				<p class="d2l-body-compact d2l-state-description" tabindex="-1">${this.description}</p>
				<slot class="action-slot"></slot>
			</div>
		`;
	}

}

customElements.define('d2l-state-empty-simple', StateEmptySimple);
