import '../button/button.js';
import '../button/button-subtle.js';
import { html, LitElement, nothing } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { EmptyStateIllustratedMixin } from './empty-state-illustrated-mixin.js';
import { runAsync } from '../../directives/run-async/run-async.js';
import { styleMap } from 'lit/directives/style-map.js';

/**
 * The `d2l-empty-state-illustrated-button` component is an empty state component that displays an illustration and action button. The illustration property can be set to use one of the preset illustrations or a custom SVG illustration can be added in the default slot.
 * @fires d2l-empty-state-action - Dispatched when the action button is clicked
 * @slot - Custom SVG content if `illustration-name` property is not set
 */
class EmptyStateIllustratedButton extends EmptyStateIllustratedMixin(LitElement) {

	static get properties() {
		return {
			/**
			 * This will change the action button to use a primary button instead of the default subtle button
			 * @type {boolean}
			 */
			primary: { type: Boolean },
		};
	}

	constructor() {
		super();
		this._illustratedComponentType = 'button';
	}

	render() {
		const illustrationContainerStyle = this.getIllustrationContainerStyle();
		const titleClass = this.getTitleClass();

		let actionButton = nothing;
		if (this.actionText) {
			actionButton = this.primary
				? html`<d2l-button
							class="d2l-empty-state-action"
							@click=${this._handleActionClick}
							primary>${this.actionText}
						</d2l-button>`
				: html`<d2l-button-subtle
							class="d2l-empty-state-action"
							@click=${this._handleActionClick}
							text=${this.actionText}>
						</d2l-button-subtle>`;
		}

		return html`
			${this.illustrationName
		? html`
			<div style="${styleMap(illustrationContainerStyle)}">
				${runAsync(this.illustrationName, () => this.getIllustration(this.illustrationName), { success: (illustration) => illustration }, { pendingState: false })}
			</div>`
		: html`<slot></slot>`}

			<p class="${classMap(titleClass)}">${this.titleText}</p>
			<p class="d2l-body-compact d2l-empty-state-description">${this.description}</p>
			${actionButton}
		`;
	}

	_handleActionClick(e) {
		e.stopPropagation();
		this.dispatchEvent(new CustomEvent('d2l-empty-state-action'));
	}

}

customElements.define('d2l-empty-state-illustrated-button', EmptyStateIllustratedButton);
