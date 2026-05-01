/**
 * Temporary navigation demo styles
 * These can be removed once we have official navigation components to use
 */

import { css } from 'lit';

export const navStyles = css`

	/* Shared Styles */
	.nav-shadow {
		background-color: rgba(0, 0, 0, 0.02);
		bottom: -4px;
		display: block;
		height: 4px;
		pointer-events: none;
		position: absolute;
		width: 100%;
		z-index: 1;
	}
	.nav-band {
		background: linear-gradient(180deg, var(--d2l-color-celestine) 1.5rem, #ffffff 0%);
		min-height: 4px;
	}
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
	.full-nav-wrapper {
		position: relative;
	}
	.full-nav-header {
		align-items: center;
		display: flex;
		height: 90px;
		margin-inline: var(--d2l-page-margin-inline);
		max-width: var(--d2l-page-header-max-width);
		padding: 0 30px;
	}
	@media (max-width: 767px) {
		.full-nav-header {
			height: 72px;
		}
	}
	@media (max-width: 615px) {
		.full-nav-header {
			padding: 0 15px;
		}
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
	@media (max-width: 615px) {
		.full-nav-header-spacer {
			min-width: 15px;
		}
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
	.full-nav-footer {
		border-bottom: 1px solid rgba(124, 134, 149, 0.18);
		border-top: 1px solid rgba(124, 134, 149, 0.18);
	}
	.full-nav-footer-inner {
		align-items: center;
		display: flex;
		gap: 4px;
		margin-inline: var(--d2l-page-margin-inline);
		max-width: var(--d2l-page-header-max-width);
		padding: 0 30px;
	}
	@media (max-width: 615px) {
		.full-nav-footer-inner {
			padding: 0 15px;
		}
	}
	.full-nav-footer-link {
		border-bottom: 4px solid transparent;
		color: var(--d2l-color-ferrite);
		display: inline-block;
		font-size: 0.7rem;
		padding: 8px 12px;
		text-decoration: none;
	}
	.full-nav-footer-link:hover,
	.full-nav-footer-link:focus-visible {
		border-bottom-color: var(--d2l-color-celestine);
		color: var(--d2l-color-celestine);
	}

	/* Immersive Nav Styles */
	.immersive-wrapper {
		background-color: white;
		border-bottom: 1px solid var(--d2l-color-mica);
		position: relative;
	}
	.immersive-container {
		align-items: center;
		display: flex;
		height: 3.1rem;
		justify-content: space-between;
		margin-inline: var(--d2l-page-margin-inline);
		max-width: var(--d2l-page-header-max-width);
		overflow: hidden;
		padding: 0 30px;
	}
	@media (max-width: 929px) {
		.immersive-container {
			padding: 0 24px;
		}
	}
	@media (max-width: 767px) {
		.immersive-container {
			padding: 0 18px;
		}
	}
	@media (max-width: 615px) {
		.immersive-container {
			height: 2.8rem;
		}
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
	@media (max-width: 615px) {
		.immersive-middle {
			margin: 0 18px;
			padding: 0 18px;
		}
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
