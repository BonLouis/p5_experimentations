const AMOUNT = 500;
let P;

let WIDTH;
let HEIGHT;
let CENTER = {};

function setup () {
	WIDTH = 500;// windowWidth;
	HEIGHT = 500;// windowHeight;
	CENTER = createVector(WIDTH / 2, HEIGHT / 2);
	createCanvas(WIDTH, HEIGHT);
	noStroke();
	fill(100);
	P = new PS(1);
}

function draw () {
	background(255, 255, 255, 10);
	P.draw();
	P.update();
	P.guard();
}

class PS {
	constructor (n) {
		this.particles = [];
		for (let i = 0; i < n; i++) {
			this.particles.push(new Particle())
		}
	}
	update () { this.particles.map(x => x.update()); }
	draw () { this.particles.map(x => x.draw()); }
	guard () { this.particles.map(x => x.guard()); }
}
class Particle {
	constructor (x = 0, y = 0) {
		this.position = createVector(random(0, WIDTH), random(0, HEIGHT));
		// this.acceleration = createVector(0, 1)
		this.acceleration = createVector(random(0, 2) - 1, random(0, 2) - 1)
		this.velocity = createVector(0, 0);
		this.guardMode = 'bounce';
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
		ellipse(this.position.x, this.position.y, 20);
	}
	guard () {
		switch(this.guardMode) {
			case 'bounce':
				if (this.position.x > WIDTH || this.position.x < 0) {
					if (this.position.x > WIDTH) {
						this.position.x = WIDTH;
					} else {
						this.position.x = 0;
					}
					this.velocity.x *= -1;
				}
				if (this.position.y > HEIGHT || this.position.y < 0) {
					this.velocity.y *= -1;
					if (this.position.y > HEIGHT) {
						this.position.y = HEIGHT;
					} else {
						this.position.y = 0;
					}
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
