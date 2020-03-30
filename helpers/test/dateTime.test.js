import { formatDateInISO, getToday, parseISODate } from '../dateTime.js';
import { expect } from '@open-wc/testing';
import { getDocumentLocaleSettings } from '@brightspace-ui/intl/lib/common.js';
import sinon from 'sinon';

describe('date-time', () => {
	const documentLocaleSettings = getDocumentLocaleSettings();
	documentLocaleSettings.timezone.identifier = 'America/Toronto';

	describe('formatDateInISO', () => {
		it('should return the correct date', () => {
			const testDate = new Date(2020, 2, 1);
			expect(formatDateInISO(testDate)).to.equal('2020-03-01');
		});

		it('should return the correct date', () => {
			const testDate = new Date(2020, 9, 10);
			expect(formatDateInISO(testDate)).to.equal('2020-10-10');
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
			expect(getToday()).to.deep.equal(new Date(2018, 1, 12));
		});

		it('should return expected day in Australia/Eucla timezone', () => {
			documentLocaleSettings.timezone.identifier = 'Australia/Eucla';
			expect(getToday()).to.deep.equal(new Date(2018, 1, 13));
		});
	});

	describe('parseISODate', () => {
		it('should return correct date if date and time provided', () => {
			expect(parseISODate('2019-01-30')).to.deep.equal(new Date(2019, 0, 30));
		});

		it('should throw when invalid date format', () => {
			expect(() => {
				parseISODate('2019/01/30');
			}).to.throw('Invalid input: Expected format is YYYY-MM-DD');
		});
	});

});
