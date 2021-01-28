let vh, vw;
let ticking = false;

function requestTick() {
	if (!ticking) {
		requestAnimationFrame(update);
	}
	ticking = true;
}

function update() {
	ticking = false;
	document.documentElement.style.setProperty('--d2l-vh', `${vh}px`);
	document.documentElement.style.setProperty('--d2l-vw', `${vw}px`);
}

function onResize() {
	vh = window.innerHeight * 0.01;
	vw = window.innerWidth * 0.01;
	requestTick();
}

let installed = false;
if (!installed) {
	installed = true;
	window.addEventListener('resize', onResize);
}
onResize();
