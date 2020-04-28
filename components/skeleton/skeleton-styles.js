import '../colors/colors.js';
import { css } from 'lit-element/lit-element.js';

export const skeletonStyles = css`
	@keyframes d2lLoadingShimmer {
		0% {
			fill: var(--d2l-color-sylvite);
			background-color: var(--d2l-color-sylvite);
		}
		50% {
			fill: var(--d2l-color-regolith);
			background-color: var(--d2l-color-regolith);
		}
		75% {
			fill: var(--d2l-color-sylvite);
			background-color: var(--d2l-color-sylvite);
		}
		100% {
			fill: var(--d2l-color-sylvite);
			background-color: var(--d2l-color-sylvite);
		}
	}

	@-webkit-keyframes d2lLoadingShimmer {
		0% {
			fill: var(--d2l-color-sylvite);
			background-color: var(--d2l-color-sylvite);
		}
		50% {
			fill: var(--d2l-color-regolith);
			background-color: var(--d2l-color-regolith);
		}
		75% {
			fill: var(--d2l-color-sylvite);
			background-color: var(--d2l-color-sylvite);
		}
		100% {
			fill: var(--d2l-color-sylvite);
			background-color: var(--d2l-color-sylvite);
		}
	}

	.d2l-skeleton {
		animation: d2lLoadingShimmer 1.8s linear infinite;
		-webkit-animation: d2lLoadingShimmer 1.8s linear infinite;
		display: block;
		border-radius: 4px;
		background-color: var(--d2l-color-sylvite);
		fill: var(--d2l-color-sylvite);
		overflow: hidden;
		position: relative;
	}

	.d2l-skeleton[hidden] {
		display: none;
	}
`;
