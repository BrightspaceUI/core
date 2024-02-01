import '../colors/colors.js';
import { css } from 'lit';

export const emptyStateStyles = css`

	:host {
		display: block;
	}

	:host([hidden]) {
		display: none;
	}

	:host([description]) .empty-state-container {
		align-items: center;
		column-gap: 0.5rem;
		display: flex;
		flex-wrap: wrap;
	}

	.action-slot::slotted(*) {
		display: none;
	}

	.action-slot::slotted(d2l-empty-state-action-button:first-of-type),
	.action-slot::slotted(d2l-empty-state-action-link:first-of-type) {
		display: inline;
	}
`;

export const emptyStateSimpleStyles = css`

	:host {
		border: 1px solid var(--d2l-color-mica);
		border-radius: 0.3rem;
		padding: 1.2rem 1.5rem;
	}

	.d2l-empty-state-description {
		display: inline;
		line-height: 28px;
		margin: 0;
	}
`;

export const emptyStateIllustratedStyles = css`

	:host {
		text-align: center;
	}

	.illustration-slot::slotted(*) {
		display: none;
	}

	.illustration-slot::slotted(img:first-of-type),
	.illustration-slot::slotted(svg:first-of-type) {
		display: inline-block;
	}

	svg {
		height: 100%;
		max-width: 500px;
		width: 100%;
	}

	.d2l-empty-state-title {
		margin-bottom: 0.9rem;
	}

	.d2l-empty-state-title-large {
		font-size: 1.5rem;
		line-height: 1.8rem;
		margin: 1rem 0 1.5rem 0;
	}

	.d2l-empty-state-title-small {
		font-size: 1rem;
		font-weight: 700;
		line-height: 1.5rem;
		margin-top: 0.5rem;
	}

	.d2l-empty-state-description {
		margin: 0 auto 0.8rem;
		max-width: 500px;
		width: 100%;
	}

`;
