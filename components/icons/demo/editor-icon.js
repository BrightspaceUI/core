import '../icon-custom.js';
import { css, html, LitElement } from 'lit';
import { bodyCompactStyles } from '../../typography/styles.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';

class EditorIcon extends LitElement {

	static properties = {
		svg: { type: String },
		text: { type: String }
	};

	static styles = [bodyCompactStyles, css`
		:host {
			align-items: center;
			display: flex;
			gap: 1rem;
			margin-block-end: 0.5rem;
		}
	`];

	render() {
		return html`
			<d2l-icon-custom size="tier1">${unsafeHTML(this.svg)}</d2l-icon-custom>
			<div class="d2l-body-compact">${this.text}</div>
		`;
	}

}
customElements.define('d2l-demo-editor-icon', EditorIcon);
