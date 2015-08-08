var _isDown, _points, _r, _g, _rc, currentShape;
var allShape = ["triangle", "x","rectangle","circle",
				"check","caret","zig-zag",
				"arrow","lsb","rsb","v","delete",
				"lcb","rcb","star","pigtail"
				];
	
	function getNewShape(){ 
		currentShape = allShape[Math.floor(Math.random() * allShape.length)]; 
		document.getElementById("demo").innerHTML = currentShape + "<br>"; 
	}
	
	function onLoadEvent()
		{
			getNewShape();
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
		
		function clearCanvas(){
			var canvas = document.getElementById('myCanvas');
			_g = canvas.getContext('2d');
			_g.clearRect(0, 0, canvas.width, canvas.height);
		}
		
		function getCanvasRect(canvas)
		{
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
		function getScrollY()
		{
			var scrollY = 0;
			if (typeof(document.body.parentElement) != 'undefined')
			{
				scrollY = document.body.parentElement.scrollTop; // IE
			}
			else if (typeof(window.pageYOffset) != 'undefined')
			{
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
				//drawText("Result: " + result.Name);
				if (result.Name == currentShape) {
					getNewShape();
					score += 1;
					scoreText.Text = score;
				}	
				else {
					
				}
				clearCanvas();
			}
		}

		function drawConnectedPoint(from, to)
		{
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
	

