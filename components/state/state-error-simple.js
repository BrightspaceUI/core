import '../button/button-subtle.js';
import { css, html, LitElement } from 'lit';
import { stateSimpleStyles, stateStyles } from './state-styles.js';
import { bodyCompactStyles } from '../typography/styles.js';
import { StateMixin } from './state-mixin.js';

/**
 * The `d2l-state-error-simple` component is an error state component that displays a description. An empty state action component can be placed inside of the default slot to add an optional action.
 * @slot - Slot for error state actions
 */
class StateErrorSimple extends StateMixin(LitElement) {

	static properties = {
		/**
		 * Always wrap action on next line
		 * @type {boolean}
		 */
		wrapAction: { type: Boolean, attribute: 'wrap-action', reflect: true },
	};

	static styles = [bodyCompactStyles, stateStyles, stateSimpleStyles, css`
		:host {
			border-inline-start: 0.3rem solid var(--d2l-color-cinnabar);
			padding-inline: 0.9rem 1.2rem;
		}
		.outer-container {
			column-gap: 0.9rem;
			display: grid;
			grid-template-columns: auto 1fr;
		}
		.d2l-state-icon {
			color: var(--d2l-color-cinnabar);
		}
		.state-container {
			row-gap: 0.3rem;
		}
		:host([wrap-action]) .d2l-state-description {
			flex-basis: 100%;
		}
	`];
	render() {
		return html`<div class="outer-container">
			<d2l-icon icon="tier2:alert" class="d2l-state-icon" aria-hidden="true"></d2l-icon>
			<div class="state-container">
				<p class="d2l-body-compact d2l-state-description" tabindex="-1">${this.description}</p>
				<slot class="action-slot"></slot>
			</div>
		</div>`;
	}

}

customElements.define('d2l-state-error-simple', StateErrorSimple);
