import { css } from 'lit-element/lit-element.js';

export const checkboxStyles = css`
	input[type="checkbox"] {
		-webkit-appearance: none;
		-moz-appearance: none;
		appearance: none;
		background-position: center center;
		background-repeat: no-repeat;
		background-size: 1.2rem 1.2rem;
		border-radius: 0.3rem;
		border-style: solid;
		box-sizing: border-box;
		display: inline-block;
		height: 1.2rem;
		margin: 0;
		padding: 0;
		transition-duration: 0.5s;
		transition-timing-function: ease;
		transition-property: background-color, border-color;
		vertical-align: middle;
		width: 1.2rem;
	}
	input[type="checkbox"]:checked {
		background-image: url("data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%3E%3Cpath%20fill%3D%22%23565A5C%22%20d%3D%22M8.4%2016.6c.6.6%201.5.6%202.1%200l8-8c.6-.6.6-1.5%200-2.1-.6-.6-1.5-.6-2.1%200l-6.9%207-1.9-1.9c-.6-.6-1.5-.6-2.1%200-.6.6-.6%201.5%200%202.1l2.9%202.9z%22/%3E%3C/svg%3E%0A");
	}
	input[type="checkbox"]:indeterminate {
		background-image: url("data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%3E%3Cpath%20fill%3D%22%23565A5C%22%20d%3D%22M7.5%2C11h9c0.8%2C0%2C1.5%2C0.7%2C1.5%2C1.5l0%2C0c0%2C0.8-0.7%2C1.5-1.5%2C1.5h-9C6.7%2C14%2C6%2C13.3%2C6%2C12.5l0%2C0%0A%09C6%2C11.7%2C6.7%2C11%2C7.5%2C11z%22/%3E%3C/svg%3E%0A");
	}
	input[type="checkbox"],
	input[type="checkbox"]:hover:disabled {
		background-color: #f9fafb;
		border-color: #d3d9e3;
		border-width: 1px;
	}
	input[type="checkbox"]:hover,
	input[type="checkbox"]:focus,
	input[type="checkbox"].d2l-input-checkbox-focus {
		border-color: #006fbf;
		border-width: 2px;
		outline-width: 0;
	}
	`;
