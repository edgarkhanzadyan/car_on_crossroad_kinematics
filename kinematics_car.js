const runAnimation = () => {
	// convert text inputs to numbers
	const
		_TIME = parseFloat(document.getElementsByClassName('time')[0].value),
		_LENGTH = parseFloat(document.getElementsByClassName('length')[0].value),
		_VELOCITY = parseFloat(document.getElementsByClassName('velocity')[0].value),
		_DISTANCE = parseFloat(document.getElementsByClassName('distance')[0].value),
		_ACCELERATION = parseFloat(document.getElementsByClassName('acceleration')[0].value),
		_DECELERATION = parseFloat(document.getElementsByClassName('deceleration')[0].value);

	// clean up the inputs
	['time', 'length', 'velocity', 'distance', 'acceleration', 'deceleration']
		.forEach((className) => document.getElementsByClassName(className)[0].value = '');

	// check inputs before using them 
	if (
		!isNaN(_VELOCITY) &&
		!isNaN(_DISTANCE) &&
		!isNaN(_LENGTH) &&
		!isNaN(_TIME) &&
		!isNaN(_ACCELERATION) &&
		!isNaN(_DECELERATION)
	) {
		// animation frame instance
		let raf;
		// interval instance
		let intervalId;
		// change animation button to Stop Animation when animation has started
		const animationButton = document.getElementsByClassName('runAnimation')[0];
		animationButton.innerHTML = 'Stop Animation!';
		animationButton.onclick = () => {
			animationButton.innerHTML = 'Run Animation!';
			animationButton.onclick = runAnimation;
			clearInterval(intervalId);
			window.cancelAnimationFrame(raf);
		};
		// clean up WRONG INPUTS sign if it was before
		document.getElementsByClassName('wrongInputs')[0].innerHTML = ""
		// setup a little dashboard
		document.getElementsByClassName('velocityDisplay')[0].innerHTML = _VELOCITY;
		document.getElementsByClassName('distanceDisplay')[0].innerHTML = _DISTANCE;
		document.getElementsByClassName('lengthDisplay')[0].innerHTML = _LENGTH;
		document.getElementsByClassName('timeDisplay')[0].innerHTML = _TIME;
		document.getElementsByClassName('accelerationDisplay')[0].innerHTML = _ACCELERATION;
		document.getElementsByClassName('decelerationDisplay')[0].innerHTML = _DECELERATION;

		// set constants
		const
			MAKE_BIGGER_BY = 10,
			FRAME_MILLISECONDS = 1000 / 60, // 60 frames per second
			TIME = _TIME,
			LENGTH = _LENGTH * MAKE_BIGGER_BY,
			VELOCITY = _VELOCITY * MAKE_BIGGER_BY,
			DISTANCE = _DISTANCE * MAKE_BIGGER_BY,
			CAR_WIDTH = 1 * MAKE_BIGGER_BY,
			CAR_HEIGHT = 1 * MAKE_BIGGER_BY,
			ACCELERATION = _ACCELERATION * MAKE_BIGGER_BY,
			DECELERATION = _DECELERATION * MAKE_BIGGER_BY;

		
		const canvas = document.getElementById('canvas');
		const ctx = canvas.getContext('2d');
		const answer = document.getElementById('answer');
		const time = document.getElementById('time');
		// car object
		const car = {
			millisecondsFromStart: 0,
			x: 0,
			y: 100,
			color: 'blue',
			draw: function() {
				// draw car
				ctx.fillStyle = this.color;
				ctx.fillRect(this.x, this.y, CAR_WIDTH, CAR_HEIGHT);
				// draw first line
				ctx.beginPath();
				ctx.moveTo(CAR_WIDTH + DISTANCE, 0);
				ctx.lineTo(CAR_WIDTH + DISTANCE, 300);
				ctx.stroke();
				// draw second line
				ctx.beginPath();
				ctx.moveTo(CAR_WIDTH + DISTANCE + LENGTH, 0);
				ctx.lineTo(CAR_WIDTH + DISTANCE + LENGTH, 300);
				ctx.stroke();
			}
		};
		// compute the decision if the car should pass or not the crossroad;
		// this computes only once in the beginning
		const computeAnswer = () => {
			// The car is passed if the front of the car has passed the second line in TIME seconds
			const isPassed = VELOCITY * TIME + ((ACCELERATION * (TIME ** 2)) / 2) >= DISTANCE + LENGTH;
			// The car is stopped if it will NEVER pass the first line
			// for that we will solve this quadratic inequality
			// v0 * t - a * t^2 / 2 <= dis
			// a * t^2 / 2 - v0 * t + dis >= 0
			// D = v0^2 - 4 * dis * a / 2 < 0
			// so D should be less than 0 so we can be sure that this inequality has no solution
			// which means that the front of the car will never pass the first line
			// v0 ^ 2 - 2 * dis * a < 0
			const isStopped = VELOCITY ** 2 - 2 * DISTANCE * DECELERATION < 0;
			if (isPassed && isStopped) {
				answer.innerHTML = 'IT CAN BOTH STOP AND PASS';
				return 'stop';
			} else if (isPassed) {
				answer.innerHTML = 'IT CAN ONLY PASS';
				return 'pass';
			}
			else if (isStopped) {
				answer.innerHTML = 'IT CAN ONLY STOP';
				return 'stop';
			} else {
				answer.innerHTML = 'OMG IT\'S GONNA CRUSH';
				return 'stop';
			}
		};
		// what to do: to pass the crossroad or to stop before the first line?
		const decision = computeAnswer();
		// compute position (X) of the car on each frame
		const computeX = (currentTime) => {
			if (decision === 'pass') {
				return VELOCITY * currentTime + ((ACCELERATION * (currentTime ** 2)) / 2);
			} else if (decision === 'stop') {
				return VELOCITY * currentTime - ((DECELERATION * (currentTime ** 2)) / 2);
			}
		};
		// redraw the car and crossroad lines on each frame
		function draw(s) {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			car.x = computeX(car.millisecondsFromStart / 1000);
			car.millisecondsFromStart += FRAME_MILLISECONDS;
			time.innerHTML = `TIME: ${car.millisecondsFromStart / 1000}`
			car.draw();
		}
		// set interval every 1000 / 60 milliseconds so we will get 60 frames per second screen
		intervalId = setInterval(
			() => raf = window.requestAnimationFrame(draw.bind(null, 'hey')),
			FRAME_MILLISECONDS
		);
	} else {
		// show WRONG INPUTS if the inputs were not filled or if the inputs are not numbers
		document.getElementsByClassName('wrongInputs')[0].innerHTML = "!!!!!Wrong Inputs!!!!!"
	}
}
document.getElementsByClassName('runAnimation')[0].onclick = runAnimation;