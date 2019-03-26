class Particle {
	constructor (x, y) {
		this.position = createVector(CENTER.x, CENTER.y);
		// this.position = createVector(random(0, WIDTH), random(0, HEIGHT));
		this.velocity = p5.Vector.random2D().mult(1);
		this.choc = { x: false, y: false };
	}
	update (WIDTH, HEIGHT) {
		this.guard(WIDTH, HEIGHT);
		this.position.add(this.velocity);
	}
	draw () {
		ellipse(this.position.x, this.position.y, 2);
	}
	guard (WIDTH, HEIGHT) {
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
