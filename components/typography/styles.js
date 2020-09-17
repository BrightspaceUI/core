import { css } from 'lit-element/lit-element.js';

export const bodyStandardStyles = css`
	.d2l-body-standard {
		font-size: 0.95rem;
		font-weight: 400;
		line-height: 1.4rem;
	}
	:host([skeleton]) .d2l-body-standard.d2l-skeletize::before {
		bottom: 0.35rem;
		top: 0.3rem;
	}
	@media (max-width: 615px) {
		.d2l-body-standard {
			font-size: 0.8rem;
			line-height: 1.2rem;
		}
		:host([skeleton]) .d2l-body-standard.d2l-skeletize::before {
			bottom: 0.3rem;
			top: 0.3rem;
		}
	}
`;

export const bodyCompactStyles = css`
	.d2l-body-compact {
		font-size: 0.8rem;
		font-weight: 400;
		line-height: 1.2rem;
	}
	:host([skeleton]) .d2l-body-compact.d2l-skeletize::before {
		bottom: 0.3rem;
		top: 0.3rem;
	}
`;

export const bodySmallStyles = css`
	.d2l-body-small {
		color: var(--d2l-color-tungsten);
		font-size: 0.7rem;
		font-weight: 400;
		line-height: 1rem;
		margin: auto;
	}
	:host([skeleton]) .d2l-body-small.d2l-skeletize::before {
		bottom: 0.25rem;
		top: 0.2rem;
	}
	@media (max-width: 615px) {
		.d2l-body-small {
			font-size: 0.6rem;
			line-height: 0.9rem;
		}
		:host([skeleton]) .d2l-body-small.d2l-skeletize::before {
			bottom: 0.25rem;
			top: 0.2rem;
		}
	}
`;

export const heading1Styles = css`
	.d2l-heading-1 {
		font-size: 2rem;
		font-weight: 400;
		line-height: 2.4rem;
		margin: 1.5rem 0 1.5rem 0;
	}
	:host([skeleton]) .d2l-heading-1.d2l-skeletize {
		height: 2.4rem;
		overflow: hidden;
	}
	:host([skeleton]) .d2l-heading-1.d2l-skeletize::before {
		bottom: 0.45rem;
		top: 0.45rem;
	}
	@media (max-width: 615px) {
		.d2l-heading-1 {
			font-size: 1.5rem;
			line-height: 1.8rem;
		}
		:host([skeleton]) .d2l-heading-1.d2l-skeletize {
			height: 1.8rem;
		}
		:host([skeleton]) .d2l-heading-1.d2l-skeletize::before {
			bottom: 0.3rem;
			top: 0.35rem;
		}
	}
`;

export const heading2Styles = css`
	.d2l-heading-2 {
		font-size: 1.5rem;
		font-weight: 400;
		line-height: 1.8rem;
		margin: 1.5rem 0 1.5rem 0;
	}
	:host([skeleton]) .d2l-heading-2.d2l-skeletize {
		height: 1.8rem;
		overflow: hidden;
	}
	:host([skeleton]) .d2l-heading-2.d2l-skeletize::before {
		bottom: 0.3rem;
		top: 0.35rem;
	}
	@media (max-width: 615px) {
		.d2l-heading-2 {
			font-size: 1rem;
			font-weight: 700;
			line-height: 1.5rem;
		}
		:host([skeleton]) .d2l-heading-2.d2l-skeletize {
			height: 1.5rem;
		}
		:host([skeleton]) .d2l-heading-2.d2l-skeletize::before {
			bottom: 0.35rem;
			top: 0.35rem;
		}
	}
`;

export const heading3Styles = css`
	.d2l-heading-3 {
		font-size: 1rem;
		font-weight: 700;
		line-height: 1.5rem;
		margin: 1.5rem 0 1.5rem 0;
	}
	:host([skeleton]) .d2l-heading-3.d2l-skeletize {
		height: 1.5rem;
		overflow: hidden;
	}
	:host([skeleton]) .d2l-heading-3.d2l-skeletize::before {
		bottom: 0.35rem;
		top: 0.35rem;
	}
	@media (max-width: 615px) {
		.d2l-heading-3 {
			font-size: 0.8rem;
			line-height: 1.2rem;
		}
		:host([skeleton]) .d2l-heading-3.d2l-skeletize {
			height: 1.2rem;
		}
		:host([skeleton]) .d2l-heading-3.d2l-skeletize::before {
			bottom: 0.3rem;
			top: 0.25rem;
		}
	}
`;

export const heading4Styles = css`
	.d2l-heading-4 {
		font-size: 0.8rem;
		font-weight: 700;
		line-height: 1.2rem;
		margin: 1.5rem 0 1.5rem 0;
	}
	:host([skeleton]) .d2l-heading-4.d2l-skeletize {
		height: 1.2rem;
		overflow: hidden;
	}
	:host([skeleton]) .d2l-heading-4.d2l-skeletize::before {
		bottom: 0.25rem;
		top: 0.25rem;
	}
`;

export const labelStyles = css`
	.d2l-label-text {
		font-size: 0.7rem;
		font-weight: 700;
		letter-spacing: 0.2px;
		line-height: 1rem;
	}
	:host([skeleton]) .d2l-label-text.d2l-skeletize::before {
		bottom: 0.25rem;
		top: 0.15rem;
	}
`;
