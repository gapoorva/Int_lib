//A javascript object that implements a large number representation

//optimizations:
// 1. Increase MAX_DIGITS to 14. This is maximum through-put for JS numbers under the current design
//	 NOTE: this is assuming 2 part Karatsuba. Increasing to 3 partitions will increase to maximum 16 digit representation
// 2. Fast division - DONE
// 3. Number special case in Int constructor
// 4. cache the get() representation on construction

function Int(num_in) {

	this.MAX_DIGITS = 9;
	this.radix_str = "0123456789";
	this.radix = 10;
	this.data = [];
	this.is_negative = false;
	this.updated = false;
	//this would mean the maximum number in a digit place would be 999,999,999

	//check for construction methods
	if(num_in instanceof Int) {// copy ctor
		//init data members to num_in's data
		for(var i = 0; i < num_in.data.length; ++i) 
			this.data.push(num_in.data[i]);
		
		this.is_negative = (num_in.is_negative?true:false);
	} else {
		if(typeof num_in == 'number') 
			num_in = Math.floor(num_in).toString();
		else if(typeof num_in != 'string') {
			console.error("ERROR: attempted construction of non-numeric object");
			this.data.push(0);
			this.is_negative = false;
			return this;
		}
		//known to be dealing with string type now

		//empty number constructor
		//SPECIAL CASE, SHOULD USE WITH CAUTION
		if(num_in == "Z" || num_in == "z") {
			this.data.push(0);
			this.updated = true;
			return this;
		}

		if(!Int_isNumericString(num_in)) {
			console.error("ERROR: cannot construct Int using '"+num_in+"' which is a non-numeric string");
			this.data.push(0);
			this.is_negative = false;
			return this;
		}
		//known to be dealing with numeric string now
		if(num_in[0] == '-') {
			if(num_in.length == 1) {
				this.is_negative = true;
				this.data.push(0);
				return this;
			}
			this.is_negative = true;
			num_in = num_in.substr(1);
		}
		if(num_in[0] == '+') {
			if(num_in.length == 1) {
				this.is_negative = false;
				this.data.push(0);
				return this;
			}
			this.is_negative = false;
			num_in = num_in.substr(1);
		}

		var is_0 = true;
		for(var x = 0; x < num_in.length; ++x) 
			if(num_in[x] != "0") {
				is_0 = false;
				break;
			}

		if(is_0) {
			this.data.push(0);
			this.is_negative = false;
			return this;
		}

		//non-zero numeric string with no sign character:

		var idx = num_in.length-1;
		var accum = 0;
		var place = 0;

		for(var i = 0; i < Math.ceil(num_in.length/this.MAX_DIGITS); ++i) {
			place = 0;
			while(idx >= 0 && idx >= num_in.length - this.MAX_DIGITS*(i+1)) {
				accum += this.radix_str.indexOf(num_in[idx--])*Math.pow(this.radix,place++);
			}
			this.data.push(accum);
			accum = 0;
		}

		this.updateRepresentation();

	}
}

Int.MAX_UNIT = 1000000000;
Int.upper_shift_8 = "00000000";
Int.digits = "1350789624";
Int.digitsNoZero = "756921843";

//Returns decimal string representation
Int.prototype.get = function() {
	var strings = [];
	this.removeZeros();
	if(this.is_negative == true) strings.push("-");
	for (var i = this.data.length-1; i >= 0; --i) {
			var str_rep = this.data[i].toString();
			while( (this.data.length > 1 && i != this.data.length-1)
				&& str_rep.length < this.MAX_DIGITS) 
				str_rep = "0" + str_rep;
			strings.push(str_rep);
	}
	return strings.join("");
};


//another name for get
Int.prototype.toString = function () {
	return this.get();
}

Int.prototype.repLength = function () {
	var size = this.data.length * this.MAX_DIGITS;
	var last = this.MAX_DIGITS - this.data[this.data.length-1].toString().length;
	return size - last;
}

//Negates the Int
Int.prototype.negate = function() {
	this.is_negative = !this.is_negative;
	return this;
};


Int.prototype.updateRepresentation = function() {
	if(this.updated) return;
	if(this.is0()) this.is_negative = false;
	//eliminate trailing 0's in the array. These represent unecessary 0's
	// while(this.data.length > 1 && this.data[this.data.length-1] == 0) 
	// 	this.data.pop();
	this.removeZeros();
	this.updated = true;
	return this;
}

Int.prototype.removeZeros = function() {
	if (this.data.lenth == 1) return this;
	while(this.data.length > 1 && this.data[this.data.length-1] == 0) 
		this.data.pop();
	return this;
}

Int.prototype.is0 = function() {
	for(var i in this.data) 
		if (this.data[i] != 0) return false;
	return true;
}

Int.prototype.ninesComplement = function() {
	var cmplt = new Int("z");
	cmplt.data = [];
	//generate equivalent 9's string
	for (var i = 0; i < this.data.length-1; ++i) 
		cmplt.data.push(Int.MAX_UNIT-1);
	cmplt.data.push(9);
	while(cmplt.data[cmplt.data.length-1] < this.data[this.data.length-1]) 
		cmplt.data[cmplt.data.length-1] = cmplt.data[cmplt.data.length-1]*10 + 9
	
	// if(cmplt.data[cmplt.data.length-1] > Int.MAX_UNIT-1) {
	// 	cmplt.data[cmplt.data.length-1] = Math.floor(cmplt.data[cmplt.data.length-1]/10);
	// 	cmplt.push(9);
	// }

	//compute 9's complement
	for (var i in this.data) 
		cmplt.data[i] = cmplt.data[i] - this.data[i];
	return Int_add(cmplt, 1);
}


//Checks if input is a numeric string
function Int_isNumericString(s) {
	var legal = "0123456789";
	if(typeof s != 'string') return false;//non string case
	if(s.length == 0) return false;//empty string case
	if((legal+"-+").indexOf(s[0]) == -1) return false; //only first char can be sign
	for(var i = 1; i < s.length; i++) 
		if(legal.indexOf(s[i]) == -1) 
			return false;
	return true;
}

//Cast as Int_type
function Int_convertToInt(x) {
	if (!(x instanceof Int)) {
		if ((typeof x == 'string' && Int_isNumericString(x)) || 
			(typeof x == 'number')) {//numeric string
			return new Int(x);
		} else {
			console.error("ERROR: cannot construct Int object from given type "+(typeof x));
			return new Int("0");
		}
	}
	x.updateRepresentation();
	return new Int(x);
}

// == operator
function Int_eq(a,b) {
	a = Int_convertToInt(a);
	b = Int_convertToInt(b);

	if(a.is0() && b.is0()) //0 case
		return true;
	if(a.data.length != b.data.length) //length case
		return false;
	if(a.is_negative != b.is_negative) //sign case (after 0 because 0 isn't signed)
		return false;
	for(var i = 0; i < a.data.length; ++i) 
		if(a.data[i] != b.data[i])
			return false;
	return true;
}

// != operator
function Int_neq(a,b) {
	return !Int_eq(a,b);
}

// < operator
function Int_lt(a, b) {
	a = Int_convertToInt(a);
	b = Int_convertToInt(b);

	if(a.is0() && b.is0())//0 case
		return false;
	//zeros are 'positive' now, thanks to updateRepresentation
	//if numbers are negative, they are also non-zero
	//negative vs positive(or 0)
	if(a.is_negative && !b.is_negative) return true;
	if(!a.is_negative && b.is_negative) return false;

	//length comparison
	if(a.data.length < b.data.length) return true;
	if(a.data.length > b.data.length) return false;

	//same length, same sign compare digit by digit
	for(var i = a.data.length - 1; i >=0; --i) {
		if(a.data[i] == b.data[i]) continue; //digit is equal, check less significant bits
		else if(a.data[i] < b.data[i]) return a.is_negative?false:true;
		else return a.is_negative?true:false;
	}
	return false;
}

// <= operator
function Int_lteq(a, b) {
	return Int_lt(a, b) || Int_eq(a, b);
}

// > operator
function Int_gt(a,b) {
	return !Int_lt(a, b) && Int_neq(a, b);
}

// >= operator
function Int_gteq(a, b) {
	return !Int_lt(a, b);
}


// + operator
function Int_add(a, b) {
	a = Int_convertToInt(a);
	b = Int_convertToInt(b);

	if(a.is0()) return b;
	if(b.is0()) return a;
	if(a.is_negative && !b.is_negative) 
		return Int_sub(b, a); //standard subtraction
	if(!a.is_negative && b.is_negative)
		return Int_sub(a, b); //standard subtraction
	var sign = a.is_negative;
	var ans = new Int("z");
	ans.data = []
	var carry = 0;
	var match = a.data.length>b.data.length?b.data.length:a.data.length;
	for (var i = 0; i < match; ++i) {
		var sum = a.data[i] + b.data[i] + carry;
		ans.data.push(sum % Int.MAX_UNIT);
		carry = Math.floor(sum / Int.MAX_UNIT);
	}
	while(match < a.data.length) {
		 var sum = a.data[match++] + carry;
		 ans.data.push(sum % Int.MAX_UNIT);
		 carry = Math.floor(sum / Int.MAX_UNIT);
		 while (carry == 0 && match < a.data.length)
		 	ans.data.push(a.data[match++])
	}
	while(match < b.data.length) {
		var sum = b.data[match++] + carry;
		ans.data.push(sum % Int.MAX_UNIT);
		carry = Math.floor(sum / Int.MAX_UNIT);
		while (carry == 0 && match < a.data.length)
		 	ans.data.push(a.data[match++])
	}
	if(carry > 0) {
		ans.data.push(carry);
	}
	ans.is_negative = sign;
	return ans;
}

// E operator
function Int_sum(array) {
	var sum = new Int("z");
	for(var i = 0; i < array.length; ++i) 
		sum = Int_add(sum, array[i]);
	return sum;
}

// - operator
function Int_sub(a, b) {
	a = Int_convertToInt(a);
	b = Int_convertToInt(b);

	if(a.is_negative && !b.is_negative) { //case negated add
		a.is_negative = b.is_negative = false;
		var ans = Int_add(a, b);
		ans.is_negative = true;
		return ans;
	}
	else if(!a.is_negative && b.is_negative) { //case normal add
		a.is_negative = b.is_negative = false;
		return Int_add(a, b);
	}
	else { // case normal add or negated add
		var negate = a.is_negative;
		a.is_negative = b.is_negative = false; //pulling out the negative
		if(Int_eq(a, b)) return new Int("z");
		var first;
		var second;

		if (Int_gt(a, b)) {
			first = a;
			second = b;
		} else {
			first = b;
			second = a;
			negate = !negate; //pull out another negative
		}
		//we are garaunteed first > second
		// (a - b) = (comp9(comp9(a) + b)) when a > b
		var ans = Int_add(first.ninesComplement(), second).ninesComplement();
		ans.is_negative = negate;

		while(ans.data[ans.data.length - 1] == 0) ans.data.pop();

		return ans;
	}
}

// << operator (base 10)
function Int_ls(a, b) {
	//a shifted left b times
	a = Int_convertToInt(a);
	b = Number(b);
	//b = Int_convertToInt(b);

	var zeros = [];
	for(var i = 0; i < b; ++i) {
		zeros.push("0");
	}
	return new Int(a.get() + zeros.join(""));
}

//This works because if a string was
//of large enough size to be mis-represented
//by native number indexes, it would consume
//too much memory. Therefore, it is a safe
//assumption to make that substring indexes
//can be incremented using native number type
//in Javascript.
function Int_substr(str, a, b) {
	a = Int_convertToInt(a);
	b = Int_convertToInt(b);

	var start = 0;
	while(Int_lt(start, a)) start++;
	var end = 0;
	while(Int_lt(end, b)) end++;
	return str.substring(start,end);
}

// >> operator (base 10)
function Int_rs(a, b) {
	a = Int_convertToInt(a);
	//b = Int_convertToInt(b);
	b = Number(b);
	var offset = a.is_negative?1:0;
	return new Int(a.get().substring(0, offset+a.repLength() - b));


	// var alength = new Int(a.repLength());
	// alength = a.is_negative?Int_sub(alength,1):alength;
	// var shift_len = Int_sub(alength, b);
	// if(Int_lteq(shift_len, 0)) 
	// 	return new Int("z");
	// else {
	// 	var neg_offset = a.is_negative?1:0;
	// 	return new Int(Int_substr(a.get(), 0, Int_add(shift_len, neg_offset)));
	// }
}

// * operator
function Int_mul(a, b) {
	a = Int_convertToInt(a);
	b = Int_convertToInt(b);
	var sign = a.is_negative == b.is_negative?false:true;
	a.is_negative = false;
	b.is_negative = false;
	//base case
	if(a.data.length == 1 && b.data.length == 1) { 
		var upper_a = Math.floor(a.data[0] / 10000) // upper 5 bits a
		var upper_b = Math.floor(b.data[0] / 10000) // upper 5 bits b
		var lower_a = a.data[0] % 10000; 			// lower 4 bits a
		var lower_b = b.data[0] % 10000;			// lower 4 bits b

		var z0 = lower_a*lower_b;
		var z2 = upper_a*upper_b;
		var z1 = (upper_a+lower_a)*(upper_b+lower_b) - z2 - z0;


		//USE: INT_LS and INT_ADD instead of *10000 and + 
		if(sign)
			return Int_add(z2.toString()+Int.upper_shift_8, z1*10000 + z0).negate();
		return Int_add(z2.toString()+Int.upper_shift_8, z1*10000 + z0);
	}

	//a is base, but b is longer
	// a * b[1]b[2]...b[n] = 
	//		a * b[1]b[2]...b[n/2] * 10 ^ [n - n/2] + a * b[1 + n/2]b[2 + n/2]...b[n]
	else if (a.data.length == 1) {
		var bhalf = Math.floor(b.data.length/2);
		var bfront = new Int("z");
		var bfront_data = new Array(b.data.length - bhalf);
		var bback = new Int(b);

		for (var i = b.data.length - 1; i >= bhalf; --i) {
			bfront_data[i - bhalf] = bback.data[i];
			bback.data.pop(); // pop off upper half
		}
		bfront.data = bfront_data; // store upper half

		if (sign) 
			return Int_add(Int_ls(Int_mul(a, bfront), a.MAX_DIGITS * bhalf), Int_mul(a, bback)).negate();	
		return Int_add(Int_ls(Int_mul(a, bfront), a.MAX_DIGITS * bhalf), Int_mul(a, bback));
	}

	//b is base, but a is longer
	// b * a[1]a[2]...a[n] = 
	//		b * a[1]a[2]...a[n/2] * 10 ^ [n - n/2] + b * a[1 + n/2]a[2 + n/2]...a[n]
	else if (b.data.length == 1) {
		var ahalf = Math.floor(a.data.length/2)
		var afront = new Int("z");
		var afront_data = new Array(a.data.length - ahalf);
		var aback = new Int(a);

		for(var i = a.data.length - 1; i >= ahalf; --i) {
			afront_data[i - ahalf] = aback.data[i];
			aback.data.pop();
		}
		afront.data = afront_data;

		if (sign)
			return Int_add(Int_ls(Int_mul(afront, b), b.MAX_DIGITS * ahalf), Int_mul(aback, b)).negate();
		return Int_add(Int_ls(Int_mul(afront, b), b.MAX_DIGITS * ahalf), Int_mul(aback, b));
	} else {
		var ashift = Math.floor(a.data.length/2);
		var bshift = Math.floor(b.data.length/2);

		var a0 = new Int("z");
		var a1 = new Int(a);
		var a0_data = new Array(a.data.length - ashift);
		for(var i = a.data.length - 1; i >= ashift; --i) {
			a0_data[i - ashift] = a1.data[i];
			a1.data.pop();
		}
		a0.data = a0_data;

		var b0 = new Int("z");
		var b1 = new Int(b);
		var b0_data = new Array(b.data.length - bshift);
		for (var i = b.data.length - 1; i >= bshift; --i) {
			b0_data[i - bshift] = b1.data[i];
			b1.data.pop();
		}
		b0.data = b0_data;

		//console.log("calc z0", a0.get(), b0.get());
		var z0 = Int_mul(a1, b1);
		//console.log("calc z1", a0.get(), b0.get());
		var z1 = Int_ls(Int_mul(a1, b0), bshift*b.MAX_DIGITS);
		//console.log("calc z2", a0.get(), b0.get());
		var z2 = Int_ls(Int_mul(a0, b1), ashift*a.MAX_DIGITS);
		//console.log("calc z3", a0.get(), b0.get());
		var z3 = Int_ls(Int_mul(a0, b0), (ashift+bshift)*a.MAX_DIGITS);
		
		if (sign)
			return Int_add(z0, Int_add(z1, Int_add(z2, z3))).negate();
		return Int_add(z0, Int_add(z1, Int_add(z2, z3)));
	}

}

//Broken for:
//Int_div("73984793269475463275497326746983275092384693827945276497874893759834759", "893248327487329439827498732965439284903294786324693289").get()

function Int_reciprocol(a, n) {
	a = Int_convertToInt(a);
	//var areplength = a.repLength();
	var diff = new Int(1);
	var power = 0;
	var reciprocol = "";
	var dig = 0;
	var minlength = (n*2 < 4)?4:n*2;

	while((reciprocol.length < minlength) && !diff.is0()) {

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

function Int_round(a, p) {//will round to nearest integer
	a = Int_convertToInt(a);
	//we expect p to be a integer < arep.length

	var arep = a.get();
	//console.log(arep, p);
	var char = arep[arep.length-p]>"8"?1:0;
	return Int_add(Int_rs(a, p), char);
}


function Int_div_fast(a, b, getMod) {
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

	var div;
	if(a.repLength() > 3*b.repLength()) div = Int_div_fast;
	else div = Int_div_long;

	//console.log(div);

	var q = div(a, b, getMod);
	q.is_negative = sign;
	return q;

}


//select operator performance benchmarks
function performanceTest() {
	console.log("initializing performanceTest...");
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

	console.log("completed init");
	console.log("using following inputs:");
	console.log(a10,b10,a50,b50,a100,b100,a1000,b1000,a10000,b10000);
	console.log("starting performance tests...")
	//overall counter
	var overall1 = new Date();

	//ADD
	console.log("running add tests...");
	var add10_1 = new Date();
	Int_add(a10, b10);
	var add10_2 = new Date();
	console.log("\t10 digit add:\t\t\t",add10_2-add10_1);
	var add50_1 = new Date();
	Int_add(a50, b50);
	var add50_2 = new Date();
	console.log("\t50 digit add:\t\t\t",add50_2-add50_1);
	var add100_1 = new Date();
	Int_add(a100, b100);
	var add100_2 = new Date();
	console.log("\t100 digit add:\t\t\t",add100_2-add100_1);
	var add1000_1 = new Date();
	Int_add(a1000, b1000);
	var add1000_2 = new Date();
	console.log("\t1000 digit add:\t\t\t",add1000_2-add1000_1);
	var add10000_1 = new Date();
	Int_add(a10000, b10000);
	var add10000_2 = new Date();
	console.log("\t10000 digit add:\t\t",add10000_2-add10000_1);

	var addcontrast_1 = new Date();
	Int_add(a10000, b10);
	var addcontrast_2 = new Date();
	console.log("\t10000 digit add:\t\t",addcontrast_2-addcontrast_1);

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
	Int_lt(a10, b10);
	var lt10_2 = new Date();
	console.log("\t10 digit lt:\t\t\t",lt10_2-lt10_1);
	var lt50_1 = new Date();
	Int_lt(a50, b50);
	var lt50_2 = new Date();
	console.log("\t50 digit lt:\t\t\t",lt50_2-lt50_1);
	var lt100_1 = new Date();
	Int_lt(a100, b100);
	var lt100_2 = new Date();
	console.log("\t100 digit lt:\t\t\t",lt100_2-lt100_1);
	var lt1000_1 = new Date();
	Int_lt(a1000, b1000);
	var lt1000_2 = new Date();
	console.log("\t1000 digit lt:\t\t\t",lt1000_2-lt1000_1);
	var lt10000_1 = new Date();
	Int_lt(a10000, b10000);
	var lt10000_2 = new Date();
	console.log("\t10000 digit lt:\t\t\t",lt10000_2-lt10000_1);

	var overall2 = new Date();
	console.log("overall performance:", overall2-overall1);
	console.log("finished");
}



function randstr(n) { //expecting positve non-zero
	var str = "";
	for(var i = 0; i < n; i++) 
		str += Int.digits[Math.floor(Math.random()*10)];

	var z = 0;
	while(str[z] == "0") ++z;

	str = str.substring(z);
	while(z-- > 0) {
		str += Int.digitsNoZero[Math.floor(Math.random()*9)];
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
	 	case "x":
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

// performanceTest();