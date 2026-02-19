import '../button-subtle.js';
import { fixture, html, oneEvent } from '@brightspace-ui/testing';

const PARAM_SESSION_ID = 'wtr-session-id';

const sessionId = new URL(window.location.href).searchParams.get(PARAM_SESSION_ID);

async function executeServerCommand(command, payload, pluginName) {
	if (typeof sessionId !== 'string') {
		throw new Error(
			'Unable to execute server commands in a browser not controlled by the test runner. ' +
			'Use the debug option from the watch menu to debug in a controlled browser.',
		);
	}

	let sendMessageWaitForResponse;
	try {
		const webSocketModule = await import('/__web-dev-server__web-socket.js');
		({ sendMessageWaitForResponse } = webSocketModule);
	} catch (error) {
		throw new Error(
			'Could not setup web socket connection. Are you executing this test through Web Test Runner?',
		);
	}

	try {
		const response = await sendMessageWaitForResponse({
			type: 'wtr-command',
			sessionId,
			command,
			payload,
		});

		if (!response.executed) {
			let msg;
			if (pluginName) {
				msg = `Unknown command ${command}. Add the ${pluginName} to your config.`;
			} else {
				msg = `Unknown command ${command}. Did you install a plugin to handle this command?`;
			}
			throw new Error(msg);
		}

		return response.result;
	} catch (error) {
		throw new Error(
			`Error while executing command ${command}${
				payload ? ` with payload ${JSON.stringify(payload)}` : ''
			}: ${error.message}`,
		);
	}
}

function getElementPosition(elem) {
	const { x, y, width, height } = elem.getBoundingClientRect();
	return {
		left: Math.floor(x + window.scrollX),
		top: Math.floor(y + window.scrollY),
		x: Math.floor(x + window.scrollX + width / 2),
		y: Math.floor(y + window.scrollY + height / 2),
	};
}

async function clickAt(x, y) {
	await sendMouse({ type: 'click', position: [x, y] });
}

async function clickElem(elem) {
	const position = getElementPosition(elem);
	return clickAt(position.x, position.y);
}

function sendMouse(options) {
  return executeServerCommand('send-mouse', options);
}

describe('d2l-button-subtle', () => {

	describe('events', () => {

		it('dispatches click event when clicked', async() => {
			const el = await fixture(html`<d2l-button-subtle text="Subtle Button"></d2l-button-subtle>`);
			clickElem(el);
			await oneEvent(el, 'click');
		});

		it('dispatches click event when button clicked', async() => {
			const el = await fixture(html`<button>button</button>`);
			clickElem(el);
			await oneEvent(el, 'click');
		});

	});

	/*runButtonPropertyTests(getFixture);

	describe('button-subtle specific properties', () => {

		it('should use ariaLabel when provided for aria-label', async() => {
			const el = await fixture(html`<d2l-button-subtle text="Subtle Button" aria-label="Custom Label"></d2l-button-subtle>`);
			const button = el.shadowRoot.querySelector('button');
			expect(button.getAttribute('aria-label')).to.equal('Custom Label');
		});

		it('should not set aria-label when ariaLabel is not provided', async() => {
			const el = await fixture(html`<d2l-button-subtle text="Subtle Button"></d2l-button-subtle>`);
			const button = el.shadowRoot.querySelector('button');
			expect(button.hasAttribute('aria-label')).to.be.false;
		});

	});*/

});
