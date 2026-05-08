import { css, html, LitElement } from 'lit';

/**
 * Component to be placed in the footer slot of d2l-page, providing consistent padding
 * @slot - The main content of the footer panel
 * @slot end - Optional content placed at the end of the footer
 */
class PageFooter extends LitElement {

	static styles = css`
		:host {
			display: flex;
			flex-wrap: nowrap;
			justify-content: space-between;
			padding: 0 var(--d2l-page-padding, 30px) 0.75rem;
		}
		.start, .end {
			align-items: center;
			display: flex;
			gap: 0.6rem;
		}
	`;

	render() {
		return html`
			<div class="start"><slot></slot></div>
			<div class="end"><slot name="end"></slot></div>
		`;
	}

}

customElements.define('d2l-page-footer', PageFooter);
