import { css } from 'lit-element/lit-element.js';

export const skeletonStyles = css`
	@keyframes loadingPulse {
		0% { background-color: var(--d2l-color-sylvite); }
		50% { background-color: var(--d2l-color-regolith); }
		75% { background-color: var(--d2l-color-sylvite); }
		100% { background-color: var(--d2l-color-sylvite); }
	}

	:host([skeleton]) .skeletize::before {
		content: "";
		position: absolute;
		top: 0;
		bottom: 0;
		right: 0;
		left: 0;
		border-radius: 0.2rem;
		animation: loadingPulse 1.8s linear infinite;
		background-color: var(--d2l-color-sylvite);
		z-index: 2000;
	}

	:host([skeleton]) .skeletize {
		position: relative;
		color: transparent;
		border: none;
		box-shadow: none;
	}
`;
