import '../tooltip/tooltip.js';
import { html, LitElement } from 'lit';
import { FocusMixin } from '../../mixins/focus/focus-mixin.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { LocalizeCoreElement } from '../../helpers/localize-core-element.js';
import { PropertyRequiredMixin } from '../../mixins/property-required/property-required-mixin.js';
import { SlottedIconMixin } from '../icons/slotted-icon-mixin.js';
import { ThemeMixin } from '../../mixins/theme/theme-mixin.js';
import { toolbarButtonStyles } from './toolbar-item-styles.js';
import { ToolbarItemMixin } from './toolbar-item-mixin.js';

/**
 * An icon-only link for use in a toolbar.
 */
class ToolbarLink extends LocalizeCoreElement(SlottedIconMixin(FocusMixin(ToolbarItemMixin(ThemeMixin(PropertyRequiredMixin(LitElement)))))) {

	static properties = {
		/** Disables navigation while keeping the link focusable in the toolbar. */
		disabled: { type: Boolean },
		/** REQUIRED: URL or URL fragment of the link. */
		href: { type: String, required: true },
		/** Where to display the linked URL. */
		target: { type: String },
		/** ACCESSIBILITY: REQUIRED: Accessible label and tooltip text for the link. */
		text: { type: String, required: true }
	};

	static styles = [super.styles, toolbarButtonStyles];

	constructor() {
		super();
		this.disabled = false;
		this.text = '';
	}

	static get focusElementSelector() {
		return 'a';
	}

	render() {
		const opensInNewWindow = !this.disabled && this.target === '_blank';
		return html`
			<a
				aria-description="${ifDefined(opensInNewWindow ? this.localize('components.link.open-in-new-window') : undefined)}"
				aria-disabled="${ifDefined(this.disabled ? 'true' : undefined)}"
				class="toolbar-control"
				@click="${this.#handleClick}"
				href="${ifDefined(this.disabled ? undefined : this.href)}"
				id="action-link"
				rel="${ifDefined(opensInNewWindow ? 'noopener noreferrer' : undefined)}"
				role="${ifDefined(this.disabled ? 'link' : undefined)}"
				tabindex="${this._activeFocusable ? 0 : -1}"
				target="${ifDefined(this.target)}">
				<span class="background"></span>
				${this._renderIcon()}
			</a>
			<d2l-tooltip class="vdiff-target" for="action-link" for-type="label">${this.text}</d2l-tooltip>
		`;
	}

	#handleClick(event) {
		if (!this.disabled) return;
		event.preventDefault();
		event.stopPropagation();
	}

}

customElements.define('d2l-toolbar-link', ToolbarLink);
