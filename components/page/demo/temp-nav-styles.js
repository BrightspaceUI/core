/**
 * Temporary navigation demo styles
 * These can be removed once we have official navigation components to use
 */

import { css } from 'lit';

export const navStyles = css`

	/* Shared Styles */
	.nav-icon-btn {
		align-items: center;
		background: none;
		border: none;
		border-radius: 4px;
		color: var(--d2l-color-ferrite);
		cursor: pointer;
		display: inline-flex;
		font-size: 0.8rem;
		gap: 4px;
		justify-content: center;
		min-height: 42px;
		min-width: 42px;
		padding: 6px;
	}
	.nav-icon-btn:hover,
	.nav-icon-btn:focus-visible {
		background-color: var(--d2l-color-gypsum);
		color: var(--d2l-color-celestine);
	}

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
		gap: 12px;
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
		gap: 6px;
		height: 100%;
	}
	.full-nav-logo {
		background-color: var(--d2l-color-celestine);
		border-radius: 4px;
		color: white;
		font-size: 0.8rem;
		font-weight: 700;
		padding: 8px 14px;
	}
	.full-nav-separator {
		background-color: var(--d2l-color-mica);
		height: 26px;
		margin: 0 6px;
		width: 1px;
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
	.immersive-left {
		align-items: center;
		color: var(--d2l-color-tungsten);
		display: flex;
		flex: 0 0 auto;
		font-size: 0.8rem;
		letter-spacing: 0.2px;
	}
	.immersive-back-link {
		align-items: center;
		color: var(--d2l-color-tungsten);
		display: inline-flex;
		gap: 4px;
		text-decoration: none;
	}
	.immersive-back-link:hover,
	.immersive-back-link:focus-visible {
		color: var(--d2l-color-celestine);
	}
	.immersive-back-icon {
		font-size: 1rem;
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
		gap: 8px;
	}
	.immersive-right .nav-icon-btn {
		font-size: 0.7rem;
	}
`;
