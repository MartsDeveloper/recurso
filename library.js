var refreshId;

function $(a) {
	return document.getElementById(a)
}

function http() {
	if (window.XMLHttpRequest) {
		return new XMLHttpRequest()
	} else {
		try {
			return new ActiveXObject("Microsoft.XMLHTTP")
		} catch (a) {
			alert("nop");
			return null
		}
	}
}
String.prototype.tratarResponseText = function() {
	var d = /<script[^>]*>([\S\s]*?)<\/script[^>]*>/ig;
	var e = /\bsrc=[^>\s]+\b/g;
	var f = this.match(d) || [];
	for (i = 0; i < f.length; i++) {
		var c = document.createElement("script");
		c.type = "text/javascript";
		var b = f[i].match(e) || [];
		if (b.length) {
			c.src = b[0].split("'").join("").split('"').join("").split("src=").join("").split(" ").join("")
		} else {
			var a = f[i].replace(d, "$1", "");
			c.text = a
		}
		document.getElementsByTagName("body")[0].appendChild(c)
	}
	return this.replace(d, "")
};

function SetContainerHTML(a, b) {
	$(a).innerHTML = b.tratarResponseText()
}

function LoadPage(a, b) {
	var c = new http();
	b += "&random=" + Math.random();
	c.open("GET", b, true);
	c.onreadystatechange = function() {
		if (c.readyState == 4) {
			if (c.status == 200) {
				SetContainerHTML(a, c.responseText);
				c.onreadystatechange = null
			}
		}
	};
	c.send(null)
}

function LoadHash(a) {
	if (a != undefined) {
		var b = navigator.userAgent.toLowerCase();
		if (b.indexOf("chrome") > 0 || b.indexOf("safari") > 0) {
			location.href = "#" + a
		} else {
			window.location.hash = "#" + a
		}
	}
}

function Resize() {
	parent.$("Contents").style.height = "auto"
}

function FillMeters(c, b) {
	var a = parent.$("Meters");
	a.innerHTML = c + " / " + b;
	HiddeFlag()
}

function ShowWorking() {
	LoadHash("TopPage");
	parent.$("a").style.visibility = "visible"
}

function UploadFile() {
	ShowWorking();
	clearInterval(refreshId);
	refreshId = setInterval(RefreshStatus, 15000)
}

function Request(b, a) {
	ShowWorking();
	if (a == null) {
		a = ""
	}
	LoadPage("Contents", ".?id=" + b + a);
	Resize()
}

function Download(a) {
	window.location.href = ".?id=Download&file=" + a
}

function Post(e, d) {
	var a = new http();
	a.open("POST", ".", true);
	a.onreadystatechange = function() {
		if (a.readyState == 4) {
			if (a.status == 200) {
				SetContainerHTML("Contents", a.responseText);
				a.onreadystatechange = null
			}
		}
	};
	a.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	var c = "id=" + e;
	for (i = 1; i < arguments.length; i++) {
		var b = $(arguments[i]);
		c += "&" + arguments[i] + "=" + b.value
	}
	ShowWorking();
	a.send(c);
	Resize()
}

function StartRefreshStatus() {
	RefreshStatus();
	refreshId = setInterval(RefreshStatus, 10000)
}

function RefreshStatus() {
	try {
		LoadPage("Status", ".?status=1")
	} catch (a) {
		parent.$("Status").innerHTML = "Idle"
	}
}

function ShowFlag() {
	parent.$("Flag").style.visibility = "visible"
}

function HiddeFlag() {
	parent.$("Flag").style.visibility = "hidden"
}

function CatchMetersGroup() {
	var d;
	var a = "";
	var c = document.getElementById("MeterTable");
	var b = 1;
	while (c.getElementsByTagName("tr")[b] != null) {
		d = c.getElementsByTagName("tr")[b];
		if (d.getElementsByTagName("td")[0].getElementsByTagName("input")[0].checked == true) {
			a += d.getElementsByTagName("td")[1].innerHTML;
			a += ","
		}
		b++
	}
	document.getElementById("Report").value = a
}

function SelectAll(b) {
	var a = 1;
	var d;
	var c = document.getElementById("MeterTable");
	while (c.getElementsByTagName("tr")[a] != null) {
		d = c.getElementsByTagName("tr")[a];
		d.getElementsByTagName("td")[0].getElementsByTagName("input")[0].checked = b.checked;
		a++
	}
};