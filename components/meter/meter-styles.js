import '../colors/colors.js';
import { css } from 'lit';

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
		text-align: center;
	}
	:host([foreground-light]) .d2l-meter-text {
		color: white;
		fill: white;
	}
	:host([dir="rtl"]) .d2l-meter-text-ltr {
		direction: ltr;
	}
`;
