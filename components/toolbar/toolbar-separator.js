import '../colors/colors.js';
import { css, html, LitElement } from 'lit';
import { ThemeMixin } from '../../mixins/theme/theme-mixin.js';

/**
 * A toolbar item separator
 */
class ToolbarSeparator extends ThemeMixin(LitElement) {

	static styles = css`
		:host {
			display: inline-block;
		}
		:host([hidden]) {
			display: none;
		}
		div {
			border-inline-start: 1px solid var(--d2l-theme-border-color-standard);
			min-height: 34px;
		}
		:host([theme="dark"]) div {
			border-inline-start: 1px solid var(--d2l-color-tungsten);
		}
	`;

	render() {
		return html`<div></div>`;
	}

}

customElements.define('d2l-toolbar-separator', ToolbarSeparator);
