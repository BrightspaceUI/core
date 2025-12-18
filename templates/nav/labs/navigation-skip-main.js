import './navigation-skip.js';
import { html, LitElement } from 'lit';
import { FocusMixin } from '../../../mixins/focus/focus-mixin.js';
import { LocalizeLabsElement } from './localize-labs-element.js';
import { querySelectorComposed } from '../../../helpers/dom.js';

class NavigationSkipMain extends FocusMixin(LocalizeLabsElement(LitElement)) {

	static get focusElementSelector() {
		return 'd2l-labs-navigation-skip';
	}

	render() {
		return html`<d2l-labs-navigation-skip text="${this.localize('components:navigation:skipNav')}" @click="${this._handleSkipNav}" class="vdiff-target"></d2l-labs-navigation-skip>`;
	}

	_handleSkipNav() {
		const elem = querySelectorComposed(document, 'main') ||
			querySelectorComposed(document, '[role="main"]') ||
			querySelectorComposed(document, 'h1');
		if (elem) {
			elem.tabIndex = -1;
			elem.focus();
		} else {
			this.dispatchEvent(new CustomEvent('d2l-labs-navigation-skip-fail', { bubbles: false, composed: false }));
		}
	}

}

customElements.define('d2l-labs-navigation-skip-main', NavigationSkipMain);
