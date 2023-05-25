import { sendKeys, sendMouse } from '@web/test-runner-commands';

export const focusWithKeyboard = async(element) => {
	await sendKeys({ press: 'Tab' });
	element.focus({ focusVisible: true });
};

export const focusWithMouse = async(element) => {
	const { x, y } = element.getBoundingClientRect();
	await sendMouse({ type: 'click', position: [Math.ceil(x), Math.ceil(y)] });
	await sendMouse({ type: 'move', position: [0, 0] });
};
