import { convertLocalToUTCDateTime, convertUTCToLocalDateTime } from '@brightspace-ui/intl/lib/dateTime.js';

// val is an object containing year, month, date
export function formatDateInISO(val) {
	if (!val
		|| !Object.prototype.hasOwnProperty.call(val, 'year')
		|| !Object.prototype.hasOwnProperty.call(val, 'month')
		|| !Object.prototype.hasOwnProperty.call(val, 'date')
	) {
		throw new Error('Invalid input: Expected input to be object containing year, month, and date');
	}

	let month = val.month,
		date = val.date;
	if (val.month.toString().length < 2) month = `0${month}`;
	if (val.date.toString().length < 2) date = `0${date}`;
	return `${val.year}-${month}-${date}`;
}

// val is an object containing year, month, date, hours, minutes, seconds
// if local is true, no Z since not in UTC
export function formatDateTimeInISO(val, local) {
	if (!val) {
		throw new Error('Invalid input: Expected input to be an object');
	}
	return `${formatDateInISO({ year: val.year, month: val.month, date: val.date })}T${formatTimeInISO({ hours: val.hours, minutes: val.minutes, seconds: val.seconds })}.000${local ? '' : 'Z'}`;
}

// val is an object containing hours, minutes, seconds
export function formatTimeInISO(val) {
	if (!val
		|| !Object.prototype.hasOwnProperty.call(val, 'hours')
		|| !Object.prototype.hasOwnProperty.call(val, 'minutes')
		|| !Object.prototype.hasOwnProperty.call(val, 'seconds')
	) {
		throw new Error('Invalid input: Expected input to be object containing hours, minutes, and seconds');
	}

	let hours = val.hours,
		minutes = val.minutes,
		seconds = val.seconds;
	if (hours.toString().length < 2) hours = `0${hours}`;
	if (minutes.toString().length < 2) minutes = `0${minutes}`;
	if (seconds.toString().length < 2) seconds = `0${seconds}`;
	return `${hours}:${minutes}:${seconds}`;
}

export function formatDateInISOTime(val) {
	let hours = val.getHours(),
		minutes = val.getMinutes(),
		seconds = val.getSeconds();
	if (hours.toString().length < 2) hours = `0${hours}`;
	if (minutes.toString().length < 2) minutes = `0${minutes}`;
	if (seconds.toString().length < 2) seconds = `0${seconds}`;
	return `${hours}:${minutes}:${seconds}`;
}

export function getAdjustedTime(startObj, prevStartObj, endObj) {
	const hourDiff = startObj.hours - prevStartObj.hours;
	const minuteDiff = startObj.minutes - prevStartObj.minutes;

	let newEndHour = endObj.hours + hourDiff;
	let newEndMinute = endObj.minutes + minuteDiff;

	if (newEndMinute > 59) {
		newEndHour++;
		newEndMinute -= 60;
	} else if (newEndMinute < 0) {
		newEndHour--;
		newEndMinute += 60;
	}

	if (newEndHour > 23) {
		newEndHour = 23;
		newEndMinute = 59;
	} else if (newEndHour < 0) {
		newEndHour = 0;
		newEndMinute = 0;
	}

	return {
		hours: newEndHour,
		minutes: newEndMinute
	};

}

export function getClosestValidDate(minValue, maxValue, dateTime) {
	const today = getToday();
	const todayDate = getDateFromDateObj(today);
	const todayOutput = dateTime ? formatDateTimeInISO(convertLocalToUTCDateTime(today)) : formatDateInISO(today);
	const minDate = dateTime ? getDateFromISODateTime(minValue) : getDateFromISODate(minValue);
	const maxDate = dateTime ? getDateFromISODateTime(maxValue) : getDateFromISODate(maxValue);

	if (minValue && maxValue) {
		if (isDateInRange(todayDate, minDate, maxDate)) return todayOutput;
		else {
			const diffToMin = Math.abs(todayDate.getTime() - minDate.getTime());
			const diffToMax = Math.abs(todayDate.getTime() - maxDate.getTime());
			if (diffToMin < diffToMax) return minValue;
			else return maxValue;
		}
	} else if (minValue) {
		if (isDateInRange(todayDate, minDate, undefined)) return todayOutput;
		else return minValue;
	} else if (maxValue) {
		if (isDateInRange(todayDate, undefined, maxDate)) return todayOutput;
		else return maxValue;
	} else return todayOutput;
}

export function getDateFromDateObj(val) {
	return new Date(val.year, parseInt(val.month) - 1, val.date);
}

export function getDateFromISODate(val) {
	if (!val) return null;
	const date = parseISODate(val);

	return getDateFromDateObj(date);
}

export function getDateFromISODateTime(val) {
	if (!val) return null;
	const parsed = parseISODateTime(val);
	const localDateTime = convertUTCToLocalDateTime(parsed);
	return new Date(localDateTime.year, localDateTime.month - 1, localDateTime.date, localDateTime.hours, localDateTime.minutes, localDateTime.seconds);
}

export function getDateFromISOTime(val) {
	if (!val) return null;
	const time = parseISOTime(val);
	const today = getToday();
	return new Date(today.year, today.month - 1, today.date, time.hours, time.minutes, time.seconds);
}

export function getDateNoConversion(value) {
	const parsed = parseISODateTime(value);
	return new Date(parsed.year, parsed.month - 1, parsed.date, parsed.hours, parsed.minutes, parsed.seconds);
}

export function getLocalDateTimeFromUTCDateTime(dateTime) {
	const dateObj = parseISODateTime(dateTime);
	const localDateTime = convertUTCToLocalDateTime(dateObj);
	return formatDateTimeInISO(localDateTime, true);
}

export function getToday() {
	const val = new Date().toISOString();
	const dateTime = parseISODateTime(val);
	return convertUTCToLocalDateTime(dateTime);
}

export function getUTCDateTimeFromLocalDateTime(date, time) {
	if (!date || !time) throw new Error('Invalid input: Expected date and time');

	const dateObj = parseISODate(date);
	const timeObj = parseISOTime(time);

	const utcDateTime = convertLocalToUTCDateTime(Object.assign(dateObj, timeObj));
	return formatDateTimeInISO(utcDateTime);
}

export function isDateInRange(date, min, max) {
	if (!date) return false;
	const afterMin = !min || (min && date.getTime() >= min.getTime());
	const beforeMax = !max || (max && date.getTime() <= max.getTime());
	return afterMin && beforeMax;
}

export function isValidTime(val) {
	const re = /([0-9]{1,2}):([0-9]{1,2})(:([0-9]{1,2}))?/;
	const match = val.match(re);
	return match !== null;
}

export function parseISODate(val) {
	if (!val) return null;
	const re = /([0-9]{4})-([0-9]{2})-([0-9]{2})/;
	const match = val.match(re);
	if (!match || match.length !== 4) {
		throw new Error('Invalid input: Expected format is YYYY-MM-DD');
	}
	return {
		year: parseInt(match[1]),
		month: parseInt(match[2]), // month starts at 1
		date: parseInt(match[3])
	};
}

export function parseISODateTime(val) {
	if (!val) return null;
	const re = /([0-9]{4})-([0-9]{2})-([0-9]{2})T([0-9]{1,2}):([0-9]{1,2}):([0-9]{1,2})/;
	const match = val.match(re);
	if (!match || match.length !== 7) {
		throw new Error('Invalid input: Expected format is YYYY-MM-DDTHH:mm:ss.sssZ');
	}

	return {
		year: parseInt(match[1]),
		month: parseInt(match[2]), // month starts at 1
		date: parseInt(match[3]),
		hours: parseInt(match[4]),
		minutes: parseInt(match[5]),
		seconds: parseInt(match[6])
	};
}

export function parseISOTime(val) {
	let hours = 0;
	let minutes = 0;
	let seconds = 0;
	const re = /([0-9]{1,2}):([0-9]{1,2})(:([0-9]{1,2}))?/;
	const match = val.match(re);

	if (match === null) {
		throw new Error('Invalid input: Expected format is hh:mm:ss');
	}

	if (match.length > 1) {
		hours = parseInt(match[1]);
		if (isNaN(hours) || hours < 0 || hours > 23) {
			hours = 0;
		}
	}
	if (match.length > 2) {
		minutes = parseInt(match[2]);
		if (isNaN(minutes) || minutes < 0 || minutes > 59) {
			minutes = 0;
		}
	}
	if (match.length > 3) {
		seconds = parseInt(match[4]);
		if (isNaN(seconds) || seconds < 0 || seconds > 59) {
			seconds = 0;
		}
	}

	return {
		hours: hours,
		minutes: minutes,
		seconds: seconds
	};
}
