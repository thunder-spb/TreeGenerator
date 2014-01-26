var Drawer = function(canvasElement) {
	this.c = canvasElement;

	/*
	// Function for draw sticks. Stick makes tree 
	*/
	this.DrawStick = function(x, y, leng, w, deform, rotate) {

		//Save canvas and transform
		this.c.save();
		this.c.translate(x, y);
		this.c.rotate(rotate.degree());

		//Set X and Y for null  
		x = 0;
		y = w / -2;

		//Draw stick path
		this.c.beginPath();
		this.c.moveTo(x, y);
		this.c.bezierCurveTo(x, y, x + leng / 2, y + deform, x + leng, y + w / 3);
		this.c.lineTo(x + leng, y + w / 1.5 + w / 3);
		this.c.bezierCurveTo(x + leng, y + w / 1.5 + w / 3, x + leng / 2, y + w + deform, x, y + w);
		this.c.lineTo(x, y);
		this.c.closePath();

		//Draw arc on stick 
		this.c.arc(x + leng, y + w / 3 + (w / 3), w / 3, 0 * Math.PI, 2 * Math.PI, false);

		//Fill stick
		this.c.fillStyle = '#333';
		this.c.fill();

		//Restore canvas 
		this.c.restore();
	}

	/*
	// Function for draw leafs from map.
    */
	this.DrawLeaf = function(x, y, leafPoints, colors, scale, rotate) {

		//Save X and Y
		lx = x;
		ly = y;

		//Makes 
		for (var io = 0; io < 2; io++) {
			this.c.save();

			this.c.translate(x, y);
			this.c.rotate((rotate).degree());
			this.c.scale(scale, scale);

			if (io == 1) {
				this.c.setTransform(-1, 0, 0, 1, x, y);
				this.c.scale(scale, scale);
				this.c.rotate((-180 - (rotate)).degree());
			}

			x = 100 / -2;
			y = 0;

			this.c.beginPath();
			this.c.moveTo(x, y);

			var lastPair = [0, 0];
			for (var bi in leafPoints) {
				var bp = leafPoints[bi];

				this.c.bezierCurveTo(x + lastPair[0], y + lastPair[1],
					x + bp[1][0], y + bp[1][1],
					x + bp[0][0], y + bp[0][1]);
				lastPair = [bp[0][0], bp[0][1]];

			}

			this.c.lineTo(x + LEAF_LENG, y);
			this.c.closePath();
			this.c.fillStyle = colors[1];
			this.c.fill();

			this.c.strokeStyle = colors[0];
			this.c.stroke();

			this.c.restore();

			x = lx;
			y = ly;
		}


	}

	/*
	// Function for draw ground under tree.
    */
	this.DrawHill=function(x,y){
		this.c.save();
		this.c.beginPath();
		this.c.arc(x, y, 50, 1 * Math.PI, 2 * Math.PI, false);
		this.c.closePath();
		this.c.fillStyle = 'green';
		this.c.fill();
		this.c.restore();
	}


}