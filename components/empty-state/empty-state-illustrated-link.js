import '../link/link.js';
import { bodyCompactStyles, heading2Styles  } from '../typography/styles.js';
import { emptyStateIllustratedStyles, emptyStateStyles } from './empty-state-styles.js';
import { html, LitElement } from 'lit';
import { getIllustration } from './getIllustration.js';
import { RtlMixin } from '../../mixins/rtl-mixin.js';
import { runAsync } from '../../directives/run-async/run-async.js';

/**
 * The `d2l-empty-state-illustrated-link` component is an empty state component that displays an illustration and action link. The illustration property can be set to use one of the preset illustrations or a custom SVG illustration can be added in the default slot.
 * @slot - Custom SVG content if illustration property is not set
 */
class EmptyStateIllustratedLink extends RtlMixin(LitElement) {

	static get properties() {
		return {
			/**
			  * Optional: The action URL or URL fragment of the link
			  * @type {String}
			  */
			actionHref: { type: String, attribute: 'action-href' },
			/**
			 * Optional: The action text to be used in the link
			 * @type {String}
			 */
			actionText: { type: String, attribute: 'action-text' },
			/**
			 * REQUIRED: A description giving details about the empty state
			 * @type {String}
			 */
			description: { type: String },
			/**
			 * Optional: The name of the preset image you would like to display in the component
			 * @type {String}
			 */
			illustration: { type: String },
			/**
			 * REQUIRED: A title for the empty state
			 * @type {String}
			 */
			title: { type: String },
		};
	}

	static get styles() {
		return [emptyStateStyles, emptyStateIllustratedStyles, bodyCompactStyles, heading2Styles];
	}

	render() {
		return html`
			${this.illustration ? html`${runAsync(this.illustration, () => getIllustration(this.illustration), {
		success: (illustration) => illustration
	}, { pendingState: false })}` : html`<slot></slot>`}
            <p class="d2l-heading-2" id="d2l-empty-state-title">${this.title}</p>
			<p class="d2l-body-compact" id="d2l-empty-state-description">${this.description}</p>
			${this.actionText && html`<d2l-link href=${this.actionHref} small>${this.actionText}</d2l-link>`}
		`;
	}

}

customElements.define('d2l-empty-state-illustrated-link', EmptyStateIllustratedLink);
