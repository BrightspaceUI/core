import { css, html, LitElement } from 'lit';

/**
 * Component to be placed in the footer slot of d2l-page, providing consistent padding
 * @slot - The main content of the footer panel
 * @slot end - Optional content placed at the end of the footer
 */
class PageFooter extends LitElement {

	static styles = css`
		.footer {
			display: flex;
			justify-content: space-between;
			padding: 0 1rem 0.75rem; /* To do: Padding needs to be figured out */
		}
		.start, .end {
			align-items: center;
			display: flex;
			flex-wrap: wrap; /* To do: Keep off so consumers are encouraged to use overflow group? */
			gap: 0.5rem; /* To do: Padding needs to be figured out */
		}
	`;

	render() {
		return html`
			<div class="footer">
				<div class="start"><slot></slot></div>
				<div class="end"><slot name="end"></slot></div>
			</div>

		`;
	}

}

customElements.define('d2l-page-footer', PageFooter);
