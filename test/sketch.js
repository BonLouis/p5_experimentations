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
	P = new PS(1);
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
	P.apply(gravity);
}

class PS {
	constructor (n) {
		this.particles = [];
		for (let i = 0; i < n; i++) {
			this.particles.push(
				new Particle(WIDTH / 2, 60)
			)
			setTimeout(() => this.particles.shift(), 2000);
		}
	}
	createOne () {
		this.particles.push(
			new Particle(WIDTH / 2, 60)
		)
		setTimeout(() => this.particles.shift(), 2000);
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
		this.velocity = createVector(random(1, 2), 0);
		this.guardMode = 'bounce';
		this.radius = 5;
		this.color = {
			r: random(0, 255),
			g: random(0, 255),
			b: random(0, 255)
		};
	}
	update (WIDTH, HEIGHT) {
		this.velocity.add(this.acceleration);
		this.position.add(this.velocity);
		// this.velocity = createVector(0,0)
	}
	draw () {
		fill(this.color.r, this.color.g, this.color.b);
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
					this.velocity.x *= -0.5;
				}
				if ((this.position.y + this.radius) > HEIGHT || (this.position.y - this.radius) < 0) {
					if ((this.position.y + this.radius) > HEIGHT) {
						this.position.y = HEIGHT - this.radius;
					} else {
						this.position.y = this.radius;
					}
					this.velocity.y *= -0.5;
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
