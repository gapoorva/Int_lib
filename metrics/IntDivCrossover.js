function divCrossoverTest() {
	var Nvalues = [];
	var Dvalues = [];
	var LD_Tvalues = [];
	var FD_Tvalues = [];

	for(var i = 0; i < 40; ++i) {
	 	var Asub = [];
	 	var Bsub = [];
	 	for (var a = 0; a < 15; a++) {
	 		Asub.push(randstr(i+1));
	 		Bsub.push(randstr(i+1));
	 	}
	 	Nvalues.push(Asub);
	 	Dvalues.push(Bsub);
	 	LD_Tvalues.push({"sum": 0, "cnt": 0, "avg": 0});
	 	FD_Tvalues.push({"sum": 0, "cnt": 0, "avg": 0});
	}


	// Running Long Division
	console.log("running long division tests...")
	for(var y = 0; y < 40; ++y) {
		console.log(y);
		for(var x = y; x < 40; ++x) { //x goes from y+1 digits to 100 digits
			//Index N by x, D by y
			for(var z = 0; z < 15; ++z) {
				var start_long = new Date();
				Int_div_long(Nvalues[x][z], Dvalues[y][z]);
				var end_long = new Date();
				LD_Tvalues[x-y].sum += end_long-start_long
				LD_Tvalues[x-y].cnt += 1;
			}
		}
	}

	//Running Fast Division
	console.log("running fast division tests...")
	for(var y = 0; y < 40; ++y) {
		console.log(y);
		for(var x = y; x < 40; ++x) { //x goes from y+1 digits to 100 digits
			//Index N by x, D by y
			for(var z = 0; z < 15; ++z) {
				var start_fast = new Date();
				Int_div_fast(Nvalues[x][z], Dvalues[y][z]);
				var end_fast = new Date();
				FD_Tvalues[x-y].sum += end_fast-start_fast
				FD_Tvalues[x-y].cnt += 1;
			}
		}
	}

	//Computing Avgs
	for (var a = 0; a < 40; ++a) {
		LD_Tvalues[a].avg = LD_Tvalues[a].sum / LD_Tvalues[a].cnt;
		FD_Tvalues[a].avg = FD_Tvalues[a].sum / FD_Tvalues[a].cnt;
	}

	console.log("DIG-DIFF | LONG | FAST");
	for (var b = 0; b < 40; ++b) {
		console.log(b, "|", LD_Tvalues[b].avg, "|", FD_Tvalues[b].avg);
	}


}