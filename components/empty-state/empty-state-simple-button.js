import '../button/button-subtle.js';
import { emptyStateSimpleStyles, emptyStateStyles } from './empty-state-styles.js';
import { html, LitElement } from 'lit';
import { bodySmallStyles } from '../typography/styles.js';
import { RtlMixin } from '../../mixins/rtl-mixin.js';

/**
 * The `d2l-empty-state-simple-button` component is an empty state component that displays a description and action button.
 * @fires d2l-empty-state-action - Dispatched when the action button is clicked
 */
class EmptyStateSimpleButton extends RtlMixin(LitElement) {

	static get properties() {
		return {
			/**
			 * Optional: The action text to be used in the subtle button
			 * @type {String}
			 */
			actionText: { type: String, attribute: 'action-text' },
			/**
			 * REQUIRED: A description giving details about the empty state
			 * @type {String}
			 */
			description: { type: String },
		};
	}

	static get styles() {
		return [emptyStateStyles, emptyStateSimpleStyles, bodySmallStyles];
	}

	render() {
		return html`
			<p class="d2l-body-small">${this.description}</p>
			${this.actionText && html`<d2l-button-subtle @click=${this._handleActionClick} text=${this.actionText}  h-align="text"></d2l-button-subtle>`}
		`;
	}

	_handleActionClick(e) {
		e.stopPropagation();
		this.dispatchEvent(new CustomEvent('d2l-empty-state-action'));
	}

}

customElements.define('d2l-empty-state-simple-button', EmptyStateSimpleButton);
