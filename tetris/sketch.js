/* eslint no-undef: 0 */
let WIDTH;
let HEIGHT;
let MIDDLE = {};
let UNIT_SIZE = 30;
let MAIN_GRID_SIZE = { x: UNIT_SIZE * 10, y: UNIT_SIZE * 22 };
let MAIN_GRID_POS = {};
let GRID = {};
let cols = 10;
let rows = 22;

let keyIntervalID;
let keyTimeoutID;

let alivePiece;
const deadPieces = [];
const futurePieces = [];

const ALL_TETROS = [ O, I, T, L, J, Z, S ];

const demo = [];
function setup () {
	WIDTH = windowWidth;
	HEIGHT = windowHeight;
	MIDDLE = { x: windowWidth / 2, y: windowHeight / 2 };
	MAIN_GRID_POS = [
		MIDDLE.x - (MAIN_GRID_SIZE.x / 2),
		MIDDLE.y - (MAIN_GRID_SIZE.y / 2)
	];
	GRID = {
		pos: MAIN_GRID_POS,
		uSize: UNIT_SIZE,
		debug: 1
	};
	createCanvas(WIDTH, HEIGHT);
	stroke(20);
	strokeWeight(1);

	// initGame(deadPieces);

	alivePiece = new (randomPiece())();
	// alivePiece = new J(3, 10).rotate(1);
	futurePieces.push(...randomPiece(5));

	// ALL_TETROS.map((x, i) => {
	// 	demo.push((new x(-6, ((i * 2) + 1)).kill()));
	// });
}
let lost = false;
function draw () {
	background(0);
	drawMainGrid();
	if (!lost) {
		if (alivePiece.isDead()) {
			deadPieces.push(alivePiece);
			checkLine();
			alivePiece = new (futurePieces.pop())();
			futurePieces.unshift(randomPiece());
			if (alivePiece.isColliding()) {
				lost = true;
				console.log('Perdu !');
			}
			// alivePiece = 0; // randomPiece();
		}
		alivePiece.draw();
	}
	deadPieces.map(x => x.draw());
	// demo.map(x => x.draw());
}
function randomPiece (n) {
	if (n) {
		const pieces = [];
		while (n) {
			pieces.push(ALL_TETROS[random(0, ALL_TETROS.length) >> 0]);
			n--;
		}
		return pieces;
	} else {
		return ALL_TETROS[random(0, ALL_TETROS.length) >> 0];
	}
}
function initGame (dp) {
	dp.push(
		new I(5, 20),
		new I(0, 20),
		new J(7, 19).rotate(2),
		new I(0, 19),
		new I(5, 18),
		new I(0, 18),
		new J(7, 17).rotate(2),
		new I(0, 17)
	);
	dp.map(x => x.kill());
}
function drawMainGrid () {
	for (let y = 0; y < rows; y++) {
		if (GRID.debug) {
			fill(255);
			noStroke();
			textSize(15);
			text(y, MAIN_GRID_POS[0] - 20, MAIN_GRID_POS[1] + (UNIT_SIZE * y) + 20);
		} else {
			fill(0);
			stroke(50);
		}
		for (let x = 0; x < cols; x++) {
			if (GRID.debug) {
				fill(255);
				noStroke();
				text(x, MAIN_GRID_POS[0] + (UNIT_SIZE * x) + 10, MAIN_GRID_POS[1] + (rows * UNIT_SIZE) + 20);
				fill(0);
				stroke(50);
			}
			square(
				MAIN_GRID_POS[0] + (UNIT_SIZE * x),
				MAIN_GRID_POS[1] + (UNIT_SIZE * y),
				UNIT_SIZE
			);
		}
	}
}
function checkLine () {
	const lastPiece = deadPieces[deadPieces.length - 1];

	const lY = lastPiece.pos[1];
	const rowsToCheck = lastPiece.sq[lastPiece.rot].reduce((acc, el) => {
		if (!acc.includes(el[1] + lY)) {
			acc.push(el[1] + lY);
		}
		return acc;
	}, []);
	const lineFilled = {};
	for (let i = 0, il = rowsToCheck.length; i < il; i++) {
		const y = rowsToCheck[i];
		console.log('checking', y);
		const squareOnLine = [];
		for (let j = 0, jl = deadPieces.length; j < jl; j++) {
			// Dont check too distant pieces
			if (Math.abs(deadPieces[j].pos[1] - y) > 3) {
				// console.log('skip piece check at', deadPieces[j].pos);
				continue;
			} else {
				// console.log('Checking piece at', deadPieces[j].pos);
				for (let k = 0, kl = deadPieces[j].sq[deadPieces[j].rot].length; k < kl; k++) {
					if (deadPieces[j].pos[1] + deadPieces[j].sq[deadPieces[j].rot][k][1] === y) {
						squareOnLine.push(deadPieces[j].sq[deadPieces[j].rot][k]);
						continue;
					}
				}
			}
		}
		if (squareOnLine.length === 10) {
			lineFilled[y] = squareOnLine;
		}
	}
	if (!isEmpty(lineFilled)) {
		// gravity before clear
		lowerDeads(lineFilled);
		for (const y in lineFilled) {
			lineFilled[y].map(sq => {
				// Ca pousse les carrés en bas
				sq[1] = 50;
			});
		}
	}
}
function lowerDeads (linesEmpty) {
	for (const y in linesEmpty) {
		console.log(y);
		deadPieces.map(dP => {
			dP.sq[dP.rot].map(dSq => {
				if (dP.pos[1] + dSq[1] < y) {
					dSq[1] += 1;
				} else {
					// console.log('non', dP.pos[0], dP.pos[1]);
				}
			});
		});
	}
}
function isEmpty (obj) {
	for (var key in obj) {
		if (obj.hasOwnProperty(key)) { return false; }
	}
	return true;
}

const eventsID = {
	timeouts: {
		[LEFT_ARROW]: [],
		[RIGHT_ARROW]: [],
		[DOWN_ARROW]: [],
		[UP_ARROW]: [],
		[CONTROL]: [],
		[SPACE]: []
	},
	intervals: {
		[LEFT_ARROW]: [],
		[RIGHT_ARROW]: [],
		[DOWN_ARROW]: [],
		[UP_ARROW]: [],
		[CONTROL]: [],
		[SPACE]: []
	}
};

// to avoid the double tick on the next piece
let aliveTickIsDisabled = false;
function clearEventsID () {
	for (const id of eventsID.timeouts[keyCode]) { clearTimeout(id); }
	eventsID.timeouts[keyCode] = [];
	for (const id of eventsID.intervals[keyCode]) { clearInterval(id); }
	eventsID.intervals[keyCode] = [];
}
function keyReleased () {
	if (keyCode in CONTROLS) {
		if (aliveTickIsDisabled && keyCode === DOWN_ARROW) {
			alivePiece.tick();
		}
		// A security if multiple events were pushed
		clearEventsID();
		return false; // prevent any default behavior
	}
}
function keyPressed () {
	if (keyCode in CONTROLS) {
		if (keyCode === DOWN_ARROW) {
			if (!alivePiece.willCollideY()) {
				alivePiece.disableTick();
				aliveTickIsDisabled = true;
			}
		}
		// We execute it once,
		CONTROLS[keyCode]();

		// Then we check if the input is still pressed
		// , but we dont want to multiply rotation nor harddrop.
		const dontRedoThose = [UP_ARROW, CONTROL, SPACE];
		if (!dontRedoThose.includes(keyCode)) {
			// In 100ms, we redo action every 100ms...
			// keyCode argument in event is closured in IIFE to avoid events collision.
			eventsID.timeouts[keyCode].push(
				setTimeout(((keyCodeClosured) => () => {
					eventsID.intervals[keyCodeClosured].push(
						setInterval(((deepKeyCodeClosured) => () => {
							// to avoid the double tick on the next piece
							if (alivePiece.willCollideY()) {
								aliveTickIsDisabled = false;
							}
							CONTROLS[deepKeyCodeClosured]();
						})(keyCodeClosured), 100)
					);
				})(keyCode), 100)
			);
		}
	}
}
