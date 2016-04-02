// % operator
function Int_mod(a, b) {
	// a = q*b + r
	// we want to get r from this equation
	// r = a - q*b
	// naive solution: sub(a, mul(divide(a,b), b))
	a = Int_convertToInt(a);
	b = Int_convertToInt(b);
	var mod = Int_div(a, b, true);
	//console.log(a.is_negative);
	if(a.is_negative) {
		mod = Int_sub(b, mod);
	}
	return mod;
}

function Int_pow(a, b) {
	a = Int_convertToInt(a);
	b = Number(b);

	if(b < 0) return new Int("z");
	if(b == 0) return new Int(1);

	var e = 1;
	var cmp = [];
	cmp.push(new Int(a));

	while(e*2 <= b) {
		e *= 2;
		cmp.push(Int_mul(cmp[cmp.length-1], cmp[cmp.length-1]));
	}

	//if (e == b) 

	var rem = b - e;
	var product = cmp[cmp.length-1];
	while(rem > 0) {
		var i = 0;
		var p = 1;
		while(p*2 <= rem) {
			p += p;
			i++;
		}
		product = Int_mul(product, cmp[i]);
		rem -= p;
	}

	return product;

	//compute a to the power b...
	// a*a = a^2
}

function Int_mde(base, exponent, modulus) {
	base = Int_convertToInt(base);
	modulus = Int_convertToInt(modulus);
	//convert exponent to base 2 assuming exponent < (2 ** 53)
	var expb = exponent.toString(2);
	if (Int_eq(modulus, 1)) return new Int(0);
	var result = new Int(1);
	base = Int_mod(base, modulus);
	for(var i = expb.length-1; i >=0; --i) {
		if(expb[i] == '1') 
			result = Int_mod(Int_mul(result, base), modulus);
		base = Int_mod(Int_mul(base, base), modulus);
	}
	return result;
}

