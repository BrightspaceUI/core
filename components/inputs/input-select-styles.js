import '../colors/colors.js';
import { css } from 'lit-element/lit-element.js';

export const selectStyles = css`
	.d2l-input-select {
		-webkit-appearance:none;
		-moz-appearance: none;
		appearance: none;
		background-position: right center;
		background-repeat: no-repeat;
		background-size: contain;
		border-radius: 0.3rem;
		border-style: solid;
		box-sizing: border-box;
		color: var(--d2l-color-ferrite);
		display: inline-block;
		font-family: inherit;
		font-size: 0.8rem;
		font-weight: 400;
		height: auto;
		letter-spacing: 0.02rem;
		line-height: 1.2rem;
		margin: 0;
		max-height: calc(2rem + 2px);
		vertical-align: middle;
	}
	:host([dir='rtl']) .d2l-input-select {
		background-position: left center;
	}
	.d2l-input-select,
	.d2l-input-select:hover:disabled {
		background-color: #ffffff;
		border-color: var(--d2l-color-galena);
		border-width: 1px;
		box-shadow: inset 0 2px 0 0 rgba(181, 189, 194, .2); /* corundum */
		padding: 0.4rem 0.75rem;
	}
	.d2l-input-select,
	.d2l-input-select:disabled,
	.d2l-input-select:hover:disabled,
	.d2l-input-select:focus:disabled {
		background-image: url("data:image/svg+xml,%3Csvg%20width%3D%2242%22%20height%3D%2242%22%20viewBox%3D%220%200%2042%2042%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20fill%3D%22%23F1F5FB%22%20d%3D%22M0%200h42v42H0z%22%2F%3E%3Cpath%20stroke%3D%22%23CDD5DC%22%20d%3D%22M0%200v42%22%2F%3E%3Cpath%20d%3D%22M14.99%2019.582l4.95%204.95a1.5%201.5%200%200%200%202.122%200l4.95-4.95a1.5%201.5%200%200%200-2.122-2.122L21%2021.35l-3.888-3.89a1.5%201.5%200%200%200-2.12%202.122z%22%20fill%3D%22%23494C4E%22%2F%3E%3C%2Fsvg%3E");
		padding-right: calc(0.75rem + 42px);
	}
	:host([dir='rtl']) .d2l-input-select,
	:host([dir='rtl']) .d2l-input-select:disabled,
	:host([dir='rtl']) .d2l-input-select:hover:disabled,
	:host([dir='rtl']) .d2l-input-select:focus:disabled {
		background-image: url("data:image/svg+xml,%3Csvg%20width%3D%2242%22%20height%3D%2242%22%20viewBox%3D%220%200%2042%2042%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20fill%3D%22%23F1F5FB%22%20d%3D%22M0%200h42v42H0z%22%2F%3E%3Cpath%20stroke%3D%22%23CDD5DC%22%20d%3D%22M42%200v42%22%2F%3E%3Cpath%20d%3D%22M14.99%2019.582l4.95%204.95a1.5%201.5%200%200%200%202.122%200l4.95-4.95a1.5%201.5%200%200%200-2.122-2.122L21%2021.35l-3.888-3.89a1.5%201.5%200%200%200-2.12%202.122z%22%20fill%3D%22%23494C4E%22%2F%3E%3C%2Fsvg%3E");
		padding-right: 0.75rem;
		padding-left: calc(0.75rem + 42px);
	}
	.d2l-input-select:hover,
	.d2l-input-select:focus {
		background-image: url("data:image/svg+xml,%3Csvg%20width%3D%2242%22%20height%3D%2242%22%20viewBox%3D%220%200%2042%2042%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20fill%3D%22%23E3E9F1%22%20d%3D%22M0%200h42v42H0z%22%2F%3E%3Cpath%20stroke%3D%22%23CDD5DC%22%20d%3D%22M0%200v42%22%2F%3E%3Cpath%20d%3D%22M14.99%2019.582l4.95%204.95a1.5%201.5%200%200%200%202.122%200l4.95-4.95a1.5%201.5%200%200%200-2.122-2.122L21%2021.35l-3.888-3.89a1.5%201.5%200%200%200-2.12%202.122z%22%20fill%3D%22%23494C4E%22%2F%3E%3C%2Fsvg%3E");
		border-color: var(--d2l-color-celestine);
		border-width: 2px;
		outline-width: 0;
		padding: calc(0.4rem - 1px) calc(0.75rem - 1px);
		padding-right: calc(0.75rem + 42px - 1px);
	}
	:host([dir='rtl']) .d2l-input-select:hover,
	:host([dir='rtl']) .d2l-input-select:focus {
		background-image: url("data:image/svg+xml,%3Csvg%20width%3D%2242%22%20height%3D%2242%22%20viewBox%3D%220%200%2042%2042%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20fill%3D%22%23E3E9F1%22%20d%3D%22M0%200h42v42H0z%22%2F%3E%3Cpath%20stroke%3D%22%23CDD5DC%22%20d%3D%22M42%200v42%22%2F%3E%3Cpath%20d%3D%22M14.99%2019.582l4.95%204.95a1.5%201.5%200%200%200%202.122%200l4.95-4.95a1.5%201.5%200%200%200-2.122-2.122L21%2021.35l-3.888-3.89a1.5%201.5%200%200%200-2.12%202.122z%22%20fill%3D%22%23494C4E%22%2F%3E%3C%2Fsvg%3E");
		padding-left: calc(0.75rem + 42px - 1px);
		padding-right: calc(0.75rem - 1px);
	}
	/* IE11 to prevent selection styling */
	.d2l-input-select:focus::-ms-value,
	.d2l-input-select:hover::-ms-value {
		background-color: transparent;
		color: var(--d2l-color-ferrite);
	}
	/* IE11 to hide the native chevron */
	.d2l-input-select::-ms-expand {
		display: none;
	}
	.d2l-input-select[aria-invalid='true'] {
		border-color: var(--d2l-color-cinnabar);
	}
	.d2l-input-select:disabled {
		opacity: 0.5;
	}
`;
