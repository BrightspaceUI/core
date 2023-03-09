import { sendKeys, sendMouse } from '@web/test-runner-commands';

export const focusWithKeyboard = async(element) => {
	await sendKeys({ press: 'Tab' });
	element.focus();
};

export const focusWithMouse = async(element) => {
	const { x, y } = element.getBoundingClientRect();
	await sendMouse({ type: 'click', position: [x, y] });
};
