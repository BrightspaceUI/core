import './navigation-link-icon.js';
import { css, html, LitElement } from 'lit';
import { FocusMixin } from '../../../mixins/focus-mixin.js';
import { LocalizeLabsElement } from './localize-labs-element.js';

class NavigationLinkBack extends LocalizeLabsElement(FocusMixin(LitElement)) {

	static get properties() {
		return {
			text: { type: String },
			href: { type: String }
		};
	}

	static get styles() {
		return css`
			:host {
				display: inline-block;
				height: 100%;
			}
			:host([hidden]) {
				display: none;
			}
		`;
	}

	static get focusElementSelector() {
		return 'd2l-labs-navigation-link-icon';
	}

	render() {
		const href = this.href ? this.href : 'javascript:void(0);'; // backwards-compatible for uses before missing "href" threw exception
		const text = this.text ? this.text : this.localize('components:navigation:back');
		return html`<d2l-labs-navigation-link-icon href="${href}" icon="tier1:chevron-left" text="${text}"></d2l-labs-navigation-link-icon>`;
	}

}

customElements.define('d2l-labs-navigation-link-back', NavigationLinkBack);
