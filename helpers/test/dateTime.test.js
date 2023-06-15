import { formatDateInISO,
	formatDateTimeInISO,
	formatTimeInISO,
	getClosestValidDate,
	getDateFromDateObj,
	getDateFromISODate,
	getDateFromISODateTime,
	getDateFromISOTime,
	getLocalDateTimeFromUTCDateTime,
	getToday,
	getUTCDateTimeFromLocalDateTime,
	isDateInRange,
	parseISODate,
	parseISODateTime,
	parseISOTime } from '../dateTime.js';
import { expect } from '@brightspace-ui/testing';
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
				formatDateInISO({ month: 10, date: 20 });
			}).to.throw('Invalid input: Expected input to be object containing year, month, and date');
		});

		it('should throw when no month', () => {
			expect(() => {
				formatDateInISO({ year: 2013, date: 20 });
			}).to.throw('Invalid input: Expected input to be object containing year, month, and date');
		});

		it('should throw when no date', () => {
			expect(() => {
				formatDateInISO({ year: 2013, month: 3 });
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
				formatTimeInISO({ minutes: 10, seconds: 20 });
			}).to.throw('Invalid input: Expected input to be object containing hours, minutes, and seconds');
		});

		it('should throw when no minutes', () => {
			expect(() => {
				formatTimeInISO({ hours: 2013, seconds: 20 });
			}).to.throw('Invalid input: Expected input to be object containing hours, minutes, and seconds');
		});

		it('should throw when no seconds', () => {
			expect(() => {
				formatTimeInISO({ hours: 2013, minutes: 3 });
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

	['America/Toronto', 'Australia/Eucla'].forEach((timezone) => {
		describe(`getClosestValidDate in ${timezone}`, () => {
			let clock;
			const today = '2018-02-12T20:00:00.000Z';
			const todayDate = timezone === 'America/Toronto' ? '2018-02-12' : '2018-02-13';

			before(() => {
				documentLocaleSettings.timezone.identifier = timezone;
				const newToday = new Date(today);
				clock = sinon.useFakeTimers({ now: newToday.getTime(), toFake: ['Date'] });
			});

			after(() => {
				clock.restore();
				documentLocaleSettings.timezone.identifier = 'America/Toronto';
			});

			describe('dateTime', () => {
				it('returns today when no min and max', () => {
					expect(getClosestValidDate(null, null, true)).to.equal(today);
				});

				it('returns today when today after min', () => {
					expect(getClosestValidDate('2017-12-12T08:00:00.000Z', null, true)).to.equal(today);
				});

				it('returns today when today before max', () => {
					expect(getClosestValidDate(null, '2020-11-12T08:00:00.000Z', true)).to.equal(today);
				});

				it('returns min when today before min', () => {
					const min = '2020-12-12T12:00:00.000Z';
					expect(getClosestValidDate(min, null, true)).to.equal(min);
				});

				it('returns max when today after max', () => {
					const max = '2017-12-12T08:00:00.000Z';
					expect(getClosestValidDate(null, max, true)).to.equal(max);
				});

				it('returns today when between min and max', () => {
					expect(getClosestValidDate('2015-12-12T08:00:00.000Z', '2020-12-12T08:00:00.000Z', true)).to.equal(today);
				});
			});

			describe('date', () => {
				it('returns today when no min and max', () => {
					expect(getClosestValidDate(null, null, false)).to.equal(todayDate);
				});

				it('returns today when today after min', () => {
					expect(getClosestValidDate('2015-01-10', null, false)).to.equal(todayDate);
				});

				it('returns today when today before max', () => {
					expect(getClosestValidDate(null, '2020-11-10', false)).to.equal(todayDate);
				});

				it('returns min when today before min', () => {
					const min = '2020-01-13';
					expect(getClosestValidDate(min, null, false)).to.equal(min);
				});

				it('returns max when today after max', () => {
					const max = '2015-07-10';
					expect(getClosestValidDate(null, max, false)).to.equal(max);
				});

				it('returns today when between min and max', () => {
					expect(getClosestValidDate('2015-07-10', '2021-01-01', false)).to.equal(todayDate);
				});
			});
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

	describe('getDateFromISODateTime', () => {
		after(() => {
			documentLocaleSettings.timezone.identifier = 'America/Toronto';
		});

		it('should return the correct date', () => {
			expect(getDateFromISODateTime('2019-01-30T12:30:00Z')).to.deep.equal(new Date(2019, 0, 30, 7, 30, 0));
		});

		it('should return expected date in Australia/Eucla timezone', () => {
			documentLocaleSettings.timezone.identifier = 'Australia/Eucla';
			expect(getDateFromISODateTime('2019-01-30T12:30:00Z')).to.deep.equal(new Date(2019, 0, 30, 21, 15, 0));
		});

		it('should throw when invalid date format', () => {
			expect(() => {
				getDateFromISODateTime('2019/01/30T12:34:46Z');
			}).to.throw('Invalid input: Expected format is YYYY-MM-DDTHH:mm:ss.sssZ');
		});
	});

	describe('getDateFromISOTime', () => {
		it('should return the correct date/time', () => {
			const newToday = new Date('2018-02-12T20:00:00Z');
			const clock = sinon.useFakeTimers({ now: newToday.getTime(), toFake: ['Date'] });
			expect(getDateFromISOTime('12:10:30')).to.deep.equal(new Date(2018, 1, 12, 12, 10, 30));
			clock.restore();
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
			clock = sinon.useFakeTimers({ now: newToday.getTime(), toFake: ['Date'] });
		});

		afterEach(() => {
			clock.restore();
			documentLocaleSettings.timezone.identifier = 'America/Toronto';
		});

		it('should return expected day in America/Toronto timezone', () => {
			expect(getToday()).to.deep.equal({ year: 2018, month: 2, date: 12, hours: 15, minutes: 0, seconds: 0 });
		});

		it('should return expected day in Australia/Eucla timezone', () => {
			documentLocaleSettings.timezone.identifier = 'Australia/Eucla';
			expect(getToday()).to.deep.equal({ year: 2018, month: 2, date: 13, hours: 4, minutes: 45, seconds: 0 });
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

	describe('isDateInRange', () => {
		const date = new Date(2018, 2, 3, 12, 0, 0);
		it('should return false if no parameters', () => {
			expect(isDateInRange()).to.be.false;
		});

		it('should return true if no min and max', () => {
			expect(isDateInRange(date)).to.be.true;
		});

		it('should return true if min and date is after min', () => {
			const min = new Date(2018, 1, 30, 12, 0, 0);
			expect(isDateInRange(date, min)).to.be.true;
		});

		it('should return true if min and date is equal to min', () => {
			const min = new Date(2018, 2, 3, 12, 0, 0);
			expect(isDateInRange(date, min)).to.be.true;
		});

		it('should return true if min and date has same date as min but time is after min', () => {
			const min = new Date(2018, 2, 3, 8, 0, 0);
			expect(isDateInRange(date, min)).to.be.true;
		});

		it('should return false if min and date has same date as min but time is before min', () => {
			const min = new Date(2018, 2, 3, 15, 0, 0);
			expect(isDateInRange(date, min)).to.be.false;
		});

		it('should return true if max and date is before max', () => {
			const max = new Date(2018, 5, 1, 12, 0, 0);
			expect(isDateInRange(date, undefined, max)).to.be.true;
		});

		it('should return true if max and date is equal to max', () => {
			const max = new Date(2018, 2, 3, 12, 0, 0);
			expect(isDateInRange(date, undefined, max)).to.be.true;
		});

		it('should return true if max and date has same date as max but time is before max', () => {
			const max = new Date(2018, 2, 3, 18, 0, 0);
			expect(isDateInRange(date, undefined, max)).to.be.true;
		});

		it('should return false if max and date has same date as max but time is after max', () => {
			const max = new Date(2018, 2, 3, 10, 0, 0);
			expect(isDateInRange(date, undefined, max)).to.be.false;
		});

		it('should return true if date is between min and max', () => {
			const min = new Date(2018, 2, 2, 12, 0, 0);
			const max = new Date(2018, 2, 4, 12, 0, 0);
			expect(isDateInRange(date, min, max)).to.be.true;
		});

		it('should return false if min and date is before min', () => {
			const min = new Date(2018, 2, 4, 12, 0, 0);
			expect(isDateInRange(date, min, undefined)).to.be.false;
		});

		it('should return false if max and date is after max', () => {
			const max = new Date(2018, 2, 1, 12, 0, 0);
			expect(isDateInRange(date, undefined, max)).to.be.false;
		});

		it('should return false if min and max and date is before min', () => {
			const min = new Date(2018, 4, 2, 12, 0, 0);
			const max = new Date(2018, 4, 28, 12, 0, 0);
			expect(isDateInRange(date, min, max)).to.be.false;
		});

		it('should return false if min and max and date is after max', () => {
			const min = new Date(2018, 0, 2, 12, 0, 0);
			const max = new Date(2018, 0, 28, 12, 0, 0);
			expect(isDateInRange(date, min, max)).to.be.false;
		});
	});

	describe('parseISODate', () => {
		it('should return correct date', () => {
			expect(parseISODate('2019-01-30')).to.deep.equal({ year: 2019, month: 1, date: 30 });
		});

		it('should return correct date when full ISO date', () => {
			expect(parseISODate('2019-01-30T15:00:00.000Z')).to.deep.equal({ year: 2019, month: 1, date: 30 });
		});

		it('should throw when invalid date format', () => {
			expect(() => {
				parseISODate('2019/01/30');
			}).to.throw('Invalid input: Expected format is YYYY-MM-DD');
		});
	});

	describe('parseISODateTime', () => {
		it('should return correct date if date and time provided', () => {
			expect(parseISODateTime('2019-10-30T12:10:30.000Z')).to.deep.equal({ year: 2019, month: 10, date: 30, hours: 12, minutes: 10, seconds: 30 });
		});

		it('should throw when invalid date format', () => {
			expect(() => {
				parseISODateTime('2019/01/30');
			}).to.throw('Invalid input: Expected format is YYYY-MM-DD');
		});
	});

	describe('parseISOTime', () => {
		it('should return correct time when full ISO date', () => {
			expect(parseISOTime('2019-02-12T18:00:00.000Z')).to.deep.equal({ hours: 18, minutes: 0, seconds: 0 });
		});

		it('should return correct time when hours, minutes, seconds', () => {
			expect(parseISOTime('12:10:30')).to.deep.equal({ hours: 12, minutes: 10, seconds: 30 });
		});

		it('should return correct time when hours, minutes', () => {
			expect(parseISOTime('12:10')).to.deep.equal({ hours: 12, minutes: 10, seconds: 0 });
		});

		it('should throw when invalid time format', () => {
			expect(() => {
				parseISOTime('12');
			}).to.throw('Invalid input: Expected format is hh:mm:ss');
		});

		['12', '', '2019-02-12', 'text'].forEach((val) => {
			it(`should throw when invalid time format: "${val}"`, () => {
				expect(() => parseISOTime(val)).to.throw('Invalid input: Expected format is hh:mm:ss');
			});
		});

	});

});
