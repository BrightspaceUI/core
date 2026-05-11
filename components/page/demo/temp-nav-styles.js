/**
 * Temporary navigation demo styles
 * These can be removed once we have official navigation components to use
 */

import { css } from 'lit';

export const navStyles = css`

	/* Full Nav Styles */
	.full-nav-header {
		align-items: center;
		display: flex;
		height: 90px;
	}
	.full-nav-header-left {
		align-items: center;
		display: flex;
		flex: 0 1 auto;
		gap: 5px;
		height: 100%;
	}
	.full-nav-header-spacer {
		flex: 1 1 auto;
		min-width: 30px;
	}
	.full-nav-header-right {
		align-items: center;
		display: flex;
		flex: 0 0 auto;
		height: 100%;
	}
	.full-nav-header-right d2l-page-header-button {
		margin-inline: 15px;
	}
	.full-nav-logo {
		background-color: var(--d2l-color-celestine);
		border-radius: 4px;
		color: white;
		font-size: 0.8rem;
		font-weight: 700;
		padding: 8px 14px;
	}
	.full-nav-footer-inner {
		align-items: center;
		display: flex;
		flex-wrap: wrap;
		gap: 20px;
	}
	.full-nav-footer-link {
		border-bottom: 4px solid transparent;
		color: var(--d2l-color-ferrite);
		display: inline-block;
		padding: 8px 0;
		text-decoration: none;
	}
	.full-nav-footer-link:hover,
	.full-nav-footer-link:focus-visible {
		border-bottom-color: var(--d2l-color-celestine);
		color: var(--d2l-color-celestine);
	}

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
