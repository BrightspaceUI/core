import { css } from 'lit-element/lit-element.js';

export const meterStyles = css`
	.full-bar,
	.progress-bar {
		stroke-width: 9;
		stroke-linecap: round;
		fill: none;
	}
	.full-bar {
		stroke: var(--d2l-color-gypsum);
	}
	.progress-bar {
		stroke: var(--d2l-color-celestine);
	}
`;
