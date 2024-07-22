import { clearDismissible, setDismissible } from '../dismissible.js';
import { expect } from '@brightspace-ui/testing';
import { spy } from 'sinon';

function pressEscape() {
	const event = new CustomEvent('keydown', {
		detail: 0,
		bubbles: true,
		cancelable: true,
		composed: true
	});
	event.keyCode = 27;
	event.code = 27;
	document.dispatchEvent(event);
}

describe('dismissible', () => {

	const ids = [];

	beforeEach(() => {
		spy(document, 'removeEventListener');
	});

	afterEach(() => {
		ids.forEach((id) => {
			clearDismissible(id);
		});
		ids.splice(0);
		document.removeEventListener.restore();
	});

	it('should call callback on ESC', async(done) => {
		setDismissible(() => done());
		pressEscape();
	});

	it('should not call callback on clear', () => {
		const id = setDismissible(() => {
			throw new Error('callback called');
		});
		expect(() => clearDismissible(id)).to.not.throw();
	});

	it('should dismiss via ESC in FILO order', async(done) => {
		ids.push(setDismissible(() => {
			throw new Error('callback called');
		}));
		setDismissible(() => done());
		expect(() => pressEscape()).to.not.throw();
	});

	it('should skip manually dismissed entries', async(done) => {
		setDismissible(() => done());
		const id = setDismissible(() => {
			throw new Error('callback called');
		});
		expect(() => {
			clearDismissible(id);
			pressEscape();
		}).to.not.throw();
	});

	it('should handle unrecognized id during clear', () => {
		expect(() => clearDismissible(123)).to.not.throw();
	});

	[undefined, null, 0, 'hello', []].forEach((cb) => {
		it(`should handle invalid callback: ${JSON.stringify(cb)}`, () => {
			expect(() => {
				setDismissible(cb);
				pressEscape();
			}).to.not.throw();
		});
	});

	it('should remove event listener when stack is empty via ESC', () => {
		setDismissible();
		pressEscape();
		expect(document.removeEventListener.calledOnce).to.be.true;
	});

	it('should remove event listener when stack is empty via clear', () => {
		const id = setDismissible();
		clearDismissible(id);
		expect(document.removeEventListener.calledOnce).to.be.true;
	});

});
