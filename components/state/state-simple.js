import '../button/button-subtle.js';
import { html, LitElement } from 'lit';
import { stateSimpleStyles, stateStyles } from './state-styles.js';
import { StateMixin } from './state-mixin.js';

/**
 * The `d2l-state-simple` component is a state component that displays a description. A state action component can be placed inside of the default slot to add an optional action.
 * @slot - Slot for state actions
 */
export class StateSimple extends StateMixin(LitElement) {

	static styles = [ stateStyles, stateSimpleStyles];

	render() {
		return html`
			<div class="state-container">
				<p class="d2l-body-compact d2l-state-description" tabindex="-1">${this.description}</p>
				<slot class="action-slot"></slot>
			</div>
		`;
	}

}

customElements.define('d2l-state-simple', StateSimple);
