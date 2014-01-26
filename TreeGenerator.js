var TreeGenerator = function(){

	this.genL=function(branch) {



		ep = branch.getEndPoints();
		sp = branch.parent.params;
		var brp = [
			[sp.x, sp.y],
			[ep[0], ep[1]]
		],

			leafCount = branch.params.leng / (LEAF_LENG * LEAF_SCALE) * LEAF_DENSITY;


		//console.log(brp);	

		for (var li = 1; li < leafCount; li++) {

			//for(var li2=0;li2<2;li2++){
			lx = brp[0][0] + (brp[1][0] - brp[0][0]) / (leafCount) * li;

			ly = brp[0][1] + (brp[1][1] - brp[0][1]) / leafCount * li;

			drawer.DrawLeaf(lx,
				ly,
				LeafMaps[LEAF_TYPE], ['#353', 'green'],
				LEAF_SCALE,
				branch.params.rotate - 180
			);
			//}

		}
	}

	this.genO=function(branch) {
		if (branch.params.width > 1) {
			var outgrowthsCount = rand(0, 4);
			for (var io = 0; io < outgrowthsCount; io++) {

				this.genF(branch.createOutgrowth(rand(10, branch.params.leng), rand(1, branch.params.width), rand(1, 100), rand(-10, 10), rand(-40, 40)));

			}
		}
	}

	this.genF=function(branch) {
		if (branch.params.width > 1) {

			var divarications = [],
				dfm = BRANCH_DEFORMATION * branch.params.width / branch.params.leng;

			//Makes divarications params
			for (var di = 0; di <= 2; di++) {

				divarications.push({
					leng: rand(40, branch.params.leng),
					deform: rand(-dfm, dfm),
					rotate: (di == 0) ? (rand(-20, -10)) : (rand(10, 20))
				});
			}

			//Create divarications from params
			var chld = branch.createDivarication(divarications, Math.floor(rand(0, 2)));

			//Makes divarication children and outgrowths
			for (var ci = 0; ci < 2; ci++) {
				if (OUTGROWTH_ISSHOWN) {
					if (chld[ci].params.width < OUTGROWTH_BRANCH_WIDTH) {
						this.genO(chld[ci]);
					}
				}

				this.genF(chld[ci]);
			}


		} else {

			if(LEAF_ISSHOWN){
				this.genL(branch);
			}
			


		}



	}

	this.genT=function(x,y){
		var mainTreeBranch = new Branch(x, y, rand(70, BRANCE_MAXLENGTH), rand(10, BRANCE_MAXWIDTH), rand(-40, 40), rand(-120, -70));
		this.genF(mainTreeBranch);
		drawer.DrawHill(x,y+20);

		return mainTreeBranch;
	}
}