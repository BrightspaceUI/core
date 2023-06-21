import { expect, fixture } from '@brightspace-ui/testing';
import { InitialStateError, runAsync } from '../run-async.js';
import { html } from 'lit';

describe('run-async directive', () => {

	let taskKey, taskInfo, taskResolve, taskReject;
	function task(key, info) {
		taskKey = key;
		taskInfo = info;
		return new Promise((res, rej) => {
			taskResolve = res;
			taskReject = rej;
		});
	}

	function createFixture(key = 'some-key', pendingState = true) {
		return fixture(html`<p>${runAsync(key, task, {
			initial: () => html`initial`,
			failure: () => html`failure`,
			pending: () => html`pending`,
			success: () => html`success`
		},
		{ pendingState: pendingState })}</p>`);
	}

	afterEach(() => {
		taskKey = undefined;
		taskInfo = undefined;
		taskResolve = undefined;
		taskReject = undefined;
	});

	describe('task execution', () => {

		it('should pass key and abort controller to task', async() => {
			await createFixture('my-key');
			expect(taskKey).to.equal('my-key');
			expect(taskInfo.signal).to.not.be.undefined;
		});

	});

	describe('templates', () => {

		it('should render initial template if InitialStateError occurs', async() => {
			const elem = await createFixture();
			taskReject(new InitialStateError());
			await elem.updateComplete;
			expect(elem.innerText).to.equal('initial');
		});

		it('should render failure template if InitialStateError occurs but no initial template is provided', async() => {

			const elem = await fixture(html`<p>${runAsync('key', task, {
				failure: () => html`failure`
			})}</p>`);

			taskReject(new InitialStateError());
			await elem.updateComplete;
			expect(elem.innerText).to.equal('failure');

		});

		it('should render failure template if task is rejected', async() => {
			const elem = await createFixture();
			// this causes "An error was thrown in a Promise outside a test. Did you forget to await a function or assertion?"
			// to be logged -- that's OK.
			taskReject(new Error('oh no'));
			await elem.updateComplete;
			expect(elem.innerText).to.equal('failure');
		});

		it('should render pending template while task is executing', async() => {
			const elem = await createFixture();
			expect(elem.innerText).to.equal('pending');
		});

		it('should render success template when task completes', async() => {
			const elem = await createFixture();
			taskResolve();
			await elem.updateComplete;
			expect(elem.innerText).to.equal('success');
		});

	});

	describe('pending-state event', () => {

		it('should fire "pending-state" event', (done) => {

			document.body.addEventListener('pending-state', (e) => {
				e.detail.promise.then(() => done());
				taskResolve();
			});

			createFixture();

		});

		it('should not fire "pending-state" event when option set', async() => {

			let eventFired = false;
			document.body.addEventListener('pending-state', () => eventFired = true);

			await createFixture('key', false);
			expect(eventFired).to.be.false;

		});

	});

});
