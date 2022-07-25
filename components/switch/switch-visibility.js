import '../icons/icon.js';
import '../tooltip/tooltip-help.js';
import { css, html, LitElement } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { LocalizeCoreElement } from '../../helpers/localize-core-element.js';
import { SwitchMixin } from './switch-mixin.js';

/**
 * A variant of the generic switch configured with special icons and default text for toggling "visibility".
 * @slot - Optional content that will be displayed within the "conditions" opener tooltip when the switch is on.
 */
class VisibilitySwitch extends LocalizeCoreElement(SwitchMixin(LitElement)) {

	static get properties() {
		return {
			_hasConditions: { state: true }
		};
	}

	static get styles() {
		return [super.styles, css`
			d2l-tooltip-help {
				display: none;
			}
			d2l-tooltip-help.switch-visibility-conditions-show {
				display: inline;
			}
		`];
	}

	constructor() {
		super();
		this._hasConditions = false;
	}

	get text() {
		if (this._text) return this._text;

		if (this.on && this._hasConditions) {
			return this.localize('components.switch.visibleWithPeriod');
		}
		else if (this.on) {
			return this.localize('components.switch.visible');
		}
		else {
			return this.localize('components.switch.hidden');
		}
	}

	// TODO: remove this (along with this._text) when we no longer have any consumers overriding the label text
	set text(val) {
		const oldVal = this._text;
		if (oldVal !== val) {
			this._text = val;
			this.requestUpdate('text', oldVal);
		}
	}

	get offIcon() {
		return html`<d2l-icon icon="tier1:visibility-hide"></d2l-icon>`;
	}

	get onIcon() {
		return html`<d2l-icon icon="tier1:visibility-show"></d2l-icon>`;
	}

	get _labelContent() {
		if (this._text) return super._labelContent;

		const tooltipHelpClasses = {
			'switch-visibility-conditions-show': this.on && this._hasConditions
		};

		const conditions = html`
			<d2l-tooltip-help 
				class="${classMap(tooltipHelpClasses)} d2l-switch-text" 
				id="conditions-help" 
				inherit-font-style>
				text="${this.localize('components.switch.conditions')}" 
				<slot @slotchange="${this._handleConditionsSlotChange}"></slot>
			</d2l-tooltip-help>
			`;

		return html`${super._labelContent}${conditions}`;
	}

	_handleConditionsSlotChange(e) {
		this._hasConditions = e.target.assignedNodes({ flatten: true }).length > 0;
	}
}

customElements.define('d2l-switch-visibility', VisibilitySwitch);
