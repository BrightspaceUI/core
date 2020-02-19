import '../colors/colors.js';
import { css } from 'lit-element/lit-element.js';

export const calendarStyles = css`
	:host {
		display: block;
		min-width: 350px;
	}

	table {
		border-collapse: separate;
		border-spacing: 0;
		table-layout: fixed;
		width: 100%;
	}

	th[role="columnheader"] {
		padding: 0.45rem 0;
	}

	th > abbr {
		color: var(--d2l-color-tungsten);
		display: block;
		font-size: 0.8rem;
		font-weight: normal;
		text-align: center;
		text-decoration: none;
	}

	thead {
		vertical-align: top;
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
		margin: 0.45rem 0 1.25rem 0;
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

	.d2l-calendar-date:hover {
		background-color: var(--d2l-color-gypsum);
	}

	.d2l-calendar-date:focus {
		border-color: var(--d2l-color-celestine);
		border-width: 2px;
		outline: none;
	}

	.d2l-calendar-date[disabled],
	.d2l-calendar-date[disabled]:hover,
	.d2l-calendar-date[disabled]:focus {
		background-color: white;
		color: var(--d2l-color-chromite);
	}

	.d2l-calendar-date-selected {
		background-color: var(--d2l-color-celestine-plus-2);
		border-color: var(--d2l-color-celestine);
		border-width: 1px;
	}

	.d2l-calendar-date-today,
	.d2l-calendar-date-selected {
		font-size: 1rem;
		font-weight: 700;
	}
`;
