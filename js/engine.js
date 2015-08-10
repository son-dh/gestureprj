var game = new Phaser.Game(480, 800, Phaser.AUTO, 'phaser', { preload: preload, create: create, update: update });
var score = 0;
var _isDown, _points, _r, _g, _rc, currentShape;
var allShape = ["triangle", "x","rectangle","circle",
				"check","caret","zig-zag",
				"arrow","lsb","rsb","v","delete",
				"lcb","rcb","star","pigtail" 
				];
var spawn;

var currentSpawns =[];

function preload() {
	
	game.load.image('sea', 'assets/sea.png');
	game.load.spritesheet('arrow', 'assets/gest/arrow.png', 80, 48);
	game.load.spritesheet('caret', 'assets/gest/caret.png', 48, 48);
	game.load.spritesheet('check', 'assets/gest/check.png', 48, 48);
	game.load.spritesheet('circle', 'assets/gest/circle.png', 48, 48);
	game.load.spritesheet('delete', 'assets/gest/del.png', 48, 48);
	game.load.spritesheet('lcb', 'assets/gest/lcb.png', 48, 60);
	game.load.spritesheet('lsb', 'assets/gest/lsb.png', 48, 60);
	game.load.spritesheet('pigtail', 'assets/gest/pigtail.png', 48, 48);
	game.load.spritesheet('rcb', 'assets/gest/rcb.png', 48, 60);
	game.load.spritesheet('star', 'assets/gest/star.png', 48, 48);
	game.load.spritesheet('rectangle', 'assets/gest/rect.png', 48, 37);
	game.load.spritesheet('rsb', 'assets/gest/rsb.png', 48, 60);
	game.load.spritesheet('triangle', 'assets/gest/triangle.png', 49, 39);
	game.load.spritesheet('v', 'assets/gest/v.png', 48, 48);
	game.load.spritesheet('x', 'assets/gest/x.png', 48, 37);
	game.load.spritesheet('zig-zag', 'assets/gest/zigzag.png', 80, 48);
	
}

function create() {	
	sea = game.add.tileSprite(0,0,480,800,'sea');
	score = 0;
	scoreText = game.add.text(20,20,"0", { font: "30px Arial", fill: "#ffffff"})
	
	animateGestures();
}

function update() {
	sea.tilePosition.y += 2;

}
var gesture_Y_position = 300;

function gestureObject(){
	
}

function gameSpawner()
{
	if (score < 5)
	{
		numberOfShapes = 1;
	}		
	else if (score >= 5 && score < 10)
	{
		numberOfShapes = 2;
	}
	else 
	{
		numberOfShapes = 3;
	}
	for (i = 0; i < numberOfShapes; i++)
	{
		
		_getRnd = allShape[Math.floor(Math.random() * allShape.length)]; 
		currentSpawns.push({ currentShape: _getRnd, shape: null});
	}	
	animateGestures();
	console.log(currentSpawns);		//DEBUG	
}

function animateGestures(){
	y = 300;
	for (i=0; i<currentSpawns.length; i++){
		var shape = game.add.sprite(200,y,currentSpawns[i].currentShape);
		shape.animations.add('twinkle',null,25,true);
		shape.play('twinkle');
		currentSpawns[i].shape = shape; 
		y += 60;		
	}
}

function searchAndRemove(input, arr)	{
	for(i = 0; i< arr.length; i++)	{
		if(arr[i].currentShape === input)	{			
			arr[i].shape.destroy();
			arr.splice(i, 1);
			score += 1;
			scoreText.text = score;			
				
			break;
		}
	}
	if (arr.length === 0)	{
		
		gameSpawner();
	}	
}
  
	
function onLoadEvent()
{
	gameSpawner();
	_points = new Array();
	_r = new DollarRecognizer();
	var canvas = document.getElementById('myCanvas');
	_g = canvas.getContext('2d');
	_g.fillStyle = "rgb(0,0,225)";
	_g.strokeStyle = "rgb(0,0,225)";
	_g.lineWidth = 3;
	_g.font = "16px Gentilis";
	_rc = getCanvasRect(canvas); // canvas rect on page
	_isDown = false;
}
		
function clearCanvas()	{
	var canvas = document.getElementById('myCanvas');
	_g = canvas.getContext('2d');
	_g.clearRect(0, 0, canvas.width, canvas.height);
}
		
function getCanvasRect(canvas)	{
	var w = canvas.width;
	var h = canvas.height;
	var cx = canvas.offsetLeft;
	var cy = canvas.offsetTop;
	while (canvas.offsetParent != null)
	{
		canvas = canvas.offsetParent;
		cx += canvas.offsetLeft;
		cy += canvas.offsetTop;
	}
	return {x: cx, y: cy, width: w, height: h};
}

function getScrollY()	{
	var scrollY = 0;
	if (typeof(document.body.parentElement) != 'undefined')	{
		scrollY = document.body.parentElement.scrollTop; // IE
	}
	else if (typeof(window.pageYOffset) != 'undefined')	{
		scrollY = window.pageYOffset; // FF
	}
	return scrollY;
}
//
// Mouse Events
//
		function mouseDownEvent(x, y)
		{
			document.onselectstart = function() { return false; } // disable drag-select
			document.onmousedown = function() { return false; } // disable drag-select
			_isDown = true;
			x -= _rc.x;
			y -= _rc.y - getScrollY();
			if (_points.length > 0)
			//	_g.clearRect(0, 0, _rc.width, _rc.height);
			_points.length = 1; // clear
			_points[0] = new Point(x, y);
			//drawText("Recording unistroke...");
			//_g.fillRect(x - 4, y - 3, 9, 9);
		}
		
		function mouseMoveEvent(x, y)
		{
			if (_isDown)
			{
				x -= _rc.x;
				y -= _rc.y - getScrollY();
				_points[_points.length] = new Point(x, y); // append
				drawConnectedPoint(_points.length - 2, _points.length - 1);
			}
		}
		
		function mouseUpEvent(x, y)
		{
			document.onselectstart = function() { return true; } // enable drag-select
			document.onmousedown = function() { return true; } // enable drag-select
			if (_isDown) {
				_isDown = false;
				var result = _r.Recognize(_points);
				searchAndRemove(result.Name, currentSpawns)
				clearCanvas();
			}

		}

		function drawConnectedPoint(from, to)	{
			_g.beginPath();
			_g.moveTo(_points[from].X, _points[from].Y);
			_g.lineTo(_points[to].X, _points[to].Y);
			_g.closePath();
			_g.stroke();
		}
		
		function round(n, d) // round 'n' to 'd' decimals
		{
			d = Math.pow(10, d);
			return Math.round(n * d) / d
		}
	

