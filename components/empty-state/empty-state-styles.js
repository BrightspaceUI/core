import '../colors/colors.js';
import { css } from 'lit';

export const emptyStateStyles = css`

	:host {
		border: 1px solid var(--d2l-color-mica);
		border-radius: 0.3rem;
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
		padding-right: 0.5rem;
	}

`;

export const emptyStateIllustratedStyles = css`

	:host {
		text-align: center;
	}

	#d2l-empty-state-description {
		margin: 0 auto 0.3rem;
		width: 500px;
		max-width: 100%;
	}

	#d2l-empty-state-title {
		margin-bottom: 0.9rem;
	}

	svg {
		max-width: 475px;
		width: 100%;
	}

	::slotted(*) {
		display: none;
	}

	::slotted(svg:first-child) {
		display: inline-block;
	}

	@media (max-width: 615px) {

		#d2l-empty-state-title {
			margin-top: 0.5rem;
		}

		:host([illustration-name="calendar"]) #d2l-empty-state-title{
			margin-top: 1rem;
		}

		:host([illustration-name="checklist"]) #d2l-empty-state-title {
			margin-top: 1.3rem;
		}

		svg {
			max-height: 200px;
		}

	}

	@media (min-width: 616px) {
		#d2l-empty-state-title {
			margin-top: 1rem;
		}
	}

`;
