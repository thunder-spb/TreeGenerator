var Branch = function(x, y, leng, width, deformation, rotate) {

	this.params = {
		x: x,
		y: y,
		leng: leng,
		width: width,
		deformation: deformation,
		rotate: rotate,
	};

	this.parent = null;
	this.children = [];
	this.outgrowths = [];

	this.render = function() {
		drawer.DrawStick(this.params.x,
			this.params.y,
			this.params.leng,
			this.params.width,
			this.params.deformation,
			this.params.rotate);

	}

	this.getEndPoints = function() {
		var ex = this.params.x + this.params.width / 6 + this.params.leng * Math.cos(this.params.rotate.degree()),
			ey = this.params.y + this.params.width / 12 + this.params.leng * Math.sin(this.params.rotate.degree());

		return [ex, ey];
	}

	this.getPointOnCurve = function(pointPos) {
		var pointPos = this.params.leng / 100 * pointPos;


		var ex = this.params.x + this.params.leng / 2 * Math.cos((this.params.rotate + this.params.deformation).degree()),
			ey = this.params.y + this.params.leng / 2 * Math.sin((this.params.rotate + this.params.deformation).degree());

		t = pointPos / 100;

		ep = this.getEndPoints();

		x = [this.params.x, ep[0]];
		y = [this.params.y, ep[1]];

		p1 = [ex, ey];

		par1 = Math.pow((1 - t), 2) * x[0] + (1 - t) * 2 * t * p1[0] + Math.pow(t, 2) * x[1];
		par2 = Math.pow((1 - t), 2) * y[0] + (1 - t) * 2 * t * p1[1] + Math.pow(t, 2) * y[1];

		return [par1, par2];

	}

	this.createChild = function(leng, width, deform, rotate) {
		var exy = this.getEndPoints();
		this.children.push(new Branch(exy[0], exy[1], leng, /*params.width/1.5*/ width, deform, rotate));
		this.children[this.children.length - 1].parent = this;
		return this.children[this.children.length - 1];
	}

	this.createOutgrowth = function(leng, width, pos, deform, rotate) {
		var startXY = this.getPointOnCurve(pos);

		this.outgrowths.push(new Branch(startXY[0], startXY[1], leng, width, deform, this.params.rotate + rotate));

		return this.outgrowths.reverse()[0];
	}

	this.createSprout = function(leng, deform, rotate) {
		return this.createChild(leng, this.params.width / 1.5, deform, rotate);
	}

	this.createDivarication = function(branches, main) {

		var wi = this.params.width / 1.5 / 2,
			devs = [];
		for (var i = 0; i < 2; i++) {
			bi = branches[i];
			devs.push(this.createChild(bi.leng, (i == main) ? (1.9 * wi) : wi * 1.4,
				bi.deform,
				this.params.rotate - /*this.params.deformation/1.45-(main==i)?0:*/ bi.rotate
			));
		}

		return this.children;

	}

	this.render();
}