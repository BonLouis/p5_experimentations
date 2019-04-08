/* eslint no-undef: 0 */

const WALLKICK_CHART_JLSTZ = {
	'0->1': [[0, 0], [-1, 0], [-1, -1], [0, 2], [-1, 2]],
	'1->0': [[0, 0], [1, 0], [1, 1], [0, -2], [1, -2]],
	'1->2': [[0, 0], [1, 0], [1, 1], [0, -2], [1, -2]],
	'2->1': [[0, 0], [-1, 0], [-1, -1], [0, 2], [-1, 2]],
	'2->3': [[0, 0], [1, 0], [1, -1], [0, 2], [1, 2]],
	'3->2': [[0, 0], [-1, 0], [-1, 1], [0, -2], [-1, -2]],
	'3->0': [[0, 0], [-1, 0], [-1, 1], [0, -2], [-1, -2]],
	'0->3': [[0, 0], [1, 0], [1, -1], [0, 2], [1, 2]]
};
const WALLKICK_CHART_I = {
	'0->1': [[0, 0], [-2, 0], [1, 0], [-2, 1], [1, -2]],
	'1->0': [[0, 0], [2, 0], [-1, 0], [2, -1], [-1, 2]],
	'1->2': [[0, 0], [-1, 0], [2, 0], [-1, -2], [2, 1]],
	'2->1': [[0, 0], [1, 0], [-2, 0], [1, 2], [-2, -1]],
	'2->3': [[0, 0], [2, 0], [-1, 0], [2, -1], [-1, 2]],
	'3->2': [[0, 0], [-2, 0], [1, 0], [-2, 1], [1, -2]],
	'3->0': [[0, 0], [1, 0], [-2, 0], [1, 2], [-2, -1]],
	'0->3': [[0, 0], [-1, 0], [2, 0], [-1, -2], [2, 1]]

};

class Tetromino {
	constructor (squares, r, g, b, doTick = true) {
		this.speed = 1000;
		this.tickID = 0;
		if (doTick) {
			this.tick();
		}
		this.alive = true;
		this.rot = 0;
		this.sq = squares;
		this.pos = [3, 0];
		this.height = 2;
		this.width = 2;
		this.color = [r, g, b];
		this.debug = false;
		this.wallKickChart = WALLKICK_CHART_JLSTZ;
	}
	tick () {
		this.tickID = setInterval(() => {
			console.log('tick');
			if (this.willCollideY()) {
				this.kill();
			} else {
				this.pos[1]++;
			}
		}, this.speed);
	}
	disableTick () {
		console.log('unticking');
		clearInterval(this.tickID);
	}
	someSquares (cb) {
		return this.sq[this.rot].some(cb);
	}
	isColliding () {
		return this.someSquares(sq => {
			if (this.pos[0] + sq[0] < 0 || this.pos[0] + sq[0] >= cols) {
				return true;
			}
			return this.getNeighbors().some(n => {
				return n.someSquares(nSq => {
					return (
						this.pos[0] + sq[0] === n.pos[0] + nSq[0] &&
						this.pos[1] + sq[1] === n.pos[1] + nSq[1]
					);
				});
			});
		});
	}
	getNeighbors () {
		return deadPieces.filter(d => {
			let leftBound = (this.pos[0] - d.pos[0]) <= 3;
			let topBound = (this.pos[1] - d.pos[1]) <= 3;

			let rightBound = (d.pos[0] - this.pos[0]) <= 3;
			let bottomBound = (d.pos[1] - this.pos[1]) <= 3;

			return leftBound && topBound && rightBound && bottomBound;
		});
	}
	willCollideY () {
		return this.someSquares(sq => {
			const tRealX = this.pos[0] + sq[0];
			const tRealY = this.pos[1] + sq[1];
			if (tRealY + 1 === rows) {
				return true;
			}
			return deadPieces.some(dP => {
				return dP.someSquares(dSq => {
					const dRealX = dP.pos[0] + dSq[0];
					const dRealY = dP.pos[1] + dSq[1];
					return (
						dRealX === tRealX && // dont check if not on same X
						dRealY === tRealY + 1 // check next pos Y
					);
				});
			});
		});
	}
	willCollideX (n) {
		return this.someSquares(sq => {
			const tRealX = this.pos[0] + sq[0];
			const tRealY = this.pos[1] + sq[1];
			if (tRealX + n === cols || tRealX + n === -1) {
				return true;
			}
			return deadPieces.some(dP => {
				return dP.someSquares(dSq => {
					const dRealX = dP.pos[0] + dSq[0];
					const dRealY = dP.pos[1] + dSq[1];
					return (
						dRealY === tRealY &&
						dRealX === tRealX + n
					);
				});
			});
		});
	}
	isDead () { return !this.alive; }
	setX (n) {
		if (!this.willCollideX(n)) {
			this.pos[0] += n;
		}
		return this;
	}
	setY (n) {
		if (!this.willCollideY()) {
			this.pos[1]++;
		}
		return this;
	}
	putDown () {
		while (!this.willCollideY()) { this.pos[1]++; }
		this.kill();
		return this;
	}
	kill () {
		this.disableTick();
		this.alive = false;
		return this;
	}
	wallKick (key) {
		const prevPos = [...this.pos];
		for (let i = 0, ln = this.wallKickChart[key].length; i < ln; i++) {
			let toTry = this.wallKickChart[key][i];
			this.pos[0] += toTry[0];
			this.pos[1] += toTry[1];
			if (this.isColliding()) {
				continue;
			} else {
				return true;
			}
		}
		this.pos[0] = prevPos[0];
		this.pos[1] = prevPos[1];
		return false;
	}
	rotate (n) {
		const prevRot = this.rot;
		if (this.sq.length > 1) {
			this.rot += n;
		}
		if (this.rot === this.sq.length) {
			this.rot = 0;
		} else if (this.rot < 0) {
			this.rot = this.sq.length - 1;
		}
		// Wall kick if required
		if (this.isColliding()) {
			if (!this.wallKick(`${prevRot}->${this.rot}`)) {
				// Rotation has failed
				this.rot = prevRot;
			}
		}
		return this;
	}
	draw () {
		if (this.debug) {
			fill(255, 20);
			noStroke();
			square(
				GRID.pos[0] + (GRID.uSize * this.pos[0]),
				GRID.pos[1] + (GRID.uSize * this.pos[1]),
				GRID.uSize * 4
			);
		}
		fill(...this.color);
		stroke(255);
		// stroke(...this.color);
		this.sq[this.rot].map(sq => {
			square(
				GRID.pos[0] + (GRID.uSize * (sq[0] + this.pos[0])),
				GRID.pos[1] + (GRID.uSize * (sq[1] + this.pos[1])),
				GRID.uSize

			);
		});
	}
}
class I extends Tetromino {
	constructor (x = 3, y = 0) {
		super([
			[[0, 1], [1, 1], [2, 1], [3, 1]],
			[[2, 0], [2, 1], [2, 2], [2, 3]],
			[[0, 2], [1, 2], [2, 2], [3, 2]],
			[[1, 0], [1, 1], [1, 2], [1, 3]]
		],
		8, 150, 167);
		this.pos[0] = x;
		this.pos[1] = y;
		this.wallKickChart = WALLKICK_CHART_I;
	}
}
class O extends Tetromino {
	constructor (x = 3, y = 0) {
		super([
			[[1, 0], [2, 0], [1, 1], [2, 1]]
		],
		255, 210, 63);
		this.pos[0] = x;
		this.pos[1] = y;
	}
}
class T extends Tetromino {
	constructor (x = 3, y = 0) {
		super([
			[[0, 1], [1, 1], [2, 1], [1, 0]],
			[[1, 0], [1, 1], [1, 2], [2, 1]],
			[[0, 1], [1, 1], [2, 1], [1, 2]],
			[[1, 0], [1, 1], [1, 2], [0, 1]]
		],
		84, 13, 110);
		this.pos[0] = x;
		this.pos[1] = y;
	}
}
class L extends Tetromino {
	constructor (x = 3, y = 0) {
		super([
			[[0, 1], [1, 1], [2, 1], [2, 0]],
			[[1, 0], [1, 1], [1, 2], [2, 2]],
			[[0, 2], [0, 1], [1, 1], [2, 1]],
			[[0, 0], [1, 0], [1, 1], [1, 2]]
		],
		255, 92, 0);
		this.pos[0] = x;
		this.pos[1] = y;
	}
}
class J extends Tetromino {
	constructor (x = 3, y = 0) {
		super([
			[[0, 0], [0, 1], [1, 1], [2, 1]],
			[[2, 0], [1, 0], [1, 1], [1, 2]],
			[[0, 1], [1, 1], [2, 1], [2, 2]],
			[[1, 0], [1, 1], [1, 2], [0, 2]]
		],
		8, 80, 167);
		this.pos[0] = x;
		this.pos[1] = y;
	}
}
class Z extends Tetromino {
	constructor (x = 3, y = 0) {
		super([
			[[0, 0], [1, 0], [1, 1], [2, 1]],
			[[2, 0], [2, 1], [1, 1], [1, 2]],
			[[0, 1], [1, 1], [1, 2], [2, 2]],
			[[1, 0], [1, 1], [0, 1], [0, 2]]
		],
		238, 66, 102);
		this.pos[0] = x;
		this.pos[1] = y;
	}
}
class S extends Tetromino {
	constructor (x = 3, y = 0) {
		super([
			[[0, 1], [1, 1], [1, 0], [2, 0]],
			[[1, 0], [1, 1], [2, 1], [2, 2]],
			[[0, 2], [1, 2], [1, 1], [2, 1]],
			[[0, 0], [0, 1], [1, 1], [1, 2]]
		],
		14, 173, 105);
		this.pos[0] = x;
		this.pos[1] = y;
	}
}
