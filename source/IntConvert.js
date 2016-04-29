//returns Int representation of Hex number
function Int_fhx(hexstring) {
	//var multiplier = new Int(1);
	var num = new Int(parseInt(hexstring[0], 16));
	for(var i = 1; i < hexstring.length; ++i) {
		num = Int_mul(num, 16);
		num = Int_add(num, parseInt(hexstring[i], 16));
	}
	return num;
}

function Int_thx(i) {
	i = Int_convertToInt(i);
	var div = {"q":i, "r":0};
	var h = "0123456789ABCDEF";
	var hexstring = [];

	while(Int_neq((div = Int_div(div.q, 16, false, true)).q, 0)) 
		hexstring.push(h[parseInt(div.r.get())]);
	
	hexstring.push(h[parseInt(div.r.get())]);

	if(hexstring.length % 2 == 1) hexstring.push("0");

	return (hexstring = hexstring.reverse()).join("");
}