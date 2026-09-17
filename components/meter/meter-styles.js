import '../colors/colors.js';
import { css, unsafeCSS } from 'lit';
import { getFlag } from '../../helpers/flags.js';

const overflowWrapValue = unsafeCSS(getFlag('GAUD-10606-overflow-wrap-anywhere', true) ? 'anywhere' : 'normal');

export const meterStyles = css`
	.d2l-meter-container {
		display: flex;
		flex-direction: column;
		justify-content: center;
	}
	.d2l-meter-full-bar,
	.d2l-meter-progress-bar {
		fill: none;
		stroke-linecap: round;
	}
	.d2l-meter-full-bar {
		stroke: var(--d2l-color-gypsum);
	}
	:host([foreground-light]) .d2l-meter-full-bar {
		stroke: rgba(255, 255, 255, 0.5);
	}
	.d2l-meter-progress-bar {
		stroke: var(--d2l-color-celestine);
	}
	:host([foreground-light]) .d2l-meter-progress-bar {
		stroke: white;
	}
	.d2l-meter-text {
		color: var(--d2l-color-ferrite);
		fill: var(--d2l-color-ferrite);
		line-height: 0.8rem;
		overflow-wrap: ${overflowWrapValue};
		text-align: center;
	}
	:host([foreground-light]) .d2l-meter-text {
		color: white;
		fill: white;
	}
	.d2l-meter-text-ltr {
		direction: ltr;
	}
`;
