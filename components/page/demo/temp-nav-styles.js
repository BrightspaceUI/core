/**
 * Temporary navigation demo styles
 * These can be removed once we have official navigation components to use
 */

import { css } from 'lit';

export const navStyles = css`
	/* Immersive Nav Styles */
	.immersive-container {
		align-items: center;
		display: flex;
		height: 3.1rem;
		justify-content: space-between;
		margin-inline: var(--d2l-page-margin-inline);
		max-width: var(--d2l-page-header-max-width);
		overflow: hidden;
	}
	.immersive-middle {
		border-inline-end: 1px solid var(--d2l-color-gypsum);
		border-inline-start: 1px solid var(--d2l-color-gypsum);
		flex: 0 1 auto;
		font-size: 0.8rem;
		margin: 0 24px;
		min-width: 0;
		overflow: hidden;
		padding: 0 24px;
		text-overflow: ellipsis;
		white-space: nowrap;
		width: 100%;
	}
	.immersive-right {
		align-items: center;
		display: flex;
		flex: 0 0 auto;
		height: 100%;
	}
`;
