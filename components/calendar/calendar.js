import '../button/button-icon.js';
import '../colors/colors.js';
import { bodySmallStyles, heading4Styles } from '../typography/styles.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { formatDateInISO, getDateFromDateObj, getDateFromISODate, getDateTimeDescriptorShared, getToday } from '../../helpers/dateTime.js';
import { classMap } from 'lit-html/directives/class-map.js';
import { findComposedAncestor } from '../../helpers/dom.js';
import { formatDate } from '@brightspace-ui/intl/lib/dateTime.js';
import { getUniqueId } from '../../helpers/uniqueId.js';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { LocalizeStaticMixin } from '../../mixins/localize-static-mixin.js';
import { offscreenStyles } from '../offscreen/offscreen.js';
import { RtlMixin } from '../../mixins/rtl-mixin.js';

const daysInWeek = 7;
const keyCodes = {
	DOWN: 40,
	END: 35,
	ENTER: 13,
	ESCAPE: 27,
	HOME: 36,
	LEFT: 37,
	PAGEUP: 33,
	PAGEDOWN: 34,
	SPACE: 32,
	RIGHT: 39,
	UP: 38
};
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

let calendarData;
function getCalendarData(refresh) {
	if (!calendarData) {
		calendarData = {};
		calendarData.descriptor = getDateTimeDescriptorShared(refresh);
		calendarData.firstDayOfWeek = calendarData.descriptor.calendar.firstDayOfWeek;
		calendarData.daysOfWeekIndex = [];
		for (let i = calendarData.firstDayOfWeek; i < calendarData.firstDayOfWeek + daysInWeek; i++) {
			calendarData.daysOfWeekIndex.push(i % daysInWeek);
		}
	}
	return calendarData;
}

export function checkIfDatesEqual(date1, date2) {
	if (!date1 || !date2) return false;
	return date1.getTime() === date2.getTime();
}

export function getDatesInMonthArray(shownMonth, shownYear) {
	const dates = [];
	const numDays = getNumberOfDaysInMonth(shownMonth, shownYear);

	// populate first week of month
	const firstWeek = [];
	const numDaysFromPrevMonthToShow = getNumberOfDaysFromPrevMonthToShow(shownMonth, shownYear);

	if (numDaysFromPrevMonthToShow > 0) {
		const prevMonth = getPrevMonth(shownMonth);
		const prevMonthYear = (shownMonth === 0) ? (shownYear - 1) : shownYear;
		const numDaysLastMonth = getNumberOfDaysInMonth(prevMonth, prevMonthYear);
		for (let i = numDaysLastMonth - numDaysFromPrevMonthToShow + 1; i <= numDaysLastMonth; i++) {
			firstWeek.push(new Date(prevMonthYear, prevMonth, i));
		}
	}
	for (let j = 1; j <= daysInWeek - numDaysFromPrevMonthToShow; j++) {
		firstWeek.push(new Date(shownYear, shownMonth, j));
	}
	dates.push(firstWeek);

	// remaining weeks
	let nextMonthDay = 1;
	let firstDateOfWeek = daysInWeek - numDaysFromPrevMonthToShow + 1;
	const numWeeks = Math.ceil((numDaysFromPrevMonthToShow + numDays) / daysInWeek);
	const nextMonth =  getNextMonth(shownMonth);
	const nextMonthYear = (shownMonth === 11) ? (shownYear + 1) : shownYear;
	for (let i = 1; i < numWeeks; i++) {
		const week = [];
		for (let j = firstDateOfWeek; j < firstDateOfWeek + daysInWeek; j++) {
			let day;
			if (j > numDays) {
				day = new Date(nextMonthYear, nextMonth, nextMonthDay);
				nextMonthDay++;
			} else {
				day = new Date(shownYear, shownMonth, j);
			}
			week.push(day);
		}
		firstDateOfWeek = firstDateOfWeek + daysInWeek;
		dates.push(week);
	}

	return dates;
}

export function getDisabled(date, min, max) {
	if (!date) return false;
	const beforeMin = (min ? true : false) && (date.getTime() < getDateFromISODate(min).getTime());
	const afterMax = (max ? true : false) && (date.getTime() > getDateFromISODate(max).getTime());
	return beforeMin || afterMax;
}

export function getNextMonth(month) {
	return (month === 11) ? 0 : (month + 1);
}

export function getNumberOfDaysFromPrevMonthToShow(month, year) {
	const firstDayOfMonth = new Date(year, month, 1).getDay();
	let numDaysFromLastMonthToShowThisMonth = 0;
	if (firstDayOfMonth !== calendarData.firstDayOfWeek) {
		numDaysFromLastMonthToShowThisMonth = firstDayOfMonth - calendarData.firstDayOfWeek;
		if (numDaysFromLastMonthToShowThisMonth < 0) {
			numDaysFromLastMonthToShowThisMonth += daysInWeek;
		}
	}
	return numDaysFromLastMonthToShowThisMonth;
}

export function getNumberOfDaysInMonth(month, year) {
	return new Date(year, month + 1, 0).getDate();
}

export function getNumberOfDaysToSameWeekPrevMonth(month, year) {
	const prevMonth = getPrevMonth(month);
	const prevMonthYear = prevMonth === 11 ? year - 1 : year;
	const numDaysPrevMonth = getNumberOfDaysInMonth(prevMonth, prevMonthYear);
	const numDaysFromPrevPrevMonthToShowPrevMonth = getNumberOfDaysFromPrevMonthToShow(prevMonth, prevMonthYear);
	const numWeeksPrevMonth = Math.ceil((numDaysFromPrevPrevMonthToShowPrevMonth + numDaysPrevMonth) / 7);

	const firstDayOfMonth = new Date(year, month, 1).getDay();
	const hasDaysFromPrevMonth = (firstDayOfMonth !== calendarData.firstDayOfWeek);
	return daysInWeek * (numWeeksPrevMonth - ((hasDaysFromPrevMonth) ? 1 : 0));
}

export function getPrevMonth(month) {
	return (month === 0) ? 11 : (month - 1);
}

class Calendar extends LocalizeStaticMixin(RtlMixin(LitElement)) {

	static get properties() {
		return {
			maxValue: { attribute: 'max-value', reflect: true, type: String },
			minValue: { attribute: 'min-value', reflect: true, type: String },
			selectedValue: { type: String, attribute: 'selected-value' },
			summary: { type: String },
			_dialog: { type: Boolean },
			_focusDate: { type: Object },
			_isInitialFocusDate: { type: Boolean },
			_monthNav: { type: String },
			_shownMonth: { type: Number }
		};
	}

	static get styles() {
		return [bodySmallStyles, heading4Styles, offscreenStyles, css`
			:host {
				display: block;
				min-width: 14rem;
			}

			table {
				border-collapse: collapse;
				border-spacing: 0;
				table-layout: fixed;
				width: 100%;
			}

			th {
				border-bottom: 1px solid var(--d2l-color-gypsum);
				padding-bottom: 0.6rem;
				padding-top: 0.3rem;
				text-align: center;
			}

			abbr {
				text-decoration: none;
			}

			tbody > tr:first-child div {
				margin-top: 0.3rem;
			}

			.d2l-calendar {
				border-radius: 4px;
			}

			.d2l-calendar-title {
				align-items: center;
				display: flex;
				justify-content: space-between;
			}

			.d2l-calendar-title .d2l-heading-4 {
				height: 100%;
				margin: 0;
				opacity: 0;
			}

			.d2l-calendar-next .d2l-calendar-title .d2l-heading-4 {
				padding-left: 20px;
				padding-right: 0;
			}

			.d2l-calendar-prev .d2l-calendar-title .d2l-heading-4 {
				padding-left: 0;
				padding-right: 20px;
			}

			.d2l-calendar-next-updown .d2l-calendar-title .d2l-heading-4 {
				padding-top: 20px;
				padding-bottom: 0;
			}

			.d2l-calendar-prev-updown .d2l-calendar-title .d2l-heading-4 {
				padding-top: 0;
				padding-bottom: 20px;
			}

			.d2l-calendar-date {
				align-items: center;
				background-color: white;
				border-radius: 0.3rem;
				border-style: none;
				box-sizing: content-box;
				color: var(--d2l-color-ferrite);
				cursor: pointer;
				display: flex;
				font-family: inherit;
				font-size: 0.8rem;
				height: calc(2rem - 6px);
				justify-content: center;
				letter-spacing: inherit;
				line-height: inherit;
				margin-left: auto;
				margin-right: auto;
				opacity: 0;
				padding: 4px;
				position: relative;
				text-align: center;
				-webkit-user-select: none;
				-moz-user-select: none;
				-ms-user-select: none;
				user-select: none;
				width: calc(2rem - 6px);
			}

			.d2l-calendar-date::-moz-focus-inner {
				border: 0;
			}

			.d2l-calendar-date:disabled {
				cursor: not-allowed;
			}

			@media (prefers-reduced-motion: reduce) {
				.d2l-calendar-title .d2l-heading-4,
				.d2l-calendar-date {
					opacity: 1;
				}

				.d2l-calendar-date:disabled {
					opacity: 0.5;
				}
			}

			.d2l-calendar-next .d2l-calendar-date {
				left: 10px;
			}

			.d2l-calendar-next-updown .d2l-calendar-date {
				top: 10px;
			}

			.d2l-calendar-prev .d2l-calendar-date {
				left: -10px;
			}

			.d2l-calendar-prev-updown .d2l-calendar-date {
				top: -10px;
			}

			.d2l-calendar-animating .d2l-calendar-title .d2l-heading-4,
			.d2l-calendar-animating .d2l-calendar-date {
				opacity: 1;
				transition-duration: 200ms;
				transition-timing-function: ease-out;
				transition-property: opacity, transform;
			}

			.d2l-calendar-animating .d2l-calendar-date:disabled {
				opacity: 0.5;
			}

			.d2l-calendar-next .d2l-heading-4,
			.d2l-calendar-next .d2l-calendar-date {
				transform: translateX(-10px);
			}

			.d2l-calendar-next-updown .d2l-heading-4,
			.d2l-calendar-next-updown .d2l-calendar-date {
				transform: translateY(-10px)
			}

			.d2l-calendar-prev .d2l-heading-4,
			.d2l-calendar-prev .d2l-calendar-date {
				transform: translateX(10px);
			}

			.d2l-calendar-prev-updown .d2l-heading-4,
			.d2l-calendar-prev-updown .d2l-calendar-date {
				transform: translateY(10px);
			}

			.d2l-calendar-date:enabled:not(.d2l-calendar-date-selected):hover,
			.d2l-calendar-date:enabled:not(.d2l-calendar-date-selected).d2l-calendar-date-hover {
				background-color: var(--d2l-color-gypsum);
			}

			td:focus:not(.d2l-calendar-date-selected):hover,
			td:focus:not(.d2l-calendar-date-selected).d2l-calendar-date-hover {
				box-shadow: 0 0 0 2px var(--d2l-color-gypsum), 0 0 0 4px var(--d2l-color-celestine);
				transition: none;
			}

			td, .d2l-calendar-date:focus {
				outline: none;
			}

			td:focus .d2l-calendar-date {
				border-radius: 0.16rem;
				box-shadow: 0 0 0 2px white, 0 0 0 4px var(--d2l-color-celestine);
				padding: 0;
				transition: none;
			}

			td:focus .d2l-calendar-date.d2l-calendar-date-initial {
				transition: box-shadow 200ms ease-in;
			}

			@media (prefers-reduced-motion: reduce) {
				td:focus.d2l-calendar-date.d2l-calendar-date-initial {
					transition: none;
				}
			}

			.d2l-calendar-date.d2l-calendar-date-selected {
				background-color: var(--d2l-color-celestine-plus-2);
				border: 1px solid var(--d2l-color-celestine);
				padding: 2px;
			}

			td:focus.d2l-calendar-date.d2l-calendar-date-selected {
				border-width: 0;
				box-shadow: 0 0 0 2px var(--d2l-color-celestine-plus-2), 0 0 0 4px var(--d2l-color-celestine);
				padding: 0;
			}

			.d2l-calendar-date.d2l-calendar-date-today,
			.d2l-calendar-date.d2l-calendar-date-selected {
				font-size: 1rem;
				font-weight: 700;
			}
		`];
	}

	static get resources() {
		return {
			'ar': {
				notSelected: 'غير محدد.',
				selected: 'محدد.',
				show: '{month} إظهار'
			},
			'da': {
				notSelected: 'Ikke valgt.',
				selected: 'Valgt.',
				show: 'Vis {month}'
			},
			'de': {
				notSelected: 'Nicht ausgewählt.',
				selected: 'Ausgewählt.',
				show: '{month} anzeigen'
			},
			'en': {
				notSelected: 'Not Selected.',
				selected: 'Selected.',
				show: 'Show {month}'
			},
			'es': {
				notSelected: 'No seleccionado.',
				selected: 'Seleccionado.',
				show: 'Mostrar {month}'
			},
			'fr': {
				notSelected: 'Pas sélectionné',
				selected: 'Sélectionné',
				show: 'Afficher {month}'
			},
			'ja': {
				notSelected: '選択されていません。',
				selected: '選択されています。',
				show: '{month} の表示'
			},
			'ko': {
				notSelected: '선택되지 않음.',
				selected: '선택됨.',
				show: '{month} 표시'
			},
			'nl': {
				notSelected: 'Niet geselecteerd.',
				selected: 'Geselecteerd.',
				show: '{month} tonen'
			},
			'pt': {
				notSelected: 'Não selecionado.',
				selected: 'Selecionado.',
				show: 'Mostrar {month}'
			},
			'sv': {
				notSelected: 'Inte markerad.',
				selected: 'Markerad.',
				show: 'Visa {month}'
			},
			'tr': {
				notSelected: 'Seçili değil.',
				selected: 'Seçili.',
				show: '{month} öğesini göster'
			},
			'zh': {
				notSelected: '未选择。',
				selected: '已选。',
				show: '显示 {month}'
			},
			'zh-tw': {
				notSelected: '未選取。',
				selected: '已選取。',
				show: '顯示 {month}'
			}
		};
	}

	constructor() {
		super();

		this._isInitialFocusDate = true;
		this._tableInfoId = getUniqueId();
		this._monthNav = 'initial';
		getCalendarData();
	}

	firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);

		if (this.minValue && this.maxValue && (getDateFromISODate(this.minValue).getTime() > getDateFromISODate(this.maxValue).getTime())) {
			throw new RangeError('d2l-calendar component expects min-value to be before max-value');
		}

		const dropdownContent = findComposedAncestor(
			this.parentNode,
			(node) => { return (node.tagName === 'D2L-DROPDOWN-CONTENT'); }
		);
		if (dropdownContent) this._dialog = true;

		this.addEventListener('d2l-localize-behavior-language-changed', () => {
			calendarData = null;
			getCalendarData(true);
			this.requestUpdate();
		});

		this._today = getDateFromDateObj(getToday());
		this.reset();
	}

	render() {
		if (this._shownMonth === undefined || !this._shownYear) {
			return html``;
		}

		const weekdayHeaders = calendarData.daysOfWeekIndex.map((index) => html`
			<th>
				<abbr class="d2l-body-small" title="${calendarData.descriptor.calendar.days.long[index]}">
					${calendarData.descriptor.calendar.days.short[index]}
				</abbr>
			</th>
		`);

		const dates = getDatesInMonthArray(this._shownMonth, this._shownYear);
		const dayRows = dates.map((week) => {
			const weekHtml = week.map((day, index) => {
				const disabled = getDisabled(day, this.minValue, this.maxValue);
				const focused = checkIfDatesEqual(day, this._focusDate);
				const selected = this.selectedValue ? checkIfDatesEqual(day, getDateFromISODate(this.selectedValue)) : false;
				const classes = {
					'd2l-calendar-date': true,
					'd2l-calendar-date-initial': this._isInitialFocusDate,
					'd2l-calendar-date-selected': selected,
					'd2l-calendar-date-today': checkIfDatesEqual(day, this._today)
				};
				const year = day.getFullYear();
				const month = day.getMonth();
				const date = day.getDate();
				const weekday = calendarData.descriptor.calendar.days.long[calendarData.daysOfWeekIndex[index]];
				const description = `${weekday} ${date}. ${selected ? this.localize('selected') : this.localize('notSelected')} ${formatDate(day, {format: 'monthYear'})}`;
				return html`
					<td
						aria-disabled="${disabled}"
						aria-label="${description}"
						@click="${this._onDateSelected}"
						data-date=${date}
						data-month=${month}
						data-year=${year}
						@keydown="${this._onKeyDown}"
						role="button"
						tabindex=${focused ? '0' : '-1'}>
						<div class="${classMap(classes)}">${date}</div>
					</td>`;
			});

			return html`<tr>${weekHtml}</tr>`;
		});
		const summary = this.summary ? html`<caption class="d2l-offscreen">${this.summary}</caption>` : '';
		const calendarClasses = {
			'd2l-calendar': true,
			'd2l-calendar-animating': (this._monthNav === 'next' || this._monthNav === 'next-updown' || this._monthNav === 'prev' || this._monthNav === 'prev-updown' || this._monthNav === 'initial'),
			'd2l-calendar-initial-month': this._monthNav === 'initial',
			'd2l-calendar-next': this._monthNav === 'next',
			'd2l-calendar-next-updown': this._monthNav === 'next-updown',
			'd2l-calendar-prev': this._monthNav === 'prev',
			'd2l-calendar-prev-updown': this._monthNav === 'prev-updown'
		};
		const labelId = `${this._tableInfoId}-heading`;
		const labelledBy = this._dialog ? labelId : undefined;
		const heading = formatDate(new Date(this._shownYear, this._shownMonth, 1), {format: 'monthYear'});
		const role = this._dialog ? 'dialog' : undefined;
		return html`
			<div aria-labelledby="${ifDefined(labelledBy)}" class="${classMap(calendarClasses)}" role="${ifDefined(role)}">
				<div role="application">
					<div class="d2l-calendar-title">
						<d2l-button-icon
							@click="${this._onPrevMonthButtonClick}"
							text="${this._computeText(getPrevMonth(this._shownMonth))}"
							icon="tier1:chevron-left">
						</d2l-button-icon>
						<h2 aria-atomic="true" aria-live="polite" class="d2l-heading-4" id="${labelId}">${heading}</h2>
						<d2l-button-icon
							@click="${this._onNextMonthButtonClick}"
							text="${this._computeText(getNextMonth(this._shownMonth))}"
							icon="tier1:chevron-right">
						</d2l-button-icon>
					</div>
					<table aria-hidden="true" role="presentation">
						${weekdayHeaders}
					</table>
					<table aria-labelledby="${labelId}" role="presentation">
						${summary}
						<tbody>
							${dayRows}
						</tbody>
					</table>
				</div>
				<slot></slot>
			</div>
		`;
	}

	updated(changedProperties) {
		super.updated(changedProperties);

		changedProperties.forEach(async(oldVal, prop) => {
			if (prop === '_shownMonth' && this._keyboardTriggeredMonthChange) {
				this._focusDateAddFocus();
			} else if (prop === 'selectedValue' && this.selectedValue) {
				await this.updateComplete;
				this._updateFocusDateOnChange();
			}
		});
	}

	focus() {
		if (this._dialog) {
			this._focusDateAddFocus();
		} else {
			const button = this.shadowRoot.querySelector('d2l-button-icon');
			if (button) button.focus();
		}
	}

	async reset() {
		const date = this.selectedValue ? getDateFromISODate(this.selectedValue) : this._today;
		this._shownMonth = date.getMonth();
		this._shownYear = date.getFullYear();
		await this._updateFocusDateDependentOnDisabled(date);
	}

	_computeText(month) {
		return this.localize('show', {month: calendarData.descriptor.calendar.months.long[month]});
	}

	async _focusDateAddFocus() {
		this._keyboardTriggeredMonthChange = false;
		if (!this._focusDate) return;
		const date = await this._getDateElement(this._focusDate);
		if (date) {
			date.focus();
		}
	}

	async _getDateElement(date) {
		await this.updateComplete;
		return this.shadowRoot.querySelector(`td[data-date="${date.getDate()}"][data-month="${date.getMonth()}"][data-year="${date.getFullYear()}"]`);
	}

	async _onDateSelected(e) {
		let selectedDate = e.composedPath()[0];
		if (selectedDate.tagName === 'DIV') selectedDate = selectedDate.parentNode;
		const year = selectedDate.getAttribute('data-year');
		const month = selectedDate.getAttribute('data-month');
		const date = selectedDate.getAttribute('data-date');

		this.selectedValue = formatDateInISO({year: year, month: (parseInt(month) + 1), date: date});

		const eventDetails = {
			bubbles: true,
			composed: true,
			detail: { date: this.selectedValue }
		};
		this.dispatchEvent(new CustomEvent('d2l-calendar-selected', eventDetails));

		await this._updateFocusDateOnChange();
		this._focusDateAddFocus();
	}

	async _onKeyDown(e) {
		const rootTarget = e.composedPath()[0];
		if (rootTarget.tagName !== 'TD') return;

		let preventDefault = false;
		let numDaysChange;

		switch (e.keyCode) {
			case keyCodes.ENTER:
			case keyCodes.SPACE:
				preventDefault = true;
				this._onDateSelected(e);
				break;
			case keyCodes.DOWN:
				numDaysChange = daysInWeek;
				preventDefault = true;
				break;
			case keyCodes.UP:
				numDaysChange = -daysInWeek;
				preventDefault = true;
				break;
			case keyCodes.LEFT:
				if (this.dir === 'rtl') {
					numDaysChange = 1;
				} else {
					numDaysChange = -1;
				}
				preventDefault = true; // needed for voiceover in safari to properly read aria-label on dates
				break;
			case keyCodes.RIGHT:
				if (this.dir === 'rtl') {
					numDaysChange = -1;
				} else {
					numDaysChange = 1;
				}
				preventDefault = true; // needed for voiceover in safari to properly read aria-label on dates
				break;
			case keyCodes.HOME: {
				const dayOfTheWeek = this._focusDate.getDay();
				if (this.dir === 'rtl') {
					numDaysChange = 6 - dayOfTheWeek + calendarData.firstDayOfWeek;
					if (numDaysChange > 6) {
						numDaysChange -= daysInWeek;
					}
				} else {
					numDaysChange = dayOfTheWeek - calendarData.firstDayOfWeek;
					if (numDaysChange < 0) {
						numDaysChange += daysInWeek;
					}
					numDaysChange *= -1;
				}
				preventDefault = true;
				break;
			} case keyCodes.END: {
				const dayOfTheWeek = this._focusDate.getDay();
				if (this.dir === 'rtl') {
					numDaysChange = dayOfTheWeek - calendarData.firstDayOfWeek;
					if (numDaysChange < 0) {
						numDaysChange += daysInWeek;
					}
					numDaysChange *= -1;
				} else {
					numDaysChange = 6 - dayOfTheWeek + calendarData.firstDayOfWeek;
					if (numDaysChange > 6) {
						numDaysChange -= daysInWeek;
					}
				}
				preventDefault = true;
				break;
			} case keyCodes.PAGEUP: {
				const diff = getNumberOfDaysToSameWeekPrevMonth(this._shownMonth, this._shownYear);

				const possibleFocusDate = new Date(this._focusDate);
				possibleFocusDate.setDate(possibleFocusDate.getDate() - diff);
				this._keyboardTriggeredMonthChange = true;

				// handle when current month has more weeks than previous month and page up pressed from last week
				if (possibleFocusDate.getMonth() === this._shownMonth) possibleFocusDate.setDate(possibleFocusDate.getDate() - 7);

				this._updateShownMonthDecrease(true, true);
				await this._updateFocusDateDependentOnDisabled(possibleFocusDate);
				if (this._focusDate) this._focusDateAddFocus();
				else {
					const buttons = this.shadowRoot.querySelectorAll('d2l-button-icon');
					if (buttons && buttons.length > 0) buttons[0].focus();
				}
				preventDefault = true;
				break;
			} case keyCodes.PAGEDOWN: {
				const nextMonth = getNextMonth(this._shownMonth);
				const diff = getNumberOfDaysToSameWeekPrevMonth(nextMonth, this._shownYear);

				const possibleFocusDate = new Date(this._focusDate);

				possibleFocusDate.setDate(possibleFocusDate.getDate() + diff);
				this._keyboardTriggeredMonthChange = true;

				// handle when current month has more weeks than next month and page down pressed from last week
				const newFocusDateMonth = possibleFocusDate.getMonth();
				if ((newFocusDateMonth - this._shownMonth) > 1
					|| (newFocusDateMonth === 1 && this._shownMonth === 11)
				) {
					possibleFocusDate.setDate(possibleFocusDate.getDate() - 7);
				}
				this._updateShownMonthIncrease(true, true);
				await this._updateFocusDateDependentOnDisabled(possibleFocusDate, true);
				if (this._focusDate) this._focusDateAddFocus();
				else {
					const buttons = this.shadowRoot.querySelectorAll('d2l-button-icon');
					if (buttons && buttons.length > 1) buttons[1].focus();
				}
				preventDefault = true;
				break;
			}
		}

		if (preventDefault) {
			e.preventDefault();
			e.stopPropagation();
		}

		if (numDaysChange) {
			const oldFocusDate = new Date(this._focusDate);
			const possibleFocusDate = new Date(
				this._focusDate.getFullYear(),
				this._focusDate.getMonth(),
				this._focusDate.getDate() + numDaysChange
			);

			// if HOME or END _focusDate becomes earliest or latest non-disabled date in the week as applicable
			// if arrow keys change _focusDate only if intended target is not disabled
			if (e.keyCode === keyCodes.END) this._updateFocusDateDependentOnDisabled(possibleFocusDate, true);
			else if (e.keyCode === keyCodes.HOME) this._updateFocusDateDependentOnDisabled(possibleFocusDate);
			else if (getDisabled(possibleFocusDate, this.minValue, this.maxValue)) return;
			else this._focusDate = possibleFocusDate;

			this._isInitialFocusDate = false;

			const date = await this._getDateElement(this._focusDate);
			if (!date) {
				this._keyboardTriggeredMonthChange = true;
				const upDown = Math.abs(numDaysChange) !== 1; // use left/right animation if difference is 1 day
				if (oldFocusDate < this._focusDate) {
					this._updateShownMonthIncrease(true, upDown);
				} else {
					this._updateShownMonthDecrease(true, upDown);
				}
			} else {
				this._focusDateAddFocus();
			}
			await this.updateComplete;
			this._isInitialFocusDate = true;
		}
	}

	_onNextMonthButtonClick() {
		this._updateShownMonthIncrease();
		this._updateFocusDateOnChange();
	}

	_onPrevMonthButtonClick() {
		this._updateShownMonthDecrease();
		this._updateFocusDateOnChange();
	}

	async _updateFocusDateDependentOnDisabled(possibleFocusDate, latestPossibleFocusDate) {
		await this.updateComplete;
		if (!getDisabled(possibleFocusDate, this.minValue, this.maxValue)) {
			this._focusDate = possibleFocusDate;
		} else if (this.shadowRoot.querySelector('.d2l-calendar-date:enabled')) {
			const validDates = this.shadowRoot.querySelectorAll('.d2l-calendar-date:enabled');
			const focusDate = validDates[latestPossibleFocusDate ? (validDates.length - 1) : 0].parentNode;
			const year = focusDate.getAttribute('data-year');
			const month = focusDate.getAttribute('data-month');
			const date = focusDate.getAttribute('data-date');
			this._focusDate = new Date(year, month, date);
		} else {
			this._focusDate = undefined;
		}
	}

	async _updateFocusDateOnChange() {
		const selectedValueDate = this.selectedValue ? getDateFromISODate(this.selectedValue) : null;
		const dateElem = selectedValueDate ? await this._getDateElement(selectedValueDate) : null;
		if (dateElem && !getDisabled(selectedValueDate, this.minValue, this.maxValue)) {
			this._focusDate = selectedValueDate;
		} else {
			await this._updateFocusDateDependentOnDisabled(new Date(this._shownYear, this._shownMonth, 1));
		}
	}

	_updateShownMonthDecrease(keyboardTriggered, transitionUpDown) {
		if (this._shownMonth === 0) this._shownYear--;
		this._shownMonth = getPrevMonth(this._shownMonth);
		this._monthNav = undefined;
		if (!keyboardTriggered) this._isInitialFocusDate = true;
		if (!reduceMotion) {
			setTimeout(() => {
				this._monthNav = `${(this.dir !== 'rtl') ? 'prev' : 'next'}${transitionUpDown ? '-updown' : ''}`;
			}, 100); // timeout for firefox
		}
	}

	_updateShownMonthIncrease(keyboardTriggered, transitionUpDown) {
		if (this._shownMonth === 11) this._shownYear++;
		this._shownMonth = getNextMonth(this._shownMonth);
		this._monthNav = undefined;
		if (!keyboardTriggered) this._isInitialFocusDate = true;
		if (!reduceMotion) {
			setTimeout(() => {
				this._monthNav = `${(this.dir !== 'rtl') ? 'next' : 'prev'}${transitionUpDown ? '-updown' : ''}`;
			}, 100); // timeout for firefox
		}
	}

}
customElements.define('d2l-calendar', Calendar);
