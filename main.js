kaboom();

const gravity = 3200;
const Height = height();
const Width = width();
const backgroundColor = Color.fromHex('#b6e5ea');
const pipeColor = Color.fromHex('#74c02e');
const pipeWidth = 64;
const pipeBorder = 4;
const pipeOpen = 240;
const pipeMinHeight = 60;
const jumpForce = 800;
const speed = 320;
const ceiling = -60;

loadSprite("bird", "sprites/bird.png");
loadSound("score", "sounds/score.mp3");
loadSound("jump", "sounds/jump.mp3");
loadSound("hit", "sounds/hit.mp3");

setGravity(gravity);
setBackground(backgroundColor);

const startGame = () => {
    go("game");
}

scene("game", () => {
    let score = 0;
    const game = add([timer()]);
    const createBird = () => {
        const bird = game.add([
            sprite("bird"),
            pos(Width / 4, 0),
            area(),
            body()
        ]);
        return bird;
    }
    const bird = createBird();
    const jump = () => {
        bird.jump(jumpForce);
        play("jump");
    }
    onClick(jump);
    onKeyPress("space", jump);

    const createPipes = () => {
        const topPipeHeight = rand(pipeMinHeight, Height - pipeMinHeight - pipeOpen);
        const bottomPipeHeight = Height - topPipeHeight - pipeOpen;
        game.add([
            rect(pipeWidth, topPipeHeight),
            pos(Width, 0),
            color(pipeColor),
            outline(pipeBorder),
            area(),
            move(LEFT, speed),
            offscreen({destroy: true}),
            "pipe"
        ]);
        game.add([
            rect(pipeWidth, bottomPipeHeight),
            pos(Width, topPipeHeight + pipeOpen),
            color(pipeColor),
            outline(pipeBorder),
            area(),
            move(LEFT, speed),
            offscreen({destroy: true}),
            "pipe",
            {passed: false}
        ]);
    }
    game.loop(1, createPipes);
    bird.onUpdate(() => {
        const birdPosY = bird.pos.y;
        if (birdPosY > Height || birdPosY <= ceiling) {
            go("lose");

        }
    });
    bird.onCollide("pipe", () => {
        play("hit");
        go("lose", score)
    });
    onUpdate("pipe", pipe => {
        if (pipe.pos.x + pipe.width <= bird.pos.x && pipe.passed === false) {
            addScore();
            pipe.passed = true;
        }
    });
    const createScoreLabel = () => {
        const scoreLabel = game.add([
            text(score),
            pos(Width / 2, 80),
            anchor("center"),
            scale(2),
            fixed(),
            z(100)
        ]);
        return scoreLabel;
    }
    const scoreLabel = createScoreLabel();
    const addScore = () => {
        score++;
        scoreLabel.text = score;
        play("score");
    }
});


scene("lose", (score = 0) => {
    add([
        text("Набрано очков:" + score),
        pos(center()),
        scale(2),
        anchor("center")
    ]);
    onClick(startGame);
});

startGame();