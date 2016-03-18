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