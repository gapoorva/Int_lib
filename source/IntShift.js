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
}