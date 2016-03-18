// % operator
function Int_mod(a, b) {
	// a = q*b + r
	// we want to get r from this equation
	// r = a - q*b
	// naive solution: sub(a, mul(divide(a,b), b))
	a = Int_convertToInt(a);
	b = Int_convertToInt(b);
	var mod = Int_div(a, b, true);
	console.log(a.is_negative);
	if(a.is_negative) {
		mod = Int_sub(b, mod);
	}
	return mod;
}

function Int_pow(a, b) {
	a = Int_convertToInt(a);
	b = Int_convertToInt(b);


}