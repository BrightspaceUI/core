import { css, html, LitElement } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { d2lTemplateScrollStyles } from '../shared/scroll-styles.js';
import { LocalizeCoreElement } from '../../helpers/localize-core-element.js';

const isWindows = window.navigator.userAgent.indexOf('Windows') > -1;

/**
 * A single panel page template
 * @slot content - Main page content
 */
class LayoutPrimary extends LocalizeCoreElement(LitElement) {

	static get styles() {
		return [d2lTemplateScrollStyles, css`
			:host {
				display: block;
				height: 100%;
				width: 100%;
			}

			:host([hidden]) {
				display: none;
			}

			.d2l-layout-primary-content {
				height: 100%;
				overflow: auto;
				width: 100%;
			}
		`];
	}

	render() {
		const scrollClasses = {
			'd2l-template-scroll': isWindows,
			'd2l-layout-primary-content': true
		};
		return html`
			<div class="${classMap(scrollClasses)}">
				<slot></slot>
			</div>
		`;
	}

}

customElements.define('d2l-layout-primary', LayoutPrimary);
