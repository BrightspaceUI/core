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
		cursor: pointer;
		font-size: 0.8rem;
		position: relative;
		text-align: center;
	}

	.d2l-calendar-date:focus {
		outline: none;
	}

	.d2l-calendar-date:hover,
	.d2l-calendar-date-selected:not(.d2l-calendar-date-other-month) {
		background-color: var(--d2l-color-celestine-plus-2);
		color: var(--d2l-color-ferrite);
	}

	.d2l-calendar-date:focus,
	.d2l-calendar-date-selected:focus:not(.d2l-calendar-date-other-month) {
		background-color: white;
		border-color: var(--d2l-color-celestine);
		color: var(--d2l-color-ferrite);
	}

	.d2l-calendar-date-selected:not(.d2l-calendar-date-other-month) {
		background-color: var(--d2l-color-celestine);
		color: white;
	}

	.d2l-calendar-date.d2l-calendar-date-other-month,
	.d2l-calendar-date.d2l-calendar-date-other-month:hover,
	.d2l-calendar-date.d2l-calendar-date-other-month:focus {
		color: var(--d2l-color-chromite);
	}

	.d2l-calendar-date-today:not(.d2l-calendar-date-selected):not(.d2l-calendar-date-other-month) {
		font-size: 1.1rem;
		font-weight: 700;
	}

	.d2l-calendar-date {
		align-items: center;
		border: 2px solid transparent;
		border-radius: 8px;
		color: var(--d2l-color-ferrite);
		display: flex;
		height: 2rem;
		justify-content: center;
		margin-left: auto;
		margin-right: auto;
		width: 2rem;
	}
`;
