const AMOUNT = 500;
let P;

let WIDTH;
let HEIGHT;
let CENTER = {};
let wind;
let gravity;

function setup () {
	WIDTH = 500;// windowWidth;
	HEIGHT = 500;// windowHeight;
	CENTER = createVector(WIDTH / 2, HEIGHT / 2);
	createCanvas(WIDTH, HEIGHT);
	noStroke();
	fill(100);
	P = new PS(1, 100, HEIGHT / 2);
	wind = createVector(0.0001, 0);
	gravity = createVector(0, 0.01);
	setInterval(() => {
		P.createOne();
	}, 10);
}
function draw () {
	background(255, 255, 255);
	P.draw();
	P.update();
	P.guard();
}

class PS {
	constructor (n, x = 0, y = 0) {
		this.position = createVector(x, y);
		this.particles = [];
		for (let i = 0; i < n; i++) {
			this.particles.push(
				new Particle(this.position.x, this.position.y)
			)
			setTimeout(() => this.particles.shift(), 1000);
		}
	}
	createOne () {
		this.particles.push(
			new Particle(this.position.x, this.position.y)
		)
		setTimeout(() => this.particles.shift(), 1000);
	}
	update () { this.particles.map(x => x.update()); }
	draw () { this.particles.map(x => x.draw()); }
	guard () { this.particles.map(x => x.guard()); }
	apply (force) { this.particles.map(x => x.apply(force)); }
}
class Particle {
	constructor (x = 0, y = 0) {
		this.position = createVector(x, y);
		// this.acceleration = createVector(0, 1)
		this.acceleration = createVector(0, 0);
		this.velocity = createVector(random(4, 6), random(-1, 1));
		this.guardMode = 'bounce';
		this.radius = 5;
		this.grey = 0;
		// this.grey = random(50, 205);
		this.alive = 100;
		// this.color = {
		// 	r: random(0, 255),
		// 	g: random(0, 255),
		// 	b: random(0, 255)
		// };
	}
	update (WIDTH, HEIGHT) {
		this.velocity.add(this.acceleration);
		this.position.add(this.velocity);
		this.alive--;
		// this.velocity = createVector(0,0)
	}
	draw () {
		fill(this.grey, this.grey, this.grey, this.alive);
		// fill(this.color.r, this.color.g, this.color.b);
		ellipse(this.position.x, this.position.y, this.radius * 2);
	}
	apply (force) {
		this.acceleration.add(force);
	}
	guard () {
		switch(this.guardMode) {
			case 'bounce':
				if ((this.position.x + this.radius) > WIDTH || (this.position.x - this.radius) < 0) {
					if ((this.position.x + this.radius) > WIDTH) {
						this.position.x = WIDTH - this.radius;
					} else {
						this.position.x = this.radius;
					}
					this.velocity.x *= -1;
				}
				if ((this.position.y + this.radius) > HEIGHT || (this.position.y - this.radius) < 0) {
					if ((this.position.y + this.radius) > HEIGHT) {
						this.position.y = HEIGHT - this.radius;
					} else {
						this.position.y = this.radius;
					}
					this.velocity.y *= -1;
				}
				break;
			default:
				if (this.position.x > WIDTH || this.position.x < 0) {
						this.position.x = WIDTH / 2;
				}
				if (this.position.y > HEIGHT || this.position.y < 0) {
						this.position.y = HEIGHT / 2;
				}
				break;
		}
	}
}
