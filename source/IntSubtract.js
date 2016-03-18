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