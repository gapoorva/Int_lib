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