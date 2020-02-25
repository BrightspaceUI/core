import '../colors/colors.js';
import { css } from 'lit-element/lit-element.js';

export const calendarStyles = css`
	:host {
		display: block;
		min-width: 18rem;
	}

	table {
		border-collapse: collapse;
		border-spacing: 0;
		table-layout: fixed;
		width: 100%;
	}

	th[role="columnheader"] {
		border-bottom: 1px solid var(--d2l-color-gypsum);
		padding-bottom: 0.6rem;
		padding-top: 0.3rem;
	}

	abbr {
		text-decoration: none;
	}

	.d2l-calendar {
		border-radius: 4px;
	}

	.d2l-calendar-title {
		border-top-left-radius: 4px;
		border-top-right-radius: 4px;
		text-align: center;
	}

	.d2l-calendar-title .d2l-heading-4 {
		height: 100%;
		margin: 0;
	}

	.d2l-calendar-date {
		align-items: center;
		border: 2px solid transparent;
		border-radius: 8px;
		color: var(--d2l-color-ferrite);
		cursor: pointer;
		display: flex;
		font-size: 0.8rem;
		height: 2rem;
		justify-content: center;
		margin-left: auto;
		margin-right: auto;
		position: relative;
		text-align: center;
		width: 2rem;
	}

	.d2l-calendar-date:hover:not(.d2l-calendar-date-selected),
	.d2l-calendar-date.d2l-calendar-date-hover:not(.d2l-calendar-date-selected) {
		background-color: var(--d2l-color-gypsum);
	}

	.d2l-calendar-date:focus {
		border: 2px solid var(--d2l-color-celestine);
		outline: none;
	}

	tbody > tr:first-child div {
		margin-top: 0.3rem;
	}

	.d2l-calendar-date-selected {
		background-color: var(--d2l-color-celestine-plus-2);
		border: 1px solid var(--d2l-color-celestine);
	}

	.d2l-calendar-date-today,
	.d2l-calendar-date-selected {
		font-size: 1rem;
		font-weight: 700;
	}
`;
