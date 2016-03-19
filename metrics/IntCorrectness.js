function randstr(n) { //expecting positve non-zero
	var digits = "1350789624";
	var digitsNoZero = "756921843";
	var str = "";
	for(var i = 0; i < n; i++) 
		str += digits[Math.floor(Math.random()*10)];

	var z = 0;
	while(str[z] == "0") ++z;

	str = str.substring(z);
	while(z-- > 0) {
		str += digitsNoZero[Math.floor(Math.random()*9)];
	}

	return str;
}

function runCorrectnessTest(operation) {
	 var AValues = []; //array of array of random generations 1000*10
	 var BValues = [];

	 var op;
	 switch(operation) {
	 	case "+":
	 		op = Int_add;
	 		break;
	 	case "-":
	 		op = Int_sub;
	 		break;
	 	case "*":
	 		op = Int_mul;
	 		break;
	 	case "/":
	 		op = Int_div;
	 		break;
	 	default:
	 		op = Int_eq;
	 }

	 for(var i = 0; i < 100; ++i) {
	 	var Asub = [];
	 	var Bsub = [];
	 	for (var a = 0; a < 50; a++) {
	 		Asub.push(randstr(i+1));
	 		Bsub.push(randstr(i+1));
	 	}
	 	AValues.push(Asub);
	 	BValues.push(Bsub);
	 }
	 
	 var node = document.createElement("DIV");

	 var start = new Date();

	 for (var x = 0; x < 100; ++x) {
	 	console.log(x);
	 	for (var y = 0; y < 50; ++y) {

	 		//Same Size
	 		var A = new Int(AValues[x][y]);
	 		var B = new Int(BValues[x][y]);
	 		var C = op(A, B);
	 		// var d = document.createElement("div");
	 		// div.appendChild();
	 		//console.log(C);
	 		document.getElementById("body").appendChild(
	 			document.createTextNode(A.get() +" "+ B.get() +" "+ C.get())
	 		);
	 		document.getElementById("body").appendChild(document.createElement("br"));

	 		//B large -> B small A small -> large
	 		var D = new Int(BValues[99-x][y]);
	 		var E = op(A, D);

	 		document.getElementById("body").appendChild(
	 			document.createTextNode(A.get() +" "+ D.get() +" "+ E.get())
	 		);
	 		document.getElementById("body").appendChild(document.createElement("br"));

	 		//A large -> A small B small -> large
	 		var F = new Int(AValues[99-x][y]);
	 		var G = op(F, B);

	 		document.getElementById("body").appendChild(
	 			document.createTextNode(F.get() +" "+ B.get() +" "+ G.get())
	 		);
	 		document.getElementById("body").appendChild(document.createElement("br"));
	 	}
	 }

	 for(var n = 100; n >= 2; --n) {

	 	for(var m = n-1; m >= 1; --m) {
	 		console.log(n,m);
	 		var X = new Int(n);
	 		var Y = new Int(m);
	 		var Z = op(X, Y);

	 		document.getElementById("body").appendChild(
	 			document.createTextNode(X.get() +" "+ Y.get() +" "+ Z.get())
	 		);
	 		document.getElementById("body").appendChild(document.createElement("br"));

	 	}
	 }

	 var end = new Date();

	 console.log("25000 binary ops executed in: ", (end - start)/1000, "seconds");

}