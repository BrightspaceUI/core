import { convertUTCToLocalDateTime, getDateTimeDescriptor } from '@brightspace-ui/intl/lib/dateTime.js';

const dateTimeRe = /([0-9]{4})-([0-9]{2})-([0-9]{2})T([0-9]{1,2}):([0-9]{1,2}):([0-9]{1,2})/;

export function formatDateInISO(val) {
	let month = parseInt(val.getMonth()) + 1;
	let date = val.getDate();
	if (month < 10) month = `0${month}`;
	if (date < 10) date = `0${date}`;
	return `${val.getFullYear()}-${month}-${date}`;
}

let dateTimeDescriptor = null;
export function getDateTimeDescriptorShared(refresh) {
	if (!dateTimeDescriptor || refresh) dateTimeDescriptor = getDateTimeDescriptor();
	return dateTimeDescriptor;
}

export function getToday() {
	const val = new Date().toISOString();
	const dateTime = parseISODateTime(val);

	const valInLocalDateTime = convertUTCToLocalDateTime(dateTime);
	return new Date(valInLocalDateTime.year, valInLocalDateTime.month - 1, valInLocalDateTime.date);
}

export function parseDateIntoObject(val) {
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

export function parseISODate(val) {
	if (!val) return null;
	const date = parseDateIntoObject(val);

	return new Date(date.year, date.month - 1, date.date);
}

export function parseISODateTime(val) {
	if (!val) return null;
	const match = val.match(dateTimeRe);
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

export function parseTimeIntoObject(val) {
	if (!val) return null;
	const re = /^([0-9]{1,2}):([0-9]{2}):([0-9]{2})?$/;
	const match = val.match(re);
	if (!match || match.length !== 4) {
		throw new Error('Invalid input: Expected format is HH:MM:SS');
	}
	return {
		hours: parseInt(match[1]),
		minutes: parseInt(match[2]),
		seconds: parseInt(match[3])
	};
}
