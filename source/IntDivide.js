function Int_reciprocol(a, n) {
	a = Int_convertToInt(a);
	//var areplength = a.repLength();
	var diff = new Int(1);
	var power = 0;
	var reciprocol = "";
	var dig = 0;
	var minlength = (n*2 < 4)?4:n*2;

	while((reciprocol.length < minlength) && !diff.is0()) {
		// console.log(reciprocol, diff.get());
		dig = 0;
		while(Int_lteq(a, diff)) {
			diff = Int_sub(diff, a);
			//console.log(diff.get(), dig, power);
			++dig;
		}

		if (diff.is0()) break; //perfect divison
		else// imperfect division 
		{
			if ((reciprocol.length == 0 && dig != 0) || reciprocol.length != 0)
				reciprocol += dig.toString();
			diff = Int_ls(diff, 1);
			power++;
			//console.log(reciprocol);
		}
	}
	if (diff.is0()) {
		if(dig == 10)
			reciprocol += "1";
		else
			reciprocol += dig.toString();

		reciprocol = new Int(reciprocol);
	} 
	else { 
		--power;

		reciprocol = new Int(reciprocol);
		var round = 0;
		if(reciprocol.data[0]%10 > 4) round = 1;
		reciprocol = Int_add(round, Int_rs(reciprocol, 1));
		--power;
	}

	return {"r": reciprocol, "p": power};
	
}

function Int_div_fast(a, b, getMod) {
	a = Int_convertToInt(a);
	b = Int_convertToInt(b);

	var sign = a.is_negative == b.is_negative?false:true;
	a.is_negative = false;
	b.is_negative = false;
	//Integer division 0 case
	if(Int_lt(a, b)) {
		if (getMod) return a;
		return new Int("z");
	}
	//Integer divison 1 case
	if(Int_eq(a, b)) {
		if (getMod) return new Int("z");
		var one = new Int(1);
		one.is_negative = sign;
		return one;
	}
	//Integer divison a case
	if(b.data[0] == 1) {
		if (getMod) return new Int("z");
		return new Int(a);
	}
	//Integer division undefined case
	if(b.data[0] == 0) return new Int("z");


	//Reciprocal method:
	var required_n = a.repLength();
	var rObj = Int_reciprocol(b, required_n);
	var quotient = Int_rs(Int_mul(a, rObj.r), rObj.p);
	//Need to check returned quotient
	var remainder = Int_sub(a, Int_mul(b, quotient));
	if(Int_eq(b, remainder)) {
		if (getMod) return new Int("z");
		return Int_add(quotient, 1);
	}
	if (getMod) return remainder;
	return quotient;
}


// / operator
function Int_div_long(a, b, getMod) {
	// a = Int_convertToInt(a);
	// b = Int_convertToInt(b);

	// var sign = a.is_negative == b.is_negative?false:true;
	// a.is_negative = false;
	// b.is_negative = false;
	// //Integer division 0 case
	// if(Int_lt(a, b)) {
	// 	if (getMod) return a;
	// 	return new Int("z");
	// }
	// //Integer divison 1 case
	// if(Int_eq(a, b)) {
	// 	if (getMod) return new Int("z");
	// 	var one = new Int(1);
	// 	one.is_negative = sign;
	// 	return one;
	// }
	// //Integer divison a case
	// if(b.data[0] == 1) {
	// 	if (getMod) return new Int("z");
	// 	return new Int(a);
	// }
	// //Integer division undefined case
	// if(b.data[0] == 0) return new Int("z");


	var ans_digits = a.repLength() - b.repLength(); //n-d
	var quotient = new Int("z");
	for (var i = 0; i < ans_digits+1; ++i) {
		var divisor = Int_ls(b, ans_digits-i);
		var dig = 0;
		while(Int_gteq(a, divisor)) {
			a = Int_sub(a, divisor);
			dig++
		}
		quotient = Int_add(quotient, Int_ls(dig, ans_digits-i));
	}

	if (getMod) return a;
	else return quotient;
}

function Int_div(a, b, getMod) {
	//INTEGER DIVISION
	a = Int_convertToInt(a);
	b = Int_convertToInt(b);

	var sign = a.is_negative == b.is_negative?false:true;
	a.is_negative = false;
	b.is_negative = false;
	//Integer division 0 case
	if(Int_lt(a, b)) {
		if (getMod) return a;
		return new Int("z");
	}
	//Integer divison 1 case
	if(Int_eq(a, b)) {
		if (getMod) return new Int("z");
		var one = new Int(1);
		one.is_negative = sign;
		return one;
	}
	//Integer divison a case
	if(b.data[0] == 1) {
		if (getMod) return new Int("z");
		return new Int(a);
	}
	//Integer division undefined case
	if(b.data[0] == 0) return new Int("z");

	var div = Int_div_long;
	//if(a.repLength() > 3*b.repLength()) div = Int_div_fast;
	//else div = Int_div_long;

	var q = div(a, b, getMod);
	q.is_negative = sign;
	return q;

}