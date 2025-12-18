import '../../components/colors/colors.js';
import { css } from 'lit';

export const d2lTemplateScrollStyles = css`
	.d2l-template-scroll::-webkit-scrollbar {
		width: 8px;
	}

	.d2l-template-scroll::-webkit-scrollbar-track {
		background: rgba(255, 255, 255, 0.4);
	}

	.d2l-template-scroll::-webkit-scrollbar-thumb {
		background: var(--d2l-color-galena);
		border-radius: 4px;
	}

	.d2l-template-scroll::-webkit-scrollbar-thumb:hover {
		background: var(--d2l-color-tungsten);
	}

	/* For Firefox */
	.d2l-template-scroll {
		scrollbar-color: var(--d2l-color-galena) rgba(255, 255, 255, 0.4);
		scrollbar-width: thin;
	}
`;
