import Player from "./players.js";
import MovingDirection from "./directions.js";
import Ghost from "./ghosts.js";

export default class gamefield {
	constructor(tileSize) {
		this.tileSize = tileSize;

		this.eat = new Image();
		this.eat.src = "js/Pacman/assets/eat.png";

		this.wall = new Image();
		this.wall.src = "js/Pacman/assets/wall.png";

		this.powerup1 = new Image();
		this.powerup1.src = "js/Pacman/assets/power1.png";

		this.powerup2 = new Image();
		this.powerup2.src = "js/Pacman/assets/power2.png";

		this.blinkingtimer = 0;
		this.blinkingtimermax = 100;
		this.blinkinglist = [this.powerup1, this.powerup2];
		this.blinkingindex = 0;

		//eat = 0, wall = 1, powerup = 2 startin point = 4, empty = 5, enemy = 6
		this.map = [
			[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
			[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
			[1, 2, 1, 6, 1, 1, 0, 1, 1, 2, 1, 0, 1],
			[1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 6, 1],
			[1, 0, 0, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1],
			[1, 1, 1, 0, 1, 1, 0, 1, 0, 0, 0, 0, 1],
			[1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1],
			[1, 0, 1, 1, 0, 1, 1, 1, 0, 0, 1, 0, 1],
			[1, 0, 0, 0, 0, 1, 2, 1, 1, 0, 0, 0, 1],
			[1, 0, 1, 0, 0, 0, 0, 0, 0, 4, 1, 0, 1],
			[1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1],
			[1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
			[1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1],
			[1, 0, 2, 6, 0, 0, 0, 0, 0, 0, 6, 0, 1],
			[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
		];
		// Debugmap
		// this.map = [
		// 	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
		// 	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 1],
		// 	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
		// ];
	}

	draw(ctx) {
		for (let row = 0; row < this.map.length; row++) {
			for (let col = 0; col < this.map[row].length; col++) {
				if (this.map[row][col] === 1) {
					ctx.drawImage(
						this.wall,
						col * this.tileSize,
						row * this.tileSize,
						this.tileSize,
						this.tileSize
					);
				} else if (this.map[row][col] === 0) {
					ctx.drawImage(
						this.eat,
						col * this.tileSize,
						row * this.tileSize,
						this.tileSize,
						this.tileSize
					);
				} else if (this.map[row][col] === 2) {
					if (this.blinkingtimer == null) {
						return;
					}

					this.blinkingtimer++;
					if (this.blinkingtimer >= this.blinkingtimermax) {
						this.blinkingtimer = 0;
						this.blinkingindex++;
						if (this.blinkingindex >= this.blinkinglist.length) {
							this.blinkingindex = 0;
						}
					}

					ctx.drawImage(
						this.blinkinglist[this.blinkingindex],
						col * this.tileSize,
						row * this.tileSize,
						this.tileSize,
						this.tileSize
					);
				} else {
					ctx.fillStyle = "black";
					ctx.fillRect(
						col * this.tileSize,
						row * this.tileSize,
						this.tileSize,
						this.tileSize
					);
				}
			}

			/*ctx.strokeStyle = "green";
			ctx.strokeRect(
				col * this.tileSize,
				row * this.tileSize,
				this.tileSize,
				this.tileSize
			);*/
		}
	}

	getGhosts(velocity) {
		const ghosts = [];
		for (let row = 0; row < this.map.length; row++) {
			for (let col = 0; col < this.map[row].length; col++) {
				let tile = this.map[row][col];
				if (tile === 6) {
					this.map[row][col] = 0;
					ghosts.push(
						new Ghost(
							col * this.tileSize,
							row * this.tileSize,
							this.tileSize,
							velocity,
							this
						)
					);
				}
			}
		}
		return ghosts;
	}

	getPlayer(velocity) {
		for (let row = 0; row < this.map.length; row++) {
			for (let col = 0; col < this.map[row].length; col++) {
				let tile = this.map[row][col];
				if (tile === 4) {
					this.map[row][col] = 5;
					return new Player(
						col * this.tileSize,
						row * this.tileSize,
						this.tileSize,
						velocity,
						this
					);
				}
			}
		}
	}

	setCanvasSize(canvas) {
		canvas.width = this.tileSize * this.map[0].length;
		canvas.height = this.tileSize * this.map.length;
	}

	hascollided(x, y, direction) {
		if (direction == null) {
			return;
		}

		if (
			Number.isInteger(x / this.tileSize) &&
			Number.isInteger(y / this.tileSize)
		) {
			let column = 0;
			let row = 0;
			let nextColumn = 0;
			let nextRow = 0;

			switch (direction) {
				case MovingDirection.right:
					nextColumn = x + this.tileSize;
					column = nextColumn / this.tileSize;
					row = y / this.tileSize;
					break;
				case MovingDirection.left:
					nextColumn = x - this.tileSize;
					column = nextColumn / this.tileSize;
					row = y / this.tileSize;
					break;
				case MovingDirection.up:
					nextRow = y - this.tileSize;
					row = nextRow / this.tileSize;
					column = x / this.tileSize;
					break;
				case MovingDirection.down:
					nextRow = y + this.tileSize;
					row = nextRow / this.tileSize;
					column = x / this.tileSize;
					break;
			}

			const tile = this.map[row][column];
			if (tile === 1) {
				return true;
			}
		}
		return false;
	}

	eatfood(x, y) {
		let column = x / this.tileSize;
		let row = y / this.tileSize;
		if (Number.isInteger(row) && Number.isInteger(column)) {
			if (this.map[row][column] === 0) {
				this.map[row][column] = 5;
				return true;
			}
		}
	}

	eatpowerup(x, y) {
		let column = x / this.tileSize;
		let row = y / this.tileSize;
		if (Number.isInteger(row) && Number.isInteger(column)) {
			if (this.map[row][column] === 2) {
				this.map[row][column] = 5;
				return true;
			}
		}
		return false;
	}

	didwin() {
		let mapflat = this.map.flat();
		if (!mapflat.includes(0) && !mapflat.includes(2)) {
			return true;
		}
		return false;
	}
}
