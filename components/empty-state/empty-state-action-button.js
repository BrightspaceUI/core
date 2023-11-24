import '../button/button.js';
import '../button/button-subtle.js';
import { css, html, LitElement, nothing } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { PropertyRequiredMixin } from '../../mixins/property-required/property-required-mixin.js';

/**
 * `d2l-empty-state-action-button` is an empty state action component that can be placed inside of the default slot of `empty-state-simple` or `empty-state-illustrated` to add a button action to the component.
 * @fires d2l-empty-state-action - Dispatched when the action button is clicked
 * @fires d2l-empty-state-illustrated-check - Internal event
 */
class EmptyStateActionButton extends PropertyRequiredMixin(LitElement) {

	static get properties() {
		return {
			/**
			 * REQUIRED: The action text to be used in the button
			 * @type {string}
			 */
			text: { type: String, required: true },
			/**
			 * This will change the action button to use a primary button instead of the default subtle button. The primary attribute is only valid when `d2l-empty-state-action-button` is placed within `d2l-empty-state-illustrated` components
			 * @type {boolean}
			 */
			primary: { type: Boolean },
			_illustrated: { state: true }
		};
	}

	static get styles() {
		return css`
					.d2l-empty-state-action {
						vertical-align: top;
					}
				`;
	}

	constructor() {
		super();
		this._illustrated = false;
	}

	connectedCallback() {
		super.connectedCallback();
		requestAnimationFrame(() => {
			const e = new CustomEvent('d2l-empty-state-illustrated-check', {
				bubbles: true,
				detail: {}
			});
			this.dispatchEvent(e);
			this._illustrated = e.detail.illustrated | false;
		});
	}

	render() {
		let actionButton = nothing;
		if (this.text) {
			actionButton = this._illustrated && this.primary
				? html`<d2l-button
							class="d2l-empty-state-action"
							@click=${this._handleActionClick}
							primary>
								${this.text}
						</d2l-button>`
				: html`<d2l-button-subtle
							class="d2l-empty-state-action"
							@click=${this._handleActionClick}
							h-align="${ifDefined(!this._illustrated ? 'text' : undefined)}"
							?slim=${!this._illustrated}
							text=${this.text}>
						</d2l-button-subtle>`;
		}
		return html`${actionButton}`;
	}

	_handleActionClick(e) {
		e.stopPropagation();
		this.dispatchEvent(new CustomEvent('d2l-empty-state-action'));
	}

}

customElements.define('d2l-empty-state-action-button', EmptyStateActionButton);
