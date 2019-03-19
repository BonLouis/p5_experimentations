const AMOUNT = 500;
let particles = [];

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
	for (let i = 0; i < AMOUNT; i++) {
		particles.push(new Particle());
	}
}

function draw () {
	background(255, 255, 255, 100);
	for (const particle of particles) {
		particle.draw();
		particle.update();
	}
}

class Particle {
	constructor (x, y) {
		this.position = createVector(CENTER.x, CENTER.y);
		// this.position = createVector(random(0, WIDTH), random(0, HEIGHT));
		this.velocity = p5.Vector.random2D().mult(1);
		this.choc = { x: false, y: false };
	}
	update () {
		this.guard();
		this.position.add(this.velocity);
	}
	draw () {
		ellipse(this.position.x, this.position.y, 2);
	}
	guard () {
		if (this.position.x > WIDTH || this.position.x < 0) {
			if (this.choc.x) {
				this.velocity.x *= -1;
			} else {
				this.position.x = WIDTH / 2;
				this.position.y = HEIGHT / 2;
				this.choc.x = true;
				this.choc.y = true;
			}
		}
		if (this.position.y > HEIGHT || this.position.y < 0) {
			if (this.choc.y) {
				this.velocity.y *= -1;
			} else {
				this.position.x = WIDTH / 2;
				this.position.y = HEIGHT / 2;
				this.choc.x = true;
				this.choc.y = true;
			}
		}
	}
}
