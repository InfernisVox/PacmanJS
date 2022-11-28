import MovingDirection from "./directions.js";

export default class Player {
	constructor(x, y, tileSize, velocity, map) {
		this.x = x;
		this.y = y;
		this.tileSize = tileSize;
		this.velocity = velocity;
		this.map = map;

		this.currentDirection = null;
		this.nextDirection = null;
		this.playerrotation = null;

		this.animationtimer = null;
		this.animationtimermax = 2;

		this.firstmove = false;
		this.timers = [];

		document.addEventListener("keydown", this.#keydown);

		this.playerimage1 = new Image();
		this.playerimage1.src = "js/Pacman/assets/player1.png";

		this.playerimage2 = new Image();
		this.playerimage2.src = "js/Pacman/assets/player2.png";

		this.playerimage3 = new Image();
		this.playerimage3.src = "js/Pacman/assets/player3.png";

		this.playerimage4 = new Image();
		this.playerimage4.src = "js/Pacman/assets/player4.png";

		this.playerimage5 = new Image();
		this.playerimage5.src = "js/Pacman/assets/player5.png";

		this.playerimage6 = new Image();
		this.playerimage6.src = "js/Pacman/assets/player6.png";

		this.playerimage7 = new Image();
		this.playerimage7.src = "js/Pacman/assets/player7.png";

		this.playerimage8 = new Image();
		this.playerimage8.src = "js/Pacman/assets/player8.png";

		this.walkingsound = new Audio("js/Pacman/assets/walk.mp3");
		this.powerupsound = new Audio("js/Pacman/assets/powerup.wav");
		this.eatghostsound = new Audio("js/Pacman/assets/eatghost.wav");
		this.startsound = new Audio("js/Pacman/assets/Start.mp3");
		this.backgroundmusic = new Audio(
			"js/Pacman/assets/backgroundmusic1.mp3"
		);

		this.powerupped = false;
		this.powerupsoongone = false;

		this.playerimages = [
			this.playerimage1,
			this.playerimage2,
			this.playerimage3,
			this.playerimage4,
			this.playerimage5,
			this.playerimage6,
			this.playerimage7,
			this.playerimage8,
			this.playerimage7,
			this.playerimage6,
			this.playerimage5,
			this.playerimage4,
			this.playerimage3,
			this.playerimage2,
		];

		this.playerimageindex = 0;
	}

	draw(ctx, pause, ghosts) {
		if (!pause) {
			this.#move();
			this.#animate();
			this.backgroundmusic.play();
		} else if (!this.firstmove) {
			this.startsound.play();
		}
		if (this.map.eatfood(this.x, this.y)) {
			this.walkingsound.play();
		} else if (this.map.eatpowerup(this.x, this.y)) {
			this.powerupsound.play();
			this.powerupped = true;
			this.powerupsoongone = false;
			this.timers.forEach((timer) => clearTimeout(timer));
			this.timers = [];

			let powertimer = setTimeout(() => {
				this.powerupped = false;
				this.powerupsoongone = false;
			}, 1000 * 5);
			this.timers.push(powertimer);

			let soonexpiredtimer = setTimeout(() => {
				this.powerupsoongone = true;
			}, 1000 * 3);
			this.timers.push(soonexpiredtimer);
		}
		this.#eatghost(ghosts);

		ctx.save();
		ctx.translate(this.x + this.tileSize / 2, this.y + this.tileSize / 2);
		ctx.rotate((this.playerrotation * 90 * Math.PI) / 180);
		ctx.drawImage(
			this.playerimages[this.playerimageindex],
			-(this.tileSize / 2),
			-(this.tileSize / 2),
			this.tileSize,
			this.tileSize
		);
		ctx.restore();
	}

	#keydown = (event) => {
		switch (event.keyCode) {
			case 38:
				if (this.currentDirection == MovingDirection.down) {
					this.currentDirection = MovingDirection.up;
				}
				this.nextDirection = MovingDirection.up;
				this.firstmove = true;
				break;

			case 40:
				if (this.currentDirection == MovingDirection.up) {
					this.currentDirection = MovingDirection.down;
				}
				this.nextDirection = MovingDirection.down;
				this.firstmove = true;
				break;

			case 39:
				if (this.currentDirection == MovingDirection.left) {
					this.currentDirection = MovingDirection.right;
				}
				this.nextDirection = MovingDirection.right;
				this.firstmove = true;
				break;

			case 37:
				if (this.currentDirection == MovingDirection.right) {
					this.currentDirection = MovingDirection.left;
				}
				this.nextDirection = MovingDirection.left;
				this.firstmove = true;
				break;
		}
	};

	#move() {
		if (this.currentDirection !== this.nextDirection) {
			if (
				Number.isInteger(this.x / this.tileSize) &&
				Number.isInteger(this.y / this.tileSize)
			) {
				if (!this.map.hascollided(this.x, this.y, this.nextDirection)) {
					this.currentDirection = this.nextDirection;
				}
			}
		}

		if (!this.map.hascollided(this.x, this.y, this.currentDirection)) {
			switch (this.currentDirection) {
				case MovingDirection.up:
					this.y -= this.velocity;
					this.playerrotation = MovingDirection.right;
					break;

				case MovingDirection.down:
					this.y += this.velocity;
					this.playerrotation = MovingDirection.down;
					break;

				case MovingDirection.right:
					this.x += this.velocity;
					this.playerrotation = MovingDirection.up;
					break;

				case MovingDirection.left:
					this.x -= this.velocity;
					this.playerrotation = MovingDirection.left;
					break;
			}
		}

		if (this.map.hascollided(this.x, this.y, this.currentDirection)) {
			this.animationtimer = null;
		} else if (
			this.currentDirection != null &&
			this.animationtimer == null
		) {
			this.animationtimer = 0;
		}
	}

	#animate() {
		if (this.animationtimer == null) {
			return;
		}

		this.animationtimer++;
		if (this.animationtimer >= this.animationtimermax) {
			this.animationtimer = 0;
			this.playerimageindex++;
			if (this.playerimageindex >= this.playerimages.length) {
				this.playerimageindex = 0;
			}
		}
	}

	#eatghost(ghosts) {
		if (this.powerupped) {
			const collidewithghost = ghosts.filter((ghost) =>
				ghost.checkCollision(this)
			);
			collidewithghost.forEach((ghost) => {
				ghosts.splice(ghosts.indexOf(ghost), 1);
				this.eatghostsound.play();
			});
		}
	}
}
