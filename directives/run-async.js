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
import { directive } from 'lit-html/lit-html.js';

const hasAbortController = typeof AbortController === 'function';
const runs = new WeakMap();
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
 */
export const runAsync = directive((key, task, templates) => (part) => {
	const { success, pending, initial, failure } = templates;
	const currentRunState = runs.get(part);
	// The first time we see a value we save and await the work function.
	// TODO(justinfagnani): allow a custom invalidate function
	if (currentRunState === undefined || currentRunState.key !== key) {
		// Abort a pending request if there is one
		if (currentRunState !== undefined && currentRunState.state === 'pending') {
			if (currentRunState.abortController !== undefined) {
				currentRunState.abortController.abort();
			}
			// TODO(justinfagnani): This should be an AbortError, but it's not
			// implemented yet
			currentRunState.rejectPending(new Error());
		}
		const abortController = hasAbortController ? new AbortController() : undefined;
		const abortSignal = hasAbortController ? abortController.signal : undefined;
		let resolvePending;
		let rejectPending;
		const pendingPromise = new Promise((res, rej) => {
			resolvePending = res;
			rejectPending = rej;
		});
		const promise = task(key, { signal: abortSignal });
		// The state is immediately 'pending', since the function has been
		// executed, but if the function throws an InitialStateError to
		// indicate that it couldn't even start processing, then we will set
		// the state to 'initial'.
		const runState = {
			key,
			promise,
			state: 'pending',
			abortController,
			resolvePending,
			rejectPending,
		};
		runs.set(part, runState);
		Promise.resolve(promise).then((value) => {
			runState.state = 'success';
			const currentRunState = runs.get(part);
			runState.resolvePending();
			if (currentRunState !== runState) {
				return;
			}
			part.setValue(success(value));
			part.commit();
		}, (error) => {
			const currentRunState = runs.get(part);
			runState.rejectPending(new Error());
			if (currentRunState !== runState) {
				return;
			}
			if (error instanceof InitialStateError && typeof initial === 'function') {
				runState.state = 'initial';
				part.setValue(initial());
				part.commit();
			} else {
				runState.state = 'failure';
				if (typeof failure === 'function') {
					// render success callback
					part.setValue(failure(error));
					part.commit();
				}
			}
		});
		(async() => {
			// Wait a microtask for the initial render of the Part to complete
			await 0;
			const currentRunState = runs.get(part);
			if (currentRunState === runState && currentRunState.state === 'pending') {
				const element = part.startNode.parentNode.nodeType === Node.ELEMENT_NODE ? part.startNode.parentNode : part.startNode.parentNode.host;
				element.dispatchEvent(new CustomEvent('pending-state', {
					composed: true,
					bubbles: true,
					detail: { promise: pendingPromise }
				}));
			}
		})();
	}
	// If the promise has not yet resolved, set/update the defaultContent
	const latestRunState = currentRunState;
	if ((latestRunState === undefined || latestRunState.state === 'pending') && typeof pending === 'function') {
		part.setValue(pending());
	}
});
/**
 * Error thrown by async tasks when the task couldn't be started based on the
 * key passed to it.
 */
export class InitialStateError extends Error {}
