const LEFT_ARROW = 37;
const RIGHT_ARROW = 39;
const DOWN_ARROW = 40;
const UP_ARROW = 38;
const CONTROL = 17;
const SPACE = 32;

const CONTROLS = {
	[LEFT_ARROW]: () => alivePiece.setX(-1),
	[RIGHT_ARROW]: () => alivePiece.setX(1),
	[DOWN_ARROW]: () => alivePiece.setY(1),
	[UP_ARROW]: () => alivePiece.rotate(1),
	[CONTROL]: () => alivePiece.rotate(-1),
	[SPACE]: () => alivePiece.putDown()
};
