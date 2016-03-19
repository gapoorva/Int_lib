// + operator
function Int_add(a, b) {
	//console.log("inside add");

	a = Int_convertToInt(a);
	b = Int_convertToInt(b);

	// console.log("a :", a.get(), a.data)
	// console.log("b :", b.get(), b.data)

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
		carry = (sum >= Int.MAX_UNIT)?1:0;
	}
	while(match < a.data.length) {
		 var sum = a.data[match++] + carry;
		 ans.data.push(sum % Int.MAX_UNIT);
		 carry = (sum >= Int.MAX_UNIT)?1:0;
		 while (carry == 0 && match < a.data.length)
		 	ans.data.push(a.data[match++])
	}
	while(match < b.data.length) {
		var sum = b.data[match++] + carry;
		ans.data.push(sum % Int.MAX_UNIT);
		carry = (sum >= Int.MAX_UNIT)?1:0;
		while (carry == 0 && match < a.data.length)
		 	ans.data.push(a.data[match++])
	}
	if(carry > 0) {
		ans.data.push(carry);
	}
	ans.is_negative = sign;
	//console.log("return:", ans.get(), ans.data);
	return ans;
}

// Summation operator
function Int_sum(array) {
	var sum = new Int("z");
	for(var i = 0; i < array.length; ++i) 
		sum = Int_add(sum, array[i]);
	return sum;
}