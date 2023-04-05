import '../button/button-subtle.js';
import { emptyStateSimpleStyles, emptyStateStyles } from './empty-state-styles.js';
import { html, LitElement } from 'lit';
import { bodyCompactStyles } from '../typography/styles.js';
import { RtlMixin } from '../../mixins/rtl/rtl-mixin.js';

/**
 * The `d2l-empty-state-simple` component is an empty state component that displays a description. An empty state action component can be placed inside of the default slot to add an optional action.
 * @slot - Slot for empty state actions
 */
class EmptyStateSimple extends RtlMixin(LitElement) {

	static get properties() {
		return {
			/**
			 * REQUIRED: A description giving details about the empty state
			 * @type {string}
			 */
			description: { type: String },
		};
	}

	static get styles() {
		return [bodyCompactStyles, emptyStateStyles, emptyStateSimpleStyles];
	}

	constructor() {
		super();
		this._missingDescriptionErrorHasBeenThrown = false;
		this._validatingDescriptionTimeout = null;
	}

	firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);
		this._validateDescription();
	}

	render() {
		return html`
			<p class="d2l-body-compact d2l-empty-state-description">${this.description}</p>
			<slot class="action-slot"></slot>
		`;
	}

	_validateDescription() {
		clearTimeout(this._validatingDescriptionTimeout);
		// don't error immediately in case it doesn't get set immediately
		this._validatingDescriptionTimeout = setTimeout(() => {
			this._validatingDescriptionTimeout = null;
			const hasDescription = (typeof this.description === 'string') && this.description.length > 0;

			if (!hasDescription && !this._missingDescriptionErrorHasBeenThrown) {
				this._missingDescriptionErrorHasBeenThrown = true;
				setTimeout(() => { throw new Error('<d2l-empty-state-simple>: missing required "description" attribute.'); });
			}
		}, 3000);
	}

}

customElements.define('d2l-empty-state-simple', EmptyStateSimple);
