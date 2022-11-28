import gamefield from "./map.js";

// MUST BE EVEN NUMBER
let tileSize = 32;
let velocity = 2;

const canvas = document.getElementById("gamecanvas");
const ctx = canvas.getContext("2d");
const map = new gamefield(tileSize);
const pacman = map.getPlayer(velocity);
const ghosts = map.getGhosts(velocity);

let win = false;
let death = false;
let scorecounter = 0;

let winsound = new Audio("js/Pacman/assets/win.mp3");
let deathsound = new Audio("js/Pacman/assets/death.mp3");

function gameLoop() {
	map.draw(ctx);
	gameend();
	pacman.draw(ctx, pause(), ghosts);
	ghosts.forEach((Ghost) => Ghost.draw(ctx, pause(), pacman));
	checkdeath();
	checkwin();
}

function pause() {
	return !pacman.firstmove || death || win;
}

function checkdeath() {
	if (!death) {
		death = ghosts.some(
			(ghost) => !pacman.powerupped && ghost.checkCollision(pacman)
		);
		if (death) {
			deathsound.play();
		}
	}
}

function checkwin() {
	if (!win) {
		win = map.didwin();
		if (win) {
			winsound.play();
		}
	}
}

function gameend() {
	scorecounter++;
	if (death) {
		ctx.fillStyle = "rgba(0, 0, 0, 75%)";
		ctx.fillRect(0, canvas.height / 2 - 40, canvas.width, 80);
		ctx.fillStyle = "red";
		ctx.font = "40px OptimusPrincepsSemiBold";
		ctx.fillText("You Died", canvas.width / 4, canvas.height / 2 + 15);
	} else if (win) {
		ctx.fillStyle = "rgba(0, 0, 0, 75%)";
		ctx.fillRect(0, canvas.height / 2 - 40, canvas.width, 80);
		ctx.fillStyle = "white";
		ctx.font = "40px OptimusPrincepsSemiBold";
		ctx.fillText("You Won", canvas.width / 4, canvas.height / 2 + 15);
	}

	if (death || win) {
		// press r to restart the game
		ctx.fillStyle = "white";
		ctx.font = "20px OptimusPrincepsSemiBold";
		ctx.fillText(
			"Press R to restart",
			canvas.width / 4,
			canvas.height / 2 + 40
		);

		document.addEventListener("keydown", (e) => {
			if (e.key == "r") {
				win = false;
				death = false;
				map.map = [
					[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
					[1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
					[1, 0, 1, 6, 1, 0, 1, 1, 1, 0, 1, 0, 1],
					[1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 6, 1],
					[1, 0, 0, 0, 1, 0, 1, 1, 0, 1, 1, 2, 1],
					[1, 1, 1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1],
					[1, 0, 0, 0, 0, 2, 4, 0, 0, 1, 1, 1, 1],
					[1, 0, 1, 1, 0, 1, 1, 1, 0, 0, 0, 0, 1],
					[1, 0, 0, 0, 0, 1, 2, 1, 1, 0, 0, 0, 1],
					[1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
					[1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1],
					[1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
					[1, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1],
					[1, 0, 2, 6, 0, 0, 0, 0, 0, 0, 0, 0, 1],
					[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
				];
				map.setCanvasSize(canvas);
				map.getPlayer(velocity);
			}
		});
	}
}
map.setCanvasSize(canvas);
setInterval(gameLoop, 1000 / 70);
