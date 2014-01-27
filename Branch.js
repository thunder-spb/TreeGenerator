/*
*
* Abstract drower class Branch.
* =============================
*
* Provide branch as object with methods: createSprout, createDivarication, createOutgrowth
* You can use it for tree drawing without generator
*
*/

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

	/*
	* Function for draw branche from abstract
	*/
	this.render = function() {
		drawer.DrawStick(this.params.x,
			this.params.y,
			this.params.leng,
			this.params.width,
			this.params.deformation,
			this.params.rotate);

	}

	/*
	* Function for get end points from branch. Returns array [x,y]
	*/
	this.getEndPoints = function() {
		var ex = this.params.x + this.params.leng * Math.cos(this.params.rotate.degree()),
			ey = this.params.y + this.params.leng * Math.sin(this.params.rotate.degree());

		return [ex, ey];
	}

	/*
	* Function for get point on branch(curve). Works with % of branche length. Returns array [x,y]
	*/
	this.getPointOnCurve = function(pointPos) {
		
		//point pos to percents
		var pointPos = this.params.leng / 100 * pointPos;

		//getting curve center point position
		var ex = this.params.x + this.params.leng / 2 * Math.cos((this.params.rotate + this.params.deformation).degree()),
			ey = this.params.y + this.params.leng / 2 * Math.sin((this.params.rotate + this.params.deformation).degree());

		//t -point on Bazier curve [0,1]
		t = pointPos / 100;

		//Points for Bazier curve
		ep = this.getEndPoints();
		
		x = [this.params.x, ep[0]];
		y = [this.params.y, ep[1]];

		p1 = [ex, ey];

		//Bazier curve
		par1 = Math.pow((1 - t), 2) * x[0] + (1 - t) * 2 * t * p1[0] + Math.pow(t, 2) * x[1];
		par2 = Math.pow((1 - t), 2) * y[0] + (1 - t) * 2 * t * p1[1] + Math.pow(t, 2) * y[1];

		return [par1, par2];

	}

	/*
	* Function for create child(low level). Returns child
	*/
	this.createChild = function(leng, width, deform, rotate) {
		var exy = this.getEndPoints();
		
		//Create children and push to childrens
		this.children.push(new Branch(exy[0], exy[1], leng, width, deform, rotate));

		//Push parent to child
		this.children[this.children.length - 1].parent = this;

		return this.children[this.children.length - 1];
	}

	/*
	* Function for create outhgrowth from branche(hight level). Returns outgrowth. 
	*/
	this.createOutgrowth = function(leng, width, pos, deform, rotate) {
		var startXY = this.getPointOnCurve(pos);

		this.outgrowths.push(new Branch(startXY[0], startXY[1], leng, width, deform, this.params.rotate + rotate));

		return this.outgrowths.reverse()[0];
	}

	/*
	* Function for create child(Higth level)
	*/
	this.createSprout = function(leng, deform, rotate) {
		return this.createChild(leng, this.params.width/BRANCH_CONSTRICTION, deform, rotate);
	}

	/*
	* Function for create 2 Divarications. Branches param is array [{params},{params}]. Main is number of bigger
	*/
	this.createDivarication = function(branches, main) {

		var wi = this.params.width / BRANCH_CONSTRICTION / 2,
			devs = [];
		for (var i = 0; i < 2; i++) {
			bi = branches[i];
			devs.push(this.createChild(bi.leng, (i == main) ? (1.9 * wi) : wi * 1.4,
				bi.deform,
				this.params.rotate - bi.rotate
			));
		}

		return this.children;

	}

	this.render();
}