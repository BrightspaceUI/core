import '../colors/colors.js';
import { bodyCompactStyles } from '../typography/styles.js';
import { css } from 'lit';
import { getFocusRingStyles } from '../../helpers/focus.js';

export const stateStyles = css`
	${bodyCompactStyles}
	:host {
		display: block;
	}

	:host([hidden]) {
		display: none;
	}

	.action-slot::slotted(*) {
		display: none;
	}

	.action-slot::slotted(d2l-state-action-button:first-of-type),
	.action-slot::slotted(d2l-state-action-link:first-of-type) {
		display: inline;
	}
	.d2l-state-description {
		--d2l-focus-ring-offset: 3px;
		border-radius: 0.3rem;
	}
	${getFocusRingStyles('.d2l-state-description')}
`;

export const stateSimpleStyles = css`

	:host {
		border: 1px solid var(--d2l-color-mica);
		border-radius: 0.3rem;
		padding: 1.2rem 1.5rem;
	}

	:host([description]) .state-container {
		align-items: center;
		column-gap: 0.75rem;
		display: flex;
		flex-wrap: wrap;
		padding-inline-start: 0;
	}

	.d2l-state-description {
		margin: 0;
	}

`;

export const stateIllustratedStyles = css`

	:host {
		text-align: center;
	}

	.illustration-slot::slotted(*) {
		display: none;
	}

	.illustration-slot::slotted(img:first-of-type),
	.illustration-slot::slotted(svg:first-of-type) {
		display: inline-block;
	}

	svg {
		height: 100%;
		max-width: 500px;
		width: 100%;
	}

	.d2l-state-title {
		margin-bottom: 0.9rem;
	}

	.d2l-state-title-large {
		font-size: 1.5rem;
		line-height: 1.8rem;
		margin: 1rem 0 1.5rem 0;
	}

	.d2l-state-title-small {
		font-size: 1rem;
		font-weight: 700;
		line-height: 1.5rem;
		margin-top: 0.5rem;
	}

	.d2l-state-description {
		margin: 0 auto 0.8rem;
		max-width: 500px;
		width: 100%;
	}

`;
