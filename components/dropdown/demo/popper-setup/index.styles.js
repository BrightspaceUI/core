import { css } from 'lit';

export const popperStyles = css`
	.popper-tooltip {
		background: #ddd;
		font-weight: bold;
		padding: 4px 8px;
		font-size: 13px;
		border-radius: 4px;
		display: none;
		z-index: 10000;
	}

	.popper-tooltip[data-show] {
		display: inline;
	}

	.popper-arrow,
	.popper-arrow::before {
		position: absolute;
		width: 8px;
		height: 8px;
		background: inherit;
	}

	.popper-arrow {
		visibility: hidden;
	}

	.popper-arrow::before {
		visibility: visible;
		content: '';
		transform: rotate(45deg);
	}

	.popper-tooltip[data-popper-placement^='top'] > .popper-arrow {
		bottom: -4px;
	}

	.popper-tooltip[data-popper-placement^='bottom'] > .popper-arrow {
		top: -4px;
	}

	.popper-tooltip[data-popper-placement^='left'] > .popper-arrow {
		right: -4px;
	}

	.popper-tooltip[data-popper-placement^='right'] > .popper-arrow {
		left: -4px;
	}

	.popper-tooltip[data-popper-reference-hidden] {
		visibility: hidden;
		pointer-events: none;
	}

	.popper-tooltip[data-popper-reference-hidden] > .popper-arrow::before {
		visibility: hidden;
		pointer-events: none;
	}
`;
