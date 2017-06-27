var checked, lines, currline, tmpline, interval = false, callstack, callpointer, datastack, datapointer, luacode, luamode;
var luaDelimiter = 0, luaEscaping = 0;
var LuaScript2 = luajs.newContext();
LuaScript2.loadStdLib();
LuaScript2._G.stringMap.io.stringMap.write = function (val) {
	$("code3").value += val;
}
LuaScript2._G.stringMap.parentEval = function (val) {
	return myEval(val);
}
function check1 () {
	checked = $("code1").value.split(/\r?\n/);
	lines = checked.length;
	currline = 0;
	userv = {};
	callstack = [], callpointer = 0, datastack = [], datapointer = 0;
	$("code2").value = getdebug();
	clear3();
	luamode = false;
}
function step2 () {
	function checkBeginBracket(str, pos, tlen, iscomment)
	{
		var lev = 2;
		do {
			pos++;
			lev++;
		}
		while (str[pos] === "=");
		if (str[pos] === "[")
			luaDelimiter = lev;
		else
			pos = (iscomment ? tlen : pos-1);
		return pos;
	}
	var tmp, tmp2 = "", charpos = 0, charlen;
	tmpline = currline;
	if (!luamode)
	{
		do {
			tmp = checked[tmpline++];
			tmp2 += tmp + "\n";
		} while (tmp.match(/\\*$/)[0].length % 2 === 1);
		myEval(tmp2);
	}
	else
	{
		tmp = checked[tmpline++];
		luaEscaping = false;
		for (charlen = tmp.length; charpos < charlen; charpos++)
		{
			switch (luaDelimiter)
			{
			case 0: // blank mode (main)
				switch (tmp[charpos])
				{
				case "'": 
					luaDelimiter = 1;
					break;
				case '"': 
					luaDelimiter = 2;
					break;
				case "-":
					if (tmp[++charpos] === "-")
					{
						charpos = (tmp[++charpos] !== "[" ? charlen : checkBeginBracket(tmp, charpos, charlen, 1));
					}
					break;
				case "[":
					charpos = checkBeginBracket(tmp, charpos, null, 0);
					break;
				}
				break;
			case 1: // ' 
			case 2: // "
				if (!luaEscaping)
				{
					if (tmp[charpos] === "\\")
					{
						luaEscaping = 1;
					}
					else if (luaDelimiter === 1 ? "'" : '"')
					{
						luaDelimiter = 0;
					}
				}
				else
				{
					luaEscaping = 0;
				}
				break;
			default: // [[ ]], [=[ ]=], etc.
				if (luaEscaping)
				{
					if (tmp[charpos] === "=")
						luaEscaping ++;
					else if (tmp[charpos] === "]")
					{
						if (luaEscaping === luaDelimiter)
							luaDelimiter = 0;
						luaEscaping = 0;
					}
				}
				else if (tmp[charpos] === "]")
				{
					luaEscaping = 3
				}
			}
		}
		if (luaDelimiter || !tmp.match(/^\s*luaEnd\s*\(\s*\)\s*(;\s*)?$/))
		{
			luacode += tmp + "\n";
		}
		else
		{
			luamode = false;
			LuaScript2.loadString(luacode)();
			luacode = null;
		}
	}
	currline = tmpline;
	$("code2").value = getdebug();
}
function auto2 () {
	step2 ();
	interval && requestAnimationFrame(auto2);
}
function clear3 () {
	$("code3").value = "";
}
function getdebug () {
	var s = "";
	for (var i = 0; i < lines; i++) {
		s += (currline === i ? "> " : "  ") + checked[i] + "\n";
	}
	return s;
}

!function (vtable) {
	vtable.Vnprint = function (x) {
		$("code3").value += x;
	}
	vtable.Vnprint.fquote = false;
	vtable.Vnprint._cook = -1;
	
	vtable.Vnclear = function (x) {
		$("code3").value = "";
	}
	vtable.Vnclear.fquote = false;
	vtable.Vnclear._cook = -1;
	
	vtable.Vniif = function (x, y, z) {
		return x ? y : z;
	}
	vtable.Vniif.fquote = false;
	vtable.Vniif._cook = -1;
	
	vtable.Vnjump = function (x) {
		tmpline = currline + x;
	}
	vtable.Vnjump.fquote = false;
	vtable.Vnjump._cook = -1;
	
	vtable.Vnjumpcond = function (x, cond) {
		cond && (tmpline = currline + x);
	}
	vtable.Vnjumpcond.fquote = false;
	vtable.Vnjumpcond._cook = -1;
	
	vtable.Vnabsjump = function (x) {
		tmpline = x;
	}
	vtable.Vnabsjump.fquote = false;
	vtable.Vnabsjump._cook = -1;
	
	vtable.Vnabsjumpcond = function (x, cond) {
		cond && (tmpline = x);
	}
	vtable.Vnabsjumpcond.fquote = false;
	vtable.Vnabsjumpcond._cook = -1;
	
	vtable.Vnpause = function (x, cond) {
		interval = false;
	}
	vtable.Vnpause.fquote = false;
	vtable.Vnpause._cook = -1;
	
	vtable.Vncall = function (x) {
		callstack[callpointer++] = tmpline, tmpline = currline + x;
	}
	vtable.Vncall.fquote = false;
	vtable.Vncall._cook = -1;
	
	vtable.Vncallcond = function (x, cond) {
		cond && (callstack[callpointer++] = tmpline, tmpline = currline + x);
	}
	vtable.Vncallcond.fquote = false;
	vtable.Vncallcond._cook = -1;
	
	vtable.Vnabscall = function (x) {
		callstack[callpointer++] = tmpline, tmpline = x;
	}
	vtable.Vnabscall.fquote = false;
	vtable.Vnabscall._cook = -1;
	
	vtable.Vnabscallcond = function (x, cond) {
		cond && (callstack[callpointer++] = tmpline, tmpline = x);
	}
	vtable.Vnabscallcond.fquote = false;
	vtable.Vnabscallcond._cook = -1;
	
	vtable.Vnmodline = function (x, y) {
		var tmp = currline + +x;
		if (tmp <= lines) {
			for (var i = lines; i < tmp; i++) {
				checked[i] = ""
			}
			lines++;
		}
		checked[tmp] = "" + y;
	}
	vtable.Vnmodline.fquote = false;
	vtable.Vnmodline._cook = -1;
	
	vtable.Vnabsmodline = function (x, y) {
		if (x <= lines) {
			for (var i = lines; i < x; i++) {
				checked[i] = ""
			}
			lines++;
		}
		checked[x] = "" + y;
	}
	vtable.Vnabsmodline.fquote = false;
	vtable.Vnabsmodline._cook = -1;
	
	vtable.Vnret = vtable.Vnreturn = function () {
		tmpline = callstack[--callpointer];
	}
	vtable.Vnret.fquote = false;
	vtable.Vnret._cook = -1;
	
	vtable.Vnmod = vtable.Vnmodulo = function (x, y) {
		return x % y;
	}
	vtable.Vnmod.fquote = false;
	vtable.Vnmod._cook = -1;
	
	vtable.Vnassign = function (x, y) {
		userv["Vn" + x] = y;
	}
	vtable.Vnassign.fquote = false;
	vtable.Vnassign._cook = -1;
	
	vtable.Vnpush = function () {
		for (var i = 0, len = arguments.length; i < len; ++i) {
			datastack[datapointer++] = userv[arguments[i]];
		}
	}
	vtable.Vnpush.fquote = false;
	vtable.Vnpush._cook = -1;
	
	vtable.Vnpop = function () {
		for (var i = 0, len = arguments.length; i < len; ++i) {
			userv[arguments[i]] = datastack[--datapointer];
		}
	}
	vtable.Vnpop.fquote = false;
	vtable.Vnpop._cook = -1;
	
	vtable.VnevalLua = function (luaCode) {
		LuaScript2.loadString(luaCode)();
	}
	vtable.VnevalLua.fquote = false;
	vtable.VnevalLua._cook = -1;
	
	vtable.VnluaBegin = function () {
		luacode = "";
		luamode = true;
	}
	vtable.VnluaBegin.fquote = false;
	vtable.VnluaBegin._cook = -1;
} (vtable);
