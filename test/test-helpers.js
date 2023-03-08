import { sendKeys, sendMouse } from '@web/test-runner-commands';

export const testRunnerKeyboardFocus = async(element) => {
	await sendKeys({ press: 'Tab' });
	element.focus();
};
export const testRunnerMouseFocus = async(element) => {
	const { x, y } = element.getBoundingClientRect();
	await sendMouse({ type: 'click', position: [x, y] });
};

