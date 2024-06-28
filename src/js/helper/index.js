import { isTouchDevice } from "../helper/viewport";

const lerp = (a, b, t = 0.08) => {
    return a + (b - a) * t;
}

const parseRem = (input) => {
    return input / 10 * parseFloat($('html').css('font-size'));
}

const xSetter = (el) => gsap.quickSetter(el, 'x', `px`);
const ySetter = (el) => gsap.quickSetter(el, 'y', `px`);
const scaleXSetter = (el) => gsap.quickSetter(el, 'scaleX');
const scaleYSetter = (el) => gsap.quickSetter(el, 'scaleY');
const rotZSetter = (el) => gsap.quickSetter(el, 'rotateZ', `deg`);
const opacitySetter = (el) => gsap.quickSetter(el, 'opacity', ``);


const xGetter = (el) => gsap.getProperty(el, 'x');
const yGetter = (el) => gsap.getProperty(el, 'y');
const scaleXGetter = (el) => gsap.getProperty(el, 'scaleX');
const scaleYGetter = (el) => gsap.getProperty(el, 'scaleY');
const rotZGetter = (el) => gsap.getProperty(el, 'rotateZ')
const opacityGetter = (el) => gsap.getProperty(el, 'opacity')


const selector = (parent) => {
    return (child) => $(parent).find(child);
}

let typeOpts = {
    lines: { type: 'lines', linesClass: 'g-lines'},
    words: { type: 'words,lines', linesClass: 'g-lines'},
    chars: { type: 'chars,words,lines', linesClass: 'g-lines'}
};

let pointer = { x: $(window).width() / 2, y: $(window).height() / 2 };
$(window).on('pointermove', function (e) {
    pointer.x = e.clientX;
    pointer.y = e.clientY;
    if ($('.cursor-wrap').hasClass('on-hidden') && !isTouchDevice() && $(window).width() > 991) {
        $('.cursor-wrap').removeClass('on-hidden')
    }
})

const pointerCurr = () => {
    return pointer
}

const inView = (el) => {
	if (0 <= el.getBoundingClientRect().bottom && el.getBoundingClientRect().top <= $(window).height()) {
		return true
	}
}
function debounce(func, delay = 100){
    let timer;
    return function(event) {
        if (timer) clearTimeout(timer);
        timer = setTimeout(func, delay, event);
    };
}
const findClosestEdge = (ev, el) => {
    if (!el) return;

    const wrapperRect = el.getBoundingClientRect();
    const x = ev.clientX - wrapperRect.left;
    const y = ev.clientY - wrapperRect.top;

    return closestEdge(x,y, el.clientWidth, el.clientHeight);
}
const closestEdge = (x,y,w,h) => {
    const topEdgeDist = distMetric(x,y,w/2,0);
    const bottomEdgeDist = distMetric(x,y,w/2,h);
    const min = Math.min(topEdgeDist, bottomEdgeDist);
    return min === topEdgeDist ? 'top' : 'bottom';
}
const distMetric = (x,y,x2,y2) => {
    var xDiff = x - x2;
    var yDiff = y - y2;
    return (xDiff * xDiff) + (yDiff * yDiff);
}

class FloatingAnimation {
	constructor(target, x, y, angle, duration) {
		this.target = $(target);
		this.x = x || 50;
		this.y = y || 50;
		this.angle = angle || 15;
		this.duration = duration || 10;

		this.randomX = this.random(this.x * 0.1, this.x);
		this.randomY = this.random(this.y * 0.1, this.y);
		this.randomAngle = this.random(this.angle * 0.1, this.angle);
		this.randomMoveTime = this.random(this.duration * 0.5, this.duration);
		this.randomRotateTime = this.random(this.duration, this.duration * 2);

		gsap.set(this.target, {transformOrigin: "center center"});

		this.moveX(this.target, Math.random() < 0.5 ? 1 : -1);
		this.moveY(this.target, Math.random() < 0.5 ? 1 : -1);
		this.rotate(this.target, Math.random() < 0.5 ? 1 : -1);
	}

	random(min, max) {
		return (direction = 1) => (max - Math.random() * (max - min)) * direction;
	}

	moveX(selector, direction) {
		gsap.to(selector, {
			duration: this.random(this.duration * 0.5, this.duration),
			x: this.random(this.x * 0.1, this.x),
			ease: 'sine.inOut',
			onComplete: this.moveX.bind(this),
			onCompleteParams: [selector, direction * -1],
		});
	}

	moveY(selector, direction) {
		gsap.to(selector, {
			duration: this.random(this.y * 0.1, this.y),
			y: this.random(this.y * 0.1, this.y),
			ease: 'sine.inOut',
			onComplete: this.moveY.bind(this),
			onCompleteParams: [selector, direction * -1],
		});
	}

	rotate(selector, direction) {
		gsap.to(selector, {
			duration: this.random(this.x * 0.1, this.x),
			rotation: this.random(this.angle * 0.1, this.angle),
			ease: 'sine.inOut',
			onComplete: this.rotate.bind(this),
			onCompleteParams: [selector, direction * -1],
		});
	}
}

export {
    lerp,
    parseRem,
    xSetter,
    ySetter,
	scaleXSetter,
	scaleYSetter,
    rotZSetter,
	opacitySetter,
    xGetter,
    yGetter,
	scaleXGetter,
	scaleYGetter,
	opacityGetter,
    selector,
    rotZGetter,
    typeOpts,
    pointerCurr,
    findClosestEdge,
    closestEdge,
    distMetric,
    FloatingAnimation,
    debounce,
	inView,
}
