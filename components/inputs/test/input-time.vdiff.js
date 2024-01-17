import '../input-time.js';
import { clickElem, expect, fixture, focusElem, html, oneEvent, sendKeysElem } from '@brightspace-ui/testing';
import { reset, useFakeTimers } from 'sinon';
import { ifDefined } from 'lit/directives/if-defined.js';

const create = (opts = {}) => {
	const { disabled, enforceTimeIntervals, label, labelHidden, opened, required, skeleton, value } = {
		disabled: false,
		enforceTimeIntervals: false,
		label: 'Start Time',
		labelHidden: true,
		opened: false,
		required: false,
		skeleton: false,
		value: undefined,
		...opts
	};
	return html`
		<d2l-input-time
			?disabled="${disabled}"
			?enforce-time-intervals="${enforceTimeIntervals}"
			label="${label}"
			?label-hidden="${labelHidden}"
			?opened="${opened}"
			?required="${required}"
			?skeleton="${skeleton}"
			value="${ifDefined(value)}"></d2l-input-time>
	`;
};

const inlineHelpComponent = html`
	<d2l-input-time label="Start Time" default-value="09:00:00">
		<div slot="inline-help">
			<b>Inline</b> help text!
		</div>
	</d2l-input-time>
`;

const newToday = new Date('2018-02-12T19:12Z');
const viewport = { width: 650, height: 1100 };

describe('d2l-input-time', () => {

	before(() => useFakeTimers({ now: newToday.getTime(), toFake: ['Date'] }));
	after(() => reset());

	[
		{ name: 'disabled', template: create({ disabled: true, value: '4:00:00' }) },
		{ name: 'enforce', template: create({ enforceTimeIntervals: true, value: '00:15:00' }) },
		{ name: 'labelled', template: create({ labelHidden: false, value: '2:00:00' }) },
		{ name: 'labelled-skeleton', template: create({ labelHidden: false, skeleton: true, value: '2:00:00' }) },
		{ name: 'label-hidden', template: create({ value: '3:00:00' }) },
		{ name: 'label-hidden-skeleton', template: create({ skeleton: true, value: '3:00:00' }) },
		{ name: 'required', template: create({ label: 'End Time', labelHidden: false, required: true }) },
		{ name: 'inline-help', template: inlineHelpComponent }
	].forEach(({ name, template }) => {
		it(name, async() => {
			const elem = await fixture(template, { viewport });
			await expect(elem).to.be.golden();
		});
	});

	it('focus', async() => {
		const elem = await fixture(create({ value: '1:00:00' }), { viewport });
		await focusElem(elem);
		await expect(elem).to.be.golden();
	});

	describe('opened behavior', () => {

		it('opened-disabled', async() => {
			const elem = await fixture(create({ disabled: true, opened: true }), { viewport });
			await expect(elem).to.be.golden();
		});

		it('opened-skeleton', async() => {
			const elem = await fixture(create({ opened: true, skeleton: true }), { viewport });
			await expect(elem).to.be.golden();
		});

		it('opened-disabled remove disabled', async() => {
			const elem = await fixture(create({ disabled: true, opened: true }), { viewport });
			elem.removeAttribute('disabled');
			await oneEvent(elem, 'd2l-dropdown-open');
			await expect(elem).to.be.golden();
		});

		it('opened-skeleton remove skeleton', async() => {
			const elem = await fixture(create({ opened: true, skeleton: true }), { viewport });
			elem.removeAttribute('skeleton');
			await oneEvent(elem, 'd2l-dropdown-open');
			await expect(elem).to.be.golden();
		});
	});

	describe('localization', () => {

		[
			'ar',
			'da',
			'de',
			'es',
			'fr',
			'nl',
			'pt',
			'sv',
			'zh',
			'tr'
		].forEach((lang) => {
			it(`${lang} am`, async() => {
				const elem = await fixture(create({ value: '10:59:00' }), { lang, viewport });
				await expect(elem).to.be.golden();
			});
			it(`${lang} pm`, async() => {
				const elem = await fixture(create({ value: '23:33:00' }), { lang, viewport });
				await expect(elem).to.be.golden();
			});
		});
	});

	describe('open behavior', () => {

		it('dropdown open keydown top', async() => {
			const elem = await fixture(create({ value: '00:15:00' }), { viewport });
			await sendKeysElem(elem, 'press', 'Enter');
			await expect(elem).to.be.golden();
		});

		it('dropdown open keydown selected', async() => {
			const elem = await fixture(create({ value: '02:00:00' }), { viewport });
			await sendKeysElem(elem, 'press', 'Enter');
			await expect(elem).to.be.golden();
		});

		it('dropdown open click', async() => {
			const elem = await fixture(create({ value: '00:15:00' }), { viewport });
			clickElem(elem);
			await oneEvent(elem, 'd2l-dropdown-open');
			await expect(elem).to.be.golden();
		});

		it('dropdown open enforce-time-intervals', async() => {
			const elem = await fixture(create({ enforceTimeIntervals: true, opened: true, value: '00:15:00' }), { viewport });
			await expect(elem).to.be.golden();
		});

	});

});
