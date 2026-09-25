import { buttonToggleFixtures, clickActiveButton } from './button-toggle-fixtures.js';
import { expect, fixture, html, oneEvent, runConstructor } from '@brightspace-ui/testing';
import { mockFlag, resetFlag } from '../../../helpers/flags.js';

describe('d2l-button-toggle', () => {

	// remove with "button-toggle-no-change-event-on-prop-update" flag
	afterEach(() => {
		resetFlag('button-toggle-no-change-event-on-prop-update');
	});

	describe('constructor', () => {

		it('should construct', () => {
			runConstructor('d2l-button-toggle');
		});

	});

	describe('events', () => {

		it('dispatches "d2l-button-toggle-change" event not-pressed is clicked', async() => {
			const el = await fixture(buttonToggleFixtures.iconNotPressed);
			clickActiveButton(el);
			const e = await oneEvent(el, 'd2l-button-toggle-change');
			expect(e.target.pressed).to.equal(true);
		});

		it('dispatches "d2l-button-toggle-change" event pressed is clicked', async() => {
			const el = await fixture(buttonToggleFixtures.iconPressed);
			clickActiveButton(el);
			const e = await oneEvent(el, 'd2l-button-toggle-change');
			expect(e.target.pressed).to.equal(false);
		});

		it('does not dispatch "d2l-button-toggle-change" event when "pressed" property is updated', async() => {
			const el = await fixture(buttonToggleFixtures.iconPressed);
			let dispatched = false;
			el.addEventListener('d2l-button-toggle-change', () => dispatched = true);
			el.pressed = false;
			await el.updateComplete;
			expect(dispatched).to.equal(false);
		});

		// remove with "button-toggle-no-change-event-on-prop-update" flag
		it('dispatches "d2l-button-toggle-change" event when "pressed" property is updated and flag is OFF', async() => {
			mockFlag('button-toggle-no-change-event-on-prop-update', false);
			const el = await fixture(buttonToggleFixtures.iconPressed);
			let dispatched = false;
			el.addEventListener('d2l-button-toggle-change', () => dispatched = true);
			el.pressed = false;
			await el.updateComplete;
			expect(dispatched).to.equal(true);
		});

		// remove test with "button-toggle-no-change-event-on-prop-update" flag
		it('does not dispatch "d2l-button-toggle-change" event initially', async() => {
			let dispatched = false;
			const el = document.createElement('d2l-button-toggle');
			el.addEventListener('d2l-button-toggle-change', () => dispatched = true);
			document.body.appendChild(el);
			await el.updateComplete;
			expect(dispatched).to.equal(false);
		});

		it('does not dispatch "d2l-button-toggle-change" event if disabled buttons are clicked', async() => {
			const el = await fixture(buttonToggleFixtures.iconDisabled);
			let dispatched = false;
			el.addEventListener('d2l-button-toggle-change', () => dispatched = true);
			await clickActiveButton(el);
			expect(el.pressed).to.equal(false);
			expect(dispatched).to.be.false;
		});

	});

	describe('consumer manages state', () => {

		let el;
		beforeEach(async() => {
			el = await fixture(buttonToggleFixtures.iconNotPressed);
		});

		it('click with no state management', async() => {
			el.addEventListener('d2l-button-toggle-before-change', (e) => {
				e.preventDefault();
			});
			await clickActiveButton(el);
			expect(el.pressed).to.equal(false);
		});

		it('click once with state management', async() => {
			el.addEventListener('d2l-button-toggle-before-change', (e) => {
				e.preventDefault();
				e.detail.update(!e.target.pressed);
			});
			clickActiveButton(el);
			const e = await oneEvent(el, 'd2l-button-toggle-change');
			expect(e.target.pressed).to.equal(true);
		});

		it('d2l-button-toggle-before-change event has correct detail structure', async() => {
			clickActiveButton(el);
			const e = await oneEvent(el, 'd2l-button-toggle-before-change');
			expect(e.detail).to.have.property('update').that.is.a('function');
		});
	});

	describe('focus', () => {

		it('throws error when no button exists to focus', async() => {
			const el = await fixture(html`<d2l-button-toggle></d2l-button-toggle>`);
			expect(() => el.focus()).to.throw('d2l-button-toggle: no button to focus');
		});

	});

});
