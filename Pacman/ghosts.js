import MovingDirection from "./directions.js";

export default class Ghost {
	constructor(x, y, tileSize, velocity, map) {
		let ghostimagelist = [
			"js/Pacman/assets/green.png",
			"js/Pacman/assets/orange.png",
			"js/Pacman/assets/pink.png",
			"js/Pacman/assets/yellow.png",
			"js/Pacman/assets/blue.png",
			"js/Pacman/assets/purple.png",
			"js/Pacman/assets/red.png",
			"js/Pacman/assets/green2.png",
			"js/Pacman/assets/scary.png",
		];

		this.x = x;
		this.y = y;
		this.tileSize = tileSize;
		this.velocity = velocity;
		this.map = map;

		this.ghost = new Image();
		this.ghost.src =
			ghostimagelist[Math.floor(Math.random() * ghostimagelist.length)];

		this.scaredghost = new Image();
		this.scaredghost.src = "js/Pacman/assets/scared.png";

		this.scaredghost2 = new Image();
		this.scaredghost2.src = "js/Pacman/assets/scared2.png";

		this.ghostimage = this.ghost;

		this.movedir = Math.floor(Math.random() * 4);

		this.timerdefault = this.#random(3, 15);
		this.timer = this.timerdefault;

		this.scaredgonesoontimerdefault = 10;
		this.scaredgonesoontimer = this.scaredgonesoontimerdefault;
	}

	#random(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	checkCollision(player) {
		const size = this.tileSize / 2;
		if (
			this.x < player.x + size &&
			this.x + size > player.x &&
			this.y < player.y + size &&
			this.y + size > player.y
		) {
			return true;
		}
		return false;
	}

	draw(ctx, pause, player) {
		if (!pause) {
			this.#move();
			this.#changeDirection();
		}

		if (player.powerupped) {
			if (player.powerupsoongone) {
				this.scaredgonesoontimer--;
				if (this.scaredgonesoontimer == 0) {
					this.scaredgonesoontimer = this.scaredgonesoontimerdefault;
					if (this.ghostimage == this.scaredghost) {
						this.ghostimage = this.scaredghost2;
					} else {
						this.ghostimage = this.scaredghost;
					}
				}
			} else {
				this.ghostimage = this.scaredghost;
			}
		} else {
			this.ghostimage = this.ghost;
		}
		ctx.drawImage(
			this.ghostimage,
			this.x,
			this.y,
			this.tileSize,
			this.tileSize
		);
	}

	#move() {
		if (!this.map.hascollided(this.x, this.y, this.movedir)) {
			switch (this.movedir) {
				case MovingDirection.up:
					this.y -= this.velocity;
					break;
				case MovingDirection.down:
					this.y += this.velocity;
					break;
				case MovingDirection.left:
					this.x -= this.velocity;
					break;
				case MovingDirection.right:
					this.x += this.velocity;
					break;
			}
		}
	}

	#changeDirection() {
		this.timer--;
		let newMoveDirection = null;
		if (this.timer == 0) {
			this.timer = this.timerdefault;
			newMoveDirection = Math.floor(
				Math.random() * Object.keys(MovingDirection).length
			);
		}

		if (
			newMoveDirection != null &&
			this.movingDirection != newMoveDirection
		) {
			if (
				Number.isInteger(this.x / this.tileSize) &&
				Number.isInteger(this.y / this.tileSize)
			) {
				if (!this.map.hascollided(this.x, this.y, newMoveDirection)) {
					this.movedir = newMoveDirection;
				}
			}
		}
	}
}
