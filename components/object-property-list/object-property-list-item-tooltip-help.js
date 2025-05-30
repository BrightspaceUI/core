import '../tooltip/tooltip-help.js';
import { FocusMixin } from '../../mixins/focus/focus-mixin.js';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { ObjectPropertyListItem } from './object-property-list-item.js';

/**
 * A single object property, to be used within an object-property-list,
 * rendered as a help tooltip and with an optional icon.
 * @slot - Default content placed inside of the tooltip
 */
class ObjectPropertyListItemTooltipHelp extends FocusMixin(ObjectPropertyListItem) {
	static get properties() {
		return {
			/**
			 * Preset icon key (e.g. "tier1:gear")
			 * @type {string}
			 */
			icon: { type: String, reflect: true, },
			/**
			 * Allows this component to inherit certain font properties
			 * @type {boolean}
			 */
			inheritFontStyle: { type: Boolean, attribute: 'inherit-font-style' },
			/**
			 * ADVANCED: Force the internal tooltip to open in a certain direction. If no position is provided, the tooltip will open in the first position that has enough space for it in the order: bottom, top, right, left.
			 * @type {'top'|'bottom'|'left'|'right'}
			 */
			position: { type: String }
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
				?inherit-font-style=${this.inheritFontStyle}
				postion="${this.position}"
				?skeleton=${this.skeleton}
				text="${this.text}">
				<slot></slot>
				<slot slot="icon" name="icon"></slot>
			</d2l-tooltip-help>
		`;
	}
}

customElements.define('d2l-object-property-list-item-tooltip-help', ObjectPropertyListItemTooltipHelp);
