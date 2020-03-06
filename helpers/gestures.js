const maxTime = 2000;
const minDistance = 30;

export function registerSwipe(node) {
	node.addEventListener('touchstart', handleTouchStart);
}

function handleTouchStart(e) {

	const node = this; /* eslint-disable-line no-invalid-this */

	let tracking = {
		start: {
			time: performance.now(),
			x: e.touches[0].clientX,
			y: e.touches[0].clientY
		}
	};

	const reset = () => {
		tracking = null;
		node.removeEventListener('touchend', handleTouchEnd);
		node.removeEventListener('touchermove', handleTouchMove);
		node.removeEventListener('touchcancel', handleTouchCancel);
	};

	const handleTouchCancel = () => {
		reset();
		return;
	};

	const handleTouchEnd = () => {

		if (!tracking || !tracking.end) {
			return;
		}

		const elapsedTime = performance.now() - tracking.start.time;
		if (elapsedTime > maxTime) {
			reset();
			return;
		}

		const distanceX = tracking.end.x - tracking.start.x;
		const distanceY = tracking.end.y - tracking.start.y;

		let theta = Math.atan(Math.abs(distanceX) / Math.abs(distanceY));
		if (distanceY > 0 && distanceX > 0) {
			theta = (Math.PI - theta) * 57.3;
		} else if (distanceY > 0 && distanceX < 0) {
			theta = (Math.PI + theta) * 57.3;
		} else if (distanceY < 0 && distanceX > 0) {
			theta = theta * 57.3;
		} else if (distanceY < 0 && distanceX < 0) {
			theta = ((2 * Math.PI) - theta) * 57.3;
		}

		let horizontal = 'none';
		if (Math.abs(distanceX) >= minDistance) {
			if (theta > 205 && theta < 335) {
				horizontal = 'left';
			} else if (theta > 25 && theta < 155) {
				horizontal = 'right';
			}
		}

		let vertical = 'none';
		if (Math.abs(distanceY) >= minDistance) {
			if (theta > 295 || theta < 65) {
				vertical = 'up';
			} else if (theta > 115 && theta < 245) {
				vertical = 'down';
			}
		}

		node.dispatchEvent(new CustomEvent('d2l-swipe', {
			detail: {
				distance: {
					x: distanceX,
					y: distanceY
				},
				direction: {
					angle: theta,
					horizontal: horizontal,
					vertical: vertical
				},
				duration: elapsedTime
			}
		}));

		reset();
	};

	const handleTouchMove = (e) => {
		if (!tracking) {
			return;
		}
		e.preventDefault();
		tracking.end = {
			x: e.touches[0].clientX,
			y: e.touches[0].clientY
		};
	};

	node.addEventListener('touchend', handleTouchEnd);
	node.addEventListener('touchmove', handleTouchMove);
	node.addEventListener('touchcancel', handleTouchCancel);

}
