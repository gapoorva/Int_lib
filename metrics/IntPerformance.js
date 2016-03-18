//select operator performance benchmarks
function performanceTest(iterations) {
	var results = [];
	var n = iterations || 20;

	while (n--) results.push(performanceUnit());



}


function performanceUnit() {
	//constructing test numbers
	//console.log("initializing performanceTest...");
	var digs = ["0","1","2","3","4","5","6","7","8","9"];
	var test10a = [];
	var test10b = [];
	var test50a = [];
	var test50b = [];
	var test100a = [];
	var test100b = [];
	var test1000a = [];
	var test1000b = [];
	var test10000a = [];
	var test10000b = [];
	var results = {};
	for(var i = 0; i < 10; ++i) {
		test10a.push(Math.floor(Math.random()*10));
		test10b.push(Math.floor(Math.random()*10));
		test50a.push(Math.floor(Math.random()*10));
		test50b.push(Math.floor(Math.random()*10));
		test100a.push(Math.floor(Math.random()*10));
		test100b.push(Math.floor(Math.random()*10));
		test1000a.push(Math.floor(Math.random()*10));
		test1000b.push(Math.floor(Math.random()*10));
		test10000a.push(Math.floor(Math.random()*10));
		test10000b.push(Math.floor(Math.random()*10));
	}
	for(var i = 0; i < 40; ++i) {
		test50a.push(Math.floor(Math.random()*10));
		test50b.push(Math.floor(Math.random()*10));
		test100a.push(Math.floor(Math.random()*10));
		test100b.push(Math.floor(Math.random()*10));
		test1000a.push(Math.floor(Math.random()*10));
		test1000b.push(Math.floor(Math.random()*10));
		test10000a.push(Math.floor(Math.random()*10));
		test10000b.push(Math.floor(Math.random()*10));
	}
	for(var i = 0; i < 50; ++i) {
		test100a.push(Math.floor(Math.random()*10));
		test100b.push(Math.floor(Math.random()*10));
		test1000a.push(Math.floor(Math.random()*10));
		test1000b.push(Math.floor(Math.random()*10));
		test10000a.push(Math.floor(Math.random()*10));
		test10000b.push(Math.floor(Math.random()*10));
	}
	for(var i = 0; i < 900; ++i) {
		test1000a.push(Math.floor(Math.random()*10));
		test1000b.push(Math.floor(Math.random()*10));
		test10000a.push(Math.floor(Math.random()*10));
		test10000b.push(Math.floor(Math.random()*10));
	}
	for(var i = 0; i < 9000; ++i) {
		test10000a.push(Math.floor(Math.random()*10));
		test10000b.push(Math.floor(Math.random()*10));
	}
	//actual string inputs
	var a10 = test10a.join("");
	var b10 = test10b.join("");
	var a50 = test50a.join("");
	var b50 = test50b.join("");
	var a100 = test100a.join("");
	var b100 = test100b.join("");
	var a1000 = test1000a.join("");
	var b1000 = test1000b.join("");
	var a10000 = test10000a.join("");
	var b10000 = test10000b.join("");

	//actually running the tests
	// console.log("completed init");
	// console.log("using following inputs:");
	// console.log(a10,b10,a50,b50,a100,b100,a1000,b1000,a10000,b10000);
	// console.log("starting performance tests...")
	//overall counter
	var overall1 = new Date();

	//ADD
	//console.log("running add tests...");
	var add10_1 = new Date();
	Int_add(a10, b10);
	var add10_2 = new Date();
	//console.log("\t10 digit add:\t\t\t",add10_2-add10_1);
	results.add10 = add10_2-add10_1;

	var add50_1 = new Date();
	Int_add(a50, b50);
	var add50_2 = new Date();
	//console.log("\t50 digit add:\t\t\t",add50_2-add50_1);
	results.add50 = add50_2-add50_1;

	var add100_1 = new Date();
	Int_add(a100, b100);
	var add100_2 = new Date();
	//console.log("\t100 digit add:\t\t\t",add100_2-add100_1);
	results.add100 = add100_2-add100_1;

	var add1000_1 = new Date();
	Int_add(a1000, b1000);
	var add1000_2 = new Date();
	//console.log("\t1000 digit add:\t\t\t",add1000_2-add1000_1);
	results.add1000 = add1000_2-add1000_1;

	var add10000_1 = new Date();
	Int_add(a10000, b10000);
	var add10000_2 = new Date();
	//console.log("\t10000 digit add:\t\t",add10000_2-add10000_1);
	results.add10000 = add10000_2-add10000_1;

	//SUB
	console.log("running sub tests...");
	var sub10_1 = new Date();
	Int_sub(a10, b10);
	var sub10_2 = new Date();
	console.log("\t10 digit sub:\t\t\t",sub10_2-sub10_1);
	var sub50_1 = new Date();
	Int_sub(a50, b50);
	var sub50_2 = new Date();
	console.log("\t50 digit sub:\t\t\t",sub50_2-sub50_1);
	var sub100_1 = new Date();
	Int_sub(a100, b100);
	var sub100_2 = new Date();
	console.log("\t100 digit sub:\t\t\t",sub100_2-sub100_1);
	var sub1000_1 = new Date();
	Int_sub(a1000, b1000);
	var sub1000_2 = new Date();
	console.log("\t1000 digit sub:\t\t\t",sub1000_2-sub1000_1);
	var sub10000_1 = new Date();
	Int_sub(a10000, b10000);
	var sub10000_2 = new Date();
	console.log("\t10000 digit sub:\t\t",sub10000_2-sub10000_1);

	//MULT
	console.log("running mul tests...");
	var mul10_1 = new Date();
	Int_mul(a10, b10);
	var mul10_2 = new Date();
	console.log("\t10 digit mul:\t\t\t",mul10_2-mul10_1);
	var mul50_1 = new Date();
	Int_mul(a50, b50);
	var mul50_2 = new Date();
	console.log("\t50 digit mul:\t\t\t",mul50_2-mul50_1);
	var mul100_1 = new Date();
	Int_mul(a100, b100);
	var mul100_2 = new Date();
	console.log("\t100 digit mul:\t\t\t",mul100_2-mul100_1);
	var mul1000_1 = new Date();
	Int_mul(a1000, b100);
	var mul1000_2 = new Date();
	console.log("\t1000 digit mul:\t\t\t",mul1000_2-mul1000_1);

	//DIV
	console.log("running div tests...");

	var div10_1 = new Date();
	Int_div(a10, b10);
	var div10_2 = new Date();
	console.log("\t10 digit div:\t\t\t",div10_2-div10_1);
	var div50_1 = new Date();
	Int_div(a50, b10);
	var div50_2 = new Date();
	console.log("\t50 digit div:\t\t\t",div50_2-div50_1);
	var div100_1 = new Date();
	Int_div(a100, b10);
	var div100_2 = new Date();
	console.log("\t100 digit div:\t\t\t",div100_2-div100_1);
	//console.log(Int_gt(a1000,b1000));
	var div1000_1 = new Date();
	Int_div(a1000, b10);
	var div1000_2 = new Date();
	console.log("\t1000 digit div:\t\t\t",div1000_2-div1000_1);
	// var div10000_1 = new Date();
	// Int_div(a10000, b1000);
	// var div10000_2 = new Date();
	// console.log("\t10000 digit div:\t\t",div10000_2-div10000_1);

	//EQ
	console.log("running eq tests...");
	var eq10_1 = new Date();
	Int_eq(a10, a10);
	var eq10_2 = new Date();
	console.log("\t10 digit eq:\t\t\t",eq10_2-eq10_1);
	var eq50_1 = new Date();
	Int_eq(a50, a50);
	var eq50_2 = new Date();
	console.log("\t50 digit eq:\t\t\t",eq50_2-eq50_1);
	var eq100_1 = new Date();
	Int_eq(a100, a100);
	var eq100_2 = new Date();
	console.log("\t100 digit eq:\t\t\t",eq100_2-eq100_1);
	var eq1000_1 = new Date();
	Int_eq(a1000, a1000);
	var eq1000_2 = new Date();
	console.log("\t1000 digit eq:\t\t\t",eq1000_2-eq1000_1);
	var eq10000_1 = new Date();
	Int_eq(a10000, a10000);
	var eq10000_2 = new Date();
	console.log("\t10000 digit eq:\t\t\t",eq10000_2-eq10000_1);

	//LESS
	console.log("running lt tests...");
	var lt10_1 = new Date();
	Int_lt(a10, a10);
	var lt10_2 = new Date();
	console.log("\t10 digit lt:\t\t\t",lt10_2-lt10_1);
	var lt50_1 = new Date();
	Int_lt(a50, a50);
	var lt50_2 = new Date();
	console.log("\t50 digit lt:\t\t\t",lt50_2-lt50_1);
	var lt100_1 = new Date();
	Int_lt(a100, a100);
	var lt100_2 = new Date();
	console.log("\t100 digit lt:\t\t\t",lt100_2-lt100_1);
	var lt1000_1 = new Date();
	Int_lt(a1000, a1000);
	var lt1000_2 = new Date();
	console.log("\t1000 digit lt:\t\t\t",lt1000_2-lt1000_1);
	var lt10000_1 = new Date();
	Int_lt(a10000, a10000);
	var lt10000_2 = new Date();
	console.log("\t10000 digit lt:\t\t\t",lt10000_2-lt10000_1);

	var overall2 = new Date();
	console.log("overall performance:", overall2-overall1);
	console.log("finished");
}