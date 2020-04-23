import '../colors/colors.js';
import { css } from 'lit-element/lit-element.js';

export const skeletonStyles = css`
	@keyframes d2lLoadingShimmer {
		0% { transform: translate3d(-100%, 0, 0); }
		100% { transform: translate3d(100%, 0, 0); }
	}

	@-webkit-keyframes d2lLoadingShimmer {
		0% { -webkit-transform: translate3d(-100%, 0, 0); }
		100% { -webkit-transform: translate3d(100%, 0, 0); }
	}

	.d2l-skeleton {
		display: block;
		border-radius: 4px;
		background-color: var(--d2l-color-sylvite);
		overflow: hidden;
		position: relative;
	}

	.d2l-skeleton::after {
		animation: d2lLoadingShimmer 1.8s ease-in-out infinite;
		-webkit-animation: d2lLoadingShimmer 1.8s ease-in-out infinite;
		background: linear-gradient(90deg, var(--d2l-color-sylvite), var(--d2l-color-regolith), var(--d2l-color-sylvite));
		background-color: var(--d2l-color-sylvite);
		content: '';
		height: 100%;
		left: 0;
		position: absolute;
		top: 0;
		width: 100%;
	}

	.d2l-skeleton[hidden] {
		display: none;
	}
`;
