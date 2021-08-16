/**
 * Originally based on the Polymer run-async Lit 1.0 directive:
 * https://github.com/PolymerLabs/async-demos/blob/master/packages/await-io/src/run-async.ts
 * Ported to Lit 2.0
 */
/**
 * @license
 * Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
import { AsyncDirective } from 'lit-html/async-directive.js';
import { AsyncStateEvent } from '../../helpers/asyncStateEvent.js';
import { directive } from 'lit-html/directive.js';
import { noChange } from 'lit-html';

const hasAbortController = typeof AbortController === 'function';

/**
 * Error thrown by async tasks when the task couldn't be started based on the
 * key passed to it.
 */
export class InitialStateError extends Error {}

class RunAsync extends AsyncDirective {

	constructor(partInfo) {
		super(partInfo);
		this.abortController = hasAbortController ? new AbortController() : undefined;
		this.key = undefined;
		this.pendingPromise = undefined;
		this.rejectPending = undefined;
		this.resolvePending = undefined;
		this.state = 'initial';
	}

	render(key, task, templates) {

		const { success, pending, initial, failure } = templates;

		// first time we see a value we save and await the work function.
		if (this.key !== key) {

			// abort a pending request if there is one
			if (this.state === 'pending') {
				if (this.abortController !== undefined) {
					this.abortController.abort();
				}
			}

			const taskPromise = task(key, {
				signal: hasAbortController ? this.abortController.signal : undefined
			});
			// The state is immediately 'pending', since the function has been
			// executed, but if the function throws an InitialStateError to
			// indicate that it couldn't even start processing, then we will set
			// the state to 'initial'.
			this.key = key;
			this.pendingPromise = new Promise((res, rej) => {
				this.resolvePending = res;
				this.rejectPending = rej;
			}).catch((error) => {
				// swallow initial state errors
				if (!(error instanceof InitialStateError)) {
					throw error;
				}
			});
			this.state = 'pending';
			Promise.resolve(taskPromise).then((value) => {
				this.state = 'success';
				this.resolvePending();
				this.setValue(success(value));
			}, (error) => {
				this.rejectPending(error);
				if (error instanceof InitialStateError && typeof initial === 'function') {
					this.state = 'initial';
					this.setValue(initial());
				} else {
					this.state = 'failure';
					if (typeof failure === 'function') {
						this.setValue(failure(error));
					}
				}
			});
		}

		if ((this.state === 'pending') && typeof pending === 'function') {
			return pending();
		}

		return noChange;

	}

	update(part, [key, task, templates, options]) {
		const renderResult = this.render(key, task, templates);
		const directiveOptions = Object.assign({ pendingState: true }, options);
		if (directiveOptions.pendingState && this.key === key && this.state === 'pending') {
			const element = part.parentNode.nodeType === Node.ELEMENT_NODE ? part.parentNode : part.parentNode.host;
			if (element) {
				element.dispatchEvent(new AsyncStateEvent(this.pendingPromise));
			}
		}
		return renderResult;
	}

}

/**
 * Runs an async function whenever the key changes, and calls one of several
 * lit-html template functions depending on the state of the async call:
 *
 *  - success() is called when the result of the function resolves.
 *  - pending() is called immediately
 *  - initial() is called if the function rejects with a InitialStateError,
 *    which lets the function indicate that it couldn't proceed with the
 *    provided key. This is usually the case when there isn't data to load.
 *  - failure() is called if the function rejects.
 *
 * @param key A parameter passed to the task function. The task function is only
 *     called when they key changes.
 * @param task An async function to run when the key changes
 * @param templates The templates to render for each state of the task
 * @param options The directive options, for example whether to dispatch pending-state
 */
export const runAsync = directive(RunAsync);
