import { css, html, LitElement } from 'lit';
import { getFlag } from '../../helpers/flags.js';
import { _offscreenStyleDeclarations, offscreenStyles } from './offscreen-styles.js';

export { _offscreenStyleDeclarations, offscreenStyles };

/**
 * A component for positioning content offscreen to only be visible to screen readers.
 * @slot - Default content placed inside of the component
 */
class Offscreen extends LitElement {
	static styles = css`
		:host {
			${_offscreenStyleDeclarations}
		}
	`;
	render() {
		return html`<slot></slot>`;
	}
}
customElements.define('d2l-offscreen', Offscreen);
