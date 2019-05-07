import { css } from 'lit-element/lit-element.js';

export const meterStyles = css`
	.d2l-meter-full-bar,
	.d2l-meter-progress-bar {
		stroke-width: 9;
		stroke-linecap: round;
		fill: none;
	}
	.d2l-meter-full-bar {
		stroke: var(--d2l-color-gypsum);
	}
	.d2l-meter-progress-bar {
		stroke: var(--d2l-color-celestine);
	}
`;
