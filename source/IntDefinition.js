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

	//compute 9's complement
	for (var i in this.data) 
		cmplt.data[i] = cmplt.data[i] - this.data[i];
	return Int_add(cmplt, 1);
}

//INT CLASS HELPERS

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

//rounds to nearest integer when int is in form I*10^(-p)
//required that p is positive
function Int_round(a, p) {//will round to nearest integer
	if (p==0) return a;
	a = Int_convertToInt(a);
	//we expect p to be a integer < arep.length

	var arep = a.get();
	//console.log(arep, p);
	var char = arep[arep.length-p]>"4"?1:0;
	return Int_add(Int_rs(a, p), char);
}