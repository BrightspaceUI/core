import { formatDateInISO,
	formatDateTimeInISO,
	formatTimeInISO,
	getDateFromDateObj,
	getDateFromISODate,
	getLocalDateTimeFromUTCDateTime,
	getToday,
	getUTCDateTimeFromLocalDateTime,
	parseISODate,
	parseISODateTime,
	parseISOTime } from '../dateTime.js';
import { expect } from '@open-wc/testing';
import { getDocumentLocaleSettings } from '@brightspace-ui/intl/lib/common.js';
import sinon from 'sinon';

describe('date-time', () => {
	const documentLocaleSettings = getDocumentLocaleSettings();
	documentLocaleSettings.timezone.identifier = 'America/Toronto';

	describe('formatDateInISO', () => {
		it('should return the correct date', () => {
			const date = {
				year: 2020,
				month: 3,
				date: 1
			};
			expect(formatDateInISO(date)).to.equal('2020-03-01');
		});

		it('should return the correct date', () => {
			const date = {
				year: 2020,
				month: 12,
				date: 20
			};
			expect(formatDateInISO(date)).to.equal('2020-12-20');
		});

		it('should throw when incorrect input', () => {
			expect(() => {
				formatDateInISO('hello');
			}).to.throw('Invalid input: Expected input to be object containing year, month, and date');
		});

		it('should throw when no year', () => {
			expect(() => {
				formatDateInISO({month: 10, date: 20});
			}).to.throw('Invalid input: Expected input to be object containing year, month, and date');
		});

		it('should throw when no month', () => {
			expect(() => {
				formatDateInISO({year: 2013, date: 20});
			}).to.throw('Invalid input: Expected input to be object containing year, month, and date');
		});

		it('should throw when no date', () => {
			expect(() => {
				formatDateInISO({year: 2013, month: 3});
			}).to.throw('Invalid input: Expected input to be object containing year, month, and date');
		});
	});

	describe('formatDateTimeInISO', () => {
		it('should return the correct date-time', () => {
			const date = {
				year: 2020,
				month: 3,
				date: 1,
				hours: 12,
				minutes: 24,
				seconds: 36
			};
			expect(formatDateTimeInISO(date)).to.equal('2020-03-01T12:24:36.000Z');
		});

		it('should return the correct date', () => {
			const date = {
				year: 2020,
				month: 12,
				date: 20,
				hours: 1,
				minutes: 2,
				seconds: 3
			};
			expect(formatDateTimeInISO(date)).to.equal('2020-12-20T01:02:03.000Z');
		});

		it('should throw when no input', () => {
			expect(() => {
				formatDateTimeInISO();
			}).to.throw('Invalid input: Expected input to be an object');
		});

		it('should throw when missing time data', () => {
			const date = {
				year: 2020,
				month: 12,
				date: 20
			};
			expect(() => {
				formatDateTimeInISO(date);
			}).to.throw();
		});

		it('should throw when missing date data', () => {
			const date = {
				hours: 1,
				minutes: 2,
				seconds: 3
			};
			expect(() => {
				formatDateTimeInISO(date);
			}).to.throw();
		});
	});

	describe('formatTimeInISO', () => {
		it('should return the correct time', () => {
			const time = {
				hours: 1,
				minutes: 2,
				seconds: 3
			};
			expect(formatTimeInISO(time)).to.equal('01:02:03');
		});

		it('should return the correct date', () => {
			const time = {
				hours: 11,
				minutes: 22,
				seconds: 33
			};
			expect(formatTimeInISO(time)).to.equal('11:22:33');
		});

		it('should throw when incorrect input', () => {
			expect(() => {
				formatTimeInISO('hello');
			}).to.throw('Invalid input: Expected input to be object containing hours, minutes, and seconds');
		});

		it('should throw when no hours', () => {
			expect(() => {
				formatTimeInISO({minutes: 10, seconds: 20});
			}).to.throw('Invalid input: Expected input to be object containing hours, minutes, and seconds');
		});

		it('should throw when no minutes', () => {
			expect(() => {
				formatTimeInISO({hours: 2013, seconds: 20});
			}).to.throw('Invalid input: Expected input to be object containing hours, minutes, and seconds');
		});

		it('should throw when no seconds', () => {
			expect(() => {
				formatTimeInISO({hours: 2013, minutes: 3});
			}).to.throw('Invalid input: Expected input to be object containing hours, minutes, and seconds');
		});
	});

	describe('getDateFromDateObj', () => {
		it('should return the correct date', () => {
			const date = {
				year: 2020,
				month: 3,
				date: 1
			};
			expect(getDateFromDateObj(date)).to.deep.equal(new Date(2020, 2, 1));
		});

		it('should throw when invalid date format', () => {
			expect(() => {
				getDateFromDateObj();
			}).to.throw();
		});
	});

	describe('getDateFromISODate', () => {
		it('should return the correct date', () => {
			expect(getDateFromISODate('2019-01-30')).to.deep.equal(new Date(2019, 0, 30));
		});

		it('should throw when invalid date format', () => {
			expect(() => {
				getDateFromISODate('2019/01/30');
			}).to.throw('Invalid input: Expected format is YYYY-MM-DD');
		});
	});

	describe('getLocalDateTimeFromUTCDateTime', () => {
		it('should return the correct date and time', () => {
			expect(getLocalDateTimeFromUTCDateTime('2019-01-30T12:05:10.000Z')).to.equal('2019-01-30T07:05:10.000');
		});

		it('should return the correct date and time', () => {
			expect(getLocalDateTimeFromUTCDateTime('2019-11-02T03:00:00.000Z')).to.equal('2019-11-01T23:00:00.000');
		});
	});

	describe('getToday', () => {
		let clock;
		beforeEach(() => {
			const newToday = new Date('2018-02-12T20:00:00Z');
			clock = sinon.useFakeTimers(newToday.getTime());
		});

		afterEach(() => {
			clock.restore();
			documentLocaleSettings.timezone.identifier = 'America/Toronto';
		});

		it('should return expected day in America/Toronto timezone', () => {
			expect(getToday()).to.deep.equal({year: 2018, month: 2, date: 12, hours: 15, minutes: 0, seconds: 0});
		});

		it('should return expected day in Australia/Eucla timezone', () => {
			documentLocaleSettings.timezone.identifier = 'Australia/Eucla';
			expect(getToday()).to.deep.equal({year: 2018, month: 2, date: 13, hours: 4, minutes: 45, seconds: 0});
		});
	});

	describe('getUTCDateTimeFromLocalDateTime', () => {
		it('should return the correct result', () => {
			const date = '2019-02-10';
			const time = '14:20:30';
			expect(getUTCDateTimeFromLocalDateTime(date, time)).to.equal('2019-02-10T19:20:30.000Z');
		});

		it('should return the correct result', () => {
			const date = '2030-01-20';
			const time = '2:3:4';
			expect(getUTCDateTimeFromLocalDateTime(date, time)).to.equal('2030-01-20T07:03:04.000Z');
		});

		it('should return the correct result when date contains time', () => {
			const date = '2030-01-20T12:00:00';
			const time = '2:3:4';
			expect(getUTCDateTimeFromLocalDateTime(date, time)).to.equal('2030-01-20T07:03:04.000Z');
		});

		it('should return the correct result when time contains date', () => {
			const date = '2030-01-20';
			const time = '2012-01-10T2:3:4';
			expect(getUTCDateTimeFromLocalDateTime(date, time)).to.equal('2030-01-20T07:03:04.000Z');
		});

		it('should throw when no time', () => {
			expect(() => {
				getUTCDateTimeFromLocalDateTime('2019-01-03');
			}).to.throw('Invalid input: Expected date and time');
		});
	});

	describe('parseISODate', () => {
		it('should return correct date', () => {
			expect(parseISODate('2019-01-30')).to.deep.equal({year: 2019, month: 1, date: 30});
		});

		it('should return correct date when full ISO date', () => {
			expect(parseISODate('2019-01-30T15:00:00.000Z')).to.deep.equal({year: 2019, month: 1, date: 30});
		});

		it('should throw when invalid date format', () => {
			expect(() => {
				parseISODate('2019/01/30');
			}).to.throw('Invalid input: Expected format is YYYY-MM-DD');
		});
	});

	describe('parseISODateTime', () => {
		it('should return correct date if date and time provided', () => {
			expect(parseISODateTime('2019-10-30T12:10:30.000Z')).to.deep.equal({year: 2019, month: 10, date: 30, hours: 12, minutes: 10, seconds: 30});
		});

		it('should throw when invalid date format', () => {
			expect(() => {
				parseISODateTime('2019/01/30');
			}).to.throw('Invalid input: Expected format is YYYY-MM-DD');
		});
	});

	describe('parseISOTime', () => {
		it('should return correct time when full ISO date', () => {
			expect(parseISOTime('2019-02-12T18:00:00.000Z')).to.deep.equal({hours: 18, minutes: 0, seconds: 0});
		});

		it('should return correct time when hours, minutes, seconds', () => {
			expect(parseISOTime('12:10:30')).to.deep.equal({hours: 12, minutes: 10, seconds: 30});
		});

		it('should return correct time when hours, minutes', () => {
			expect(parseISOTime('12:10')).to.deep.equal({hours: 12, minutes: 10, seconds: 0});
		});

		it('should return all 0 when just hours', () => {
			expect(parseISOTime('13')).to.deep.equal({hours: 0, minutes: 0, seconds: 0});
		});

		it('should return all 0 when empty input', () => {
			expect(parseISOTime('')).to.deep.equal({hours: 0, minutes: 0, seconds: 0});
		});

		it('should return all 0 when just date', () => {
			expect(parseISOTime('2019-02-12')).to.deep.equal({hours: 0, minutes: 0, seconds: 0});
		});

		it('should return all 0 when no input', () => {
			expect(parseISOTime('')).to.deep.equal({hours: 0, minutes: 0, seconds: 0});
		});
	});

});
