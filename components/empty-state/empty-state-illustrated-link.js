import { html, LitElement, nothing } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { EmptyStateIllustratedMixin } from './empty-state-illustrated-mixin.js';
import { linkStyles } from '../link/link.js';
import { runAsync } from '../../directives/run-async/run-async.js';
import { styleMap } from 'lit/directives/style-map.js';

/**
 * The `d2l-empty-state-illustrated-link` component is an empty state component that displays an illustration and action link. The illustration property can be set to use one of the preset illustrations or a custom SVG illustration can be added in the default slot.
 * @slot - Custom SVG content if `illustration-name` property is not set
 */
class EmptyStateIllustratedLink extends EmptyStateIllustratedMixin(LitElement) {

	static get properties() {
		return {
			/**
			  * Optional: The action URL or URL fragment of the link
			  * @type {string}
			  */
			actionHref: { type: String, attribute: 'action-href' },
		};
	}

	static get styles() {
		return [super.styles, linkStyles];
	}

	constructor() {
		super();
		this._illustratedComponentType = 'link';
	}

	render() {
		const illustrationContainerStyle = this._getIllustrationContainerStyle();
		const titleClass = this._getTitleClass();

		const actionLink = this.actionText && this.actionHref
			? html`<a class="d2l-body-compact d2l-empty-state-action d2l-link" href=${this.actionHref}>${this.actionText}</a>`
			: nothing;

		return html`
			${this.illustrationName
		? html`
			<div style="${styleMap(illustrationContainerStyle)}">
				${runAsync(this.illustrationName, () => this._getIllustration(this.illustrationName), { success: (illustration) => illustration }, { pendingState: false })}
			</div>`
		: html`<slot></slot>`}

			<p class="${classMap(titleClass)}" id="d2l-empty-state-title">${this.titleText}</p>
			<p class="d2l-body-compact d2l-empty-state-description">${this.description}</p>
			${actionLink}
		`;
	}

}

customElements.define('d2l-empty-state-illustrated-link', EmptyStateIllustratedLink);
