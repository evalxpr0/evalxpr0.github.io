var vtable = {}, userv = {};
vtable.Vnquote = function (x) {return x};
vtable.Vnquote.fquote = true;
vtable.Vnquote._cook = -1;
vtable.Vneval = function (x) {return myEval(x)};
vtable.Vneval.fquote = false;
vtable.Vneval._cook = -1;
vtable.Vnident = function (x) {return x};
vtable.Vnident.fquote = false;
vtable.Vnident._cook = -1;
vtable.Vnraw = function (x) {return x};
vtable.Vnraw.fquote = false;
vtable.Vnraw._cook = 0;
vtable.Vncook = function (x) {return x};
vtable.Vncook.fquote = false;
vtable.Vncook._cook = 1;
vtable.Vntemplate = function (x) {return x};
vtable.Vntemplate.fquote = false;
vtable.Vntemplate._cook = 2;

function myEval (expr) {
	expr = (expr+"").split("");
	var delarr = [0,"]",0,"[",")","(",">",0,"<",0,0,0,0,0,0,"}",0,"{"];
	var opm = true, ns = [], np = -1, os = [], op = -1, ps = [1], pp = 0, nest, _looping,
	tmp, tmp2, tmp3, tmp4, delim, delim2, quoting = false, variables = [], cookstr = 1;

	function _fcall () {
		var _tmp = 1;
		if (op >= 0) {
			switch (os[op]) {
				case 0:
					opm && ps[pp]--; np -= (_tmp = ps[pp--]) - 1; op--
				break;
				case 16:
					opm && (ns[++np] = null);
					cookstr = os[--op];
					nest = os[--op];
					delim2 = os[--op];
					delim = os[--op]; op--;
					tmp2 = ns[--np] + ns[1 + np--];
					quoting = true;
				return;
			}
		}
		_fcall2 (_tmp);
	}
	
	function _fcall2 (_tmp) {
		if (op >= 0 && os[op] === 9) {
			ns[np - 1] = ns[np - 1].apply(null, ns.slice(np, np + _tmp));
			cookstr = os[--op]; op--; np--
		}
	}

	function _compare () {
		// var tmp;
		_concat();
		switch (op >= 0 && os[op]) {
			case 10:
				--op; --np;
				ns[np] = ns[np] <= ns[np + 1];
			break;
			case 11:
				--op; --np;
				ns[np] = ns[np] < ns[np + 1];
			break;
			case 12:
				--op; --np;
				ns[np] = ns[np] === ns[np + 1];
			break;
			case 13:
				--op; --np;
				ns[np] = ns[np] >= ns[np + 1];
			break;
			case 14:
				--op; --np;
				ns[np] = ns[np] > ns[np + 1];
			break;
			case 15:
				--op; --np;
				ns[np] = ns[np] !== ns[np + 1];
			break;
		}
	}
	function _concat () {
		_plus();
		if (op >= 0 && os[op] === 2) {
			--op; --np; ns[np] = "" + ns[np] + ns[np + 1];
		}
	}
	function _plus () {
		_multi();
		switch (op >= 0 && os[op]) {
			case 3:
				--op; --np;
				ns[np] = +ns[np] + +ns[np + 1];
			break;
			case 5:
				--op; --np;
				ns[np] = ns[np] - ns[np + 1];
			break;
		}
	}
	function _multi () {
		_sign();
		switch (op >= 0 && os[op]) {
			case 6:
				--op; --np;
				ns[np] = ns[np] * ns[np + 1];
			break;
			case 7:
				--op; --np;
				ns[np] = ns[np] / ns[np + 1];
			break;
		}
	}
	function _sign () {
		var _looping = true
		while (op >= 0 && _looping) {
			switch (os[op]) {
				case 1:
					--op; ns[np] = +ns[np];
				break;
				case 4:
					--op; ns[np] = -ns[np];
				break;
				case 8:
					--op; --np; ns[np] = Math.pow(ns[np], ns[np + 1]);
				break;
				default:
					_looping = false;
			}
		}
	}
	var prevptr = 0, tmp2 = "";
	for (var z = 0, len = expr.length; z < len; z++) {
		tmp = expr[z];
		if (tmp === ":" && expr[++z] === "=") {
			prevptr = z + 1;
			variables.push(tmp2);
			tmp2 = "";
		} else if (/\s/.test(tmp)) ;
		else if (/[$\w]/.test(tmp)) {
			tmp2 += tmp;
		} else break;
	}
	z = prevptr;
	// debugger;
	while (z < len) {
		// if (debugging) { debugger; }
		if (quoting) {
			_looping = true;
			while (z < len && _looping) {
				tmp = expr[z++];
				if (delim2 === tmp) {
					nest--;
					if (nest <= 0) {
						quoting = false; break;
					}
					tmp2 += tmp;
				} else switch (tmp) {
					case delim: tmp2 += tmp; nest++; break;
					case "\\": tmp = expr[z++];
					if (cookstr === 0) tmp2 += "\\" + tmp; else switch (tmp) {
						case "\n": break;
						case "0": tmp2 += "\x00"; break;
						case "n": tmp2 += "\n"; break;
						case "s": tmp2 += " "; break;
						case "t": tmp2 += "\t"; break;
						case "u": tmp2 += String.fromCharCode(parseInt(expr[z++]+expr[z++]+expr[z++]+expr[z++], 16));
						default: tmp2 += tmp;
					}
					break;
					case "$":
						if (cookstr === 2 && expr[z] === "(") {
							z++;
							os[++op] = delim; os[++op] = delim2; os[++op] = nest; os[++op] = cookstr; os[++op] = 16; _looping = quoting = false; opm = true; cookstr = 1;
						} else {
							tmp2 += tmp;
						}
					break;
					default: tmp2 += tmp;
				}
			}
			ns[++np] = tmp2;
			_looping && (opm = false, _fcall2(1));
		} else {
			switch (tmp = expr[z]) {
				case "(":
					if (!opm) {
						os[++op] = cookstr; os[++op] = 9; tmp4 < 0 || (cookstr = tmp4); // z++;
					}
					ns[np + 1] = null; os[++op] = 0; ps[++pp] = 1; z++;
					opm = true;
				break;
				case ")":
					_compare(); _fcall(); z++; opm = false;
				break;
				case "+":
					if (opm) {
						os[++op] = 1; z++;
					} else {
						if (expr[++z] === ">") {
							_concat(); os[++op] = 2; z++;
						} else {
							_plus(); os[++op] = 3;
						}
						opm = true;
					}
				break;
				case "-":
					if (opm) {
						os[++op] = 4; z++;
					} else {
						_plus(); os[++op] = 5; z++; opm = true;
					}
				break;
				case "*":
					_multi(); os[++op] = 6; z++; opm = true;
				break;
				case "/":
					_multi(); os[++op] = 7; z++; opm = true;
				break;
				case "<":
					_compare();
					if (expr[++z] === "=") {
						os[++op] = 10; z++;
					} else {
						os[++op] = 11;
					}
					opm = true;
				break;
				case "~":
					if (expr[++z] === "=") {
						os[++op] = 15; z++;
					} else {
						throw "Unexcepted ~";
					}
				break;
				case "=":
					_compare(); os[++op] = 12; z++; opm = true;
				break;
				case ">":
					_compare();
					if (expr[++z] === "=") {
						os[++op] = 13; z++;
					} else {
						os[++op] = 14;
					}
				break;
				case "^":
					os[++op] = 8; z++; opm = true;
				break;
				case '"': case "'":
					quoting = true; z++; delim = delim2 = tmp, nest = 1, tmp2 = "";
				break;
				case ",":
					_compare();
					ns[np + 1] = null;
					opm && np++;
					ps[pp]++;
					z++; opm = true;
				break;
				case ";":
					z = len;
				break;
				case "\n": case "\r": case "\t": case "\\": case " ": ++z; break;
				case "0": case "1": case "2": case "3": case "4": 
				case "5": case "6": case "7": case "8": case "9": 
				case ".":
					tmp2 = tmp; z++; 
					while (z < len && /[0-9.eE]/.test(tmp = expr[z])) {
						tmp2 += tmp;  
						if (tmp === "e" || tmp === "E") {
							tmp2 += expr[++z];
						}
						z++;
					}
					ns[++np] = +tmp2; opm = false;
				break;
				default:
					// debugger;
					if (!/[$\w]/.test(tmp)) { throw "Syntax Error"; }
					tmp2 = tmp; z++;
					while (z < len && /[$\w]/.test(tmp = expr[z])) tmp2 += tmp, z++;
					while (z < len && /\s/.test(tmp = expr[z])) z++;
					ns[++np] = (tmp3 = userv["Vn" + tmp2]) == null ? (tmp3 = vtable["Vn" + tmp2]) : tmp3;
					tmp3 != null && (tmp4 = tmp3._cook, tmp3.fquote && (
						delim = tmp, delim2 = /[\(\)\[\]\{\}<>]/.test(delim) ? delarr[delim.charCodeAt(0) % 18] : delim,
						quoting = true, nest = 1, os[++op] = cookstr, os[++op] = 9, tmp4 < 0 || (cookstr = tmp4),
						tmp2 = "", z++
					));
					opm = false;
			}
		}
	}
	// if (debugging) { debugger; }
	_compare();
	// if (debugging) { debugger; }
	for (z = 0, len = variables.length; z < len; z++) {
		userv["Vn" + variables[z]] = ns[0];
	}
	return ns[0];
}
