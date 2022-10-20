/* global Popper */

// Modeled on: https://popper.js.org/docs/v2/tutorial/

export function initPopper(button, tooltip, options) {
	const popperInstance = Popper.createPopper(button, tooltip, {
		modifiers: [
			{
				name: 'offset',
				options: { offset: [0, 8] },
			},
		],
		...options,
	});

	function show() {
		// Make the tooltip visible
		tooltip.setAttribute('data-show', '');

		// Enable the event listeners
		popperInstance.setOptions((options) => ({
			...options,
			modifiers: [
				...options.modifiers,
				{ name: 'eventListeners', enabled: true },
			],
		}));

		// Update its position
		popperInstance.update();
	}

	function hide() {
		// Hide the tooltip
		tooltip.removeAttribute('data-show');

		// Disable the event listeners
		popperInstance.setOptions((options) => ({
			...options,
			modifiers: [
				...options.modifiers,
				{ name: 'eventListeners', enabled: false },
			],
		}));
	}

	function toggle() {
		tooltip.toggleAttribute('data-show');
		popperInstance.setOptions((options) => ({
			...options,
			modifiers: [
				...options.modifiers,
				{ name: 'eventListeners', enabled: tooltip.getAttribute('data-show') !== null },
			],
		}));
	}

	const activateOnHover = false;
	if (activateOnHover) {
		const showEvents = ['mouseenter', 'focus'];
		const hideEvents = ['mouseleave', 'blur'];

		showEvents.forEach((event) => {
			button.addEventListener(event, show);
		});

		hideEvents.forEach((event) => {
			button.addEventListener(event, hide);
		});
	} else {
		button.addEventListener('click', toggle);
	}
}
