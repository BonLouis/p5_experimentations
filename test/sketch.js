const AMOUNT = 500;
let P;

let WIDTH;
let HEIGHT;
let CENTER = {};
let wind;
let gravity;

function setup () {
	WIDTH = windowWidth;
	HEIGHT = windowHeight;
	CENTER = createVector(WIDTH / 2, HEIGHT / 2);
	createCanvas(WIDTH, HEIGHT);
	noStroke();
	fill(100);
	P = new PS(0, CENTER.x, CENTER.y);
	wind = createVector(0.0001, 0);
	gravity = createVector(0, 0.01);
}
function draw () {
	background(255, 255, 255);
	if (P.length() < 20) {
		P.createOne()
	}
	P.be();
}
function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}
function mouseDragged () {
	P.changeDirection(createVector(mouseX, mouseY));
}
class PS {
	constructor (n, x = 0, y = 0) {
		this.speed = 2;
		this.position = createVector(x, y);
		this.direction = {};
		this.changeDirection();
		this.particles = [];
		for (let i = 0; i < n; i++) {
			this.particles.push(
				new Particle(this.position.x, this.position.y, this.direction)
			)
		}
	}
	createOne () {
		this.particles.push(
			new Particle(this.position.x, this.position.y, this.direction)
		)
	}
	length () {
		return this.particles.length;
	}
	be () {
		this.draw();
		this.update();
		this.checkEdges();
		this.recycle();
	}
	ecoRecycle () {
		this.particles.map(x => {
			if (x.isDead()) {
				x.respawn();
			}
		})
	}
	recycle () {
		this.particles.map((x, i) => {
			if (x.isDead()) {
				this.particles.splice(i, 1);
				this.createOne();
			}
		})
	}
	update () { this.particles.map(x => x.update()); }
	draw () { this.particles.map(x => x.draw()); }
	checkEdges () { this.particles.map(x => x.checkEdges()); }
	apply (force) { this.particles.map(x => x.apply(force)); }
	changeDirection (newDir) {
		if (newDir)
			this.direction = p5.Vector.sub(newDir, createVector(1, 1)).normalize().mult(this.speed);
		else
			this.direction = p5.Vector.sub(this.position, createVector(1, 1)).normalize().mult(this.speed);
	}
}
class Particle {
	constructor (x = 0, y = 0, direction) {
		this.position = createVector(x, y);
		// this.acceleration = createVector(0, 1)
		this.acceleration = createVector(0, 0);
		this.velocity = direction;
		this.edgesMode = 'bounce';
		this.radius = 10;
		this.grey = 0;
		this.alive = 255;
		this.spawnArgs = { position: createVector(x, y), alive: this.alive };
		this.color = {
			r: random(0, 255),
			g: random(0, 255),
			b: random(0, 255)
		};
	}
	update (WIDTH, HEIGHT) {
		this.velocity.add(this.acceleration);
		this.position.add(this.velocity);
		this.alive -= 5;
		// this.velocity = createVector(0,0)
	}
	isDead () {
		return this.alive <= 0;
	}
	respawn () {
		this.position.x = this.spawnArgs.position.x;
		this.position.y = this.spawnArgs.position.y;
		this.alive = this.spawnArgs.alive;
		this.acceleration = createVector(0, 0);
		// this.velocity = createVector(random(4, 6), random(-1, 1));
	}
	draw () {
		fill(this.grey, this.grey, this.grey, this.alive);
		// fill(this.color.r, this.color.g, this.color.b);
		ellipse(this.position.x, this.position.y, this.radius * 2);
	}
	apply (force) {
		this.acceleration.add(force);
	}
	checkEdges () {
		switch(this.edgesMode) {
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
