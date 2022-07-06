import '../colors/colors.js';
import { css } from 'lit';

export const emptyStateStyles = css`

	:host {
		border: 1px solid var(--d2l-color-mica);
		border-radius: 6px;
		display: block;
		padding: 1.2rem 1.5rem;
	}

	:host([hidden]) {
		display: none;
	}

`;

export const emptyStateSimpleStyles = css`

	:host([dir="rtl"]) p {
		padding-left: 0.5rem;
		padding-right: 0;
	}

	p {
		display: inline;
		font-size: 0.7rem;
		line-height: 1rem;
		padding-right: 0.5rem;
	}

`;

export const emptyStateIllustratedStyles = css`

	:host {
		text-align: center;
	}

	#d2l-empty-state-description {
		margin-bottom: 0.3rem;
	}

	#d2l-empty-state-title {
		margin-bottom: 0.9rem;
		margin-top: 1.8rem;
	}

	svg {
		max-width: 375px;
		width: 45%;
	}

	::slotted(*) {
		display: none;
	}

	::slotted(svg:first-child) {
		display: inline-block;
	}

`;
