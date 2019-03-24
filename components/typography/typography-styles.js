import { css } from 'lit-element/lit-element.js';

export const typographyStyles = css`
	.d2l-body-standard-text {
		font-size: 0.95rem;
		font-weight: 400;
		line-height: 1.4rem;
	}
	.d2l-body-compact-text {
		font-size: 0.8rem;
		font-weight: 400;
		line-height: 1.2rem;
	}
	.d2l-body-small-text {
		color: var(--d2l-color-tungsten);
		font-size: 0.7rem;
		font-weight: 400;
		line-height: 1rem;
		margin: auto;
	}
	.d2l-heading-1 {
		font-size: 2rem;
		font-weight: 400;
		line-height: 2.4rem;
		margin: 1.5rem 0 1.5rem 0;
	}
	.d2l-heading-2 {
		font-size: 1.5rem;
		font-weight: 400;
		line-height: 1.8rem;
		margin: 1.5rem 0 1.5rem 0;
	}
	.d2l-heading-3 {
		font-size: 1rem;
		font-weight: 700;
		line-height: 1.5rem;
		margin: 1.5rem 0 1.5rem 0;
	}
	.d2l-heading-4 {
		font-size: 0.8rem;
		font-weight: 700;
		line-height: 1.2rem;
		margin: 1.5rem 0 1.5rem 0;
	}
	.d2l-label-text {
		font-size: 0.7rem;
		line-height: 1rem;
		font-weight: 700;
		letter-spacing: 0.2px;
	}
	@media (max-width: 615px) {
		.d2l-body-standard {
			font-size: 0.8rem;
			line-height: 1.2rem;
		}
		.d2l-body-compact {
			font-size: 0.8rem;
			line-height: 1.2rem;
		}
		.d2l-body-small {
			font-size: 0.6rem;
			line-height: 0.9rem;
		}
		.d2l-label-text {
			font-size: 0.6rem;
			line-height: 0.9rem;
		}
		.d2l-heading-1 {
			font-size: 1.5rem;
			font-weight: 400;
			line-height: 1.8rem;
		}
		.d2l-heading-2 {
			font-size: 1rem;
			font-weight: 700;
			line-height: 1.5rem;
		}
		.d2l-heading-3,
		.d2l-heading-4 {
			font-size: 0.8rem;
			font-weight: 700;
			line-height: 1.2rem;
		}
	}
`;
