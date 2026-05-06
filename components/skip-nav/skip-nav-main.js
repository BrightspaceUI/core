import './skip-nav-custom.js';
import { html, LitElement } from 'lit';
import { FocusMixin } from '../../mixins/focus/focus-mixin.js';
import { LocalizeCoreElement } from '../../helpers/localize-core-element.js';
import { querySelectorComposed } from '../../helpers/dom.js';

/**
 * A components which provides a "skip to main content" link which automatically skip to the main element
 */
class SkipNavMain extends FocusMixin(LocalizeCoreElement(LitElement)) {

	static get focusElementSelector() {
		return 'd2l-skip-nav-custom';
	}

	render() {
		return html`<d2l-skip-nav-custom text="${this.localize('components.skip-nav.skipToMainContent')}" @click="${this.#handleSkipNav}" class="vdiff-target"></d2l-skip-nav-custom>`;
	}

	#handleSkipNav() {
		const elem = querySelectorComposed(document, 'main') ||
			querySelectorComposed(document, '[role="main"]') ||
			querySelectorComposed(document, 'h1');
		if (elem) {
			elem.tabIndex = -1;
			elem.focus();
		} else {
			/**
			 * @ignore
			 */
			this.dispatchEvent(new CustomEvent('d2l-skip-nav-main-fail', { bubbles: false, composed: false }));
		}
	}

}

customElements.define('d2l-skip-nav-main', SkipNavMain);
