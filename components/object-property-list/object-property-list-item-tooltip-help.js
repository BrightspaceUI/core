import '../tooltip/tooltip-help.js';
import { FocusMixin } from '../../mixins/focus/focus-mixin.js';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { ObjectPropertyListItem } from './object-property-list-item.js';

/**
 * A single object property, to be used within an object-property-list,
 * rendered as a help tooltip and with an optional icon.
 * @slot - Default content placed inside of the tooltip
 * @slot icon - Optional slot for a custom icon
 */
class ObjectPropertyListItemTooltipHelp extends FocusMixin(ObjectPropertyListItem) {
	static get properties() {
		return {
			/**
			 * Preset icon key (e.g. "tier1:gear")
			 * @type {string}
			 */
			icon: { type: String, reflect: true, },
		};
	}

	static get focusElementSelector() {
		return 'd2l-tooltip-help';
	}

	_renderText() {
		return html`
			<d2l-tooltip-help
				class="d2l-skeletize"
				icon="${ifDefined(this.icon)}"
				inherit-font-style
				?skeleton="${this.skeleton}"
				text="${this.text}">
				<slot></slot>
				<slot slot="icon" name="icon"></slot>
			</d2l-tooltip-help>
		`;
	}
}

customElements.define('d2l-object-property-list-item-tooltip-help', ObjectPropertyListItemTooltipHelp);
