import '../colors/colors.js';
import { css } from 'lit';

export const isWindows = window.navigator.userAgent.indexOf('Windows') > -1;
export const isMobile = window.navigator.userAgent.indexOf('mobile') > -1;

export const pageScrollStyles = css`
	.d2l-page-scroll::-webkit-scrollbar {
		width: 8px;
	}

	.d2l-page-scroll::-webkit-scrollbar-track {
		background: rgba(255, 255, 255, 0.4);
	}

	.d2l-page-scroll::-webkit-scrollbar-thumb {
		background: var(--d2l-color-galena);
		border-radius: 4px;
	}

	.d2l-page-scroll::-webkit-scrollbar-thumb:hover {
		background: var(--d2l-color-tungsten);
	}

	/* For Firefox */
	.d2l-page-scroll {
		scrollbar-color: var(--d2l-color-galena) rgba(255, 255, 255, 0.4);
		scrollbar-width: thin;
	}
`;

export const panelStyles = css`
	.panel {
		display: flex;
		flex-direction: column;
		height: 100%;
	}

	.panel-header {
		background-color: white;
		border-bottom: 1px solid var(--d2l-color-mica);
		flex: none;
		height: 70px;
		overflow: hidden;
		position: sticky;
    	top: 0;
	}

	.panel-scroll {
		height: 100%;
		overflow: auto;
	}
`;
