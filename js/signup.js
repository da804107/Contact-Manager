
function doSignup() {
	userId = 0;
	//let flag = true;
		
	firstName = document.getElementById("firstname").value;
	lastName = document.getElementById("lastname").value;
	let login = document.getElementById("username").value;
	let password = document.getElementById("password").value;
	
	if ( !(firstName && lastName && login && password) ) {
		showToast("Please fill in all fields");
		console.log("Blank!");
		return;
	}	

	let tmp = { firstName: firstName, lastName: lastName, login: login, password: password };
	let jsonPayload = JSON.stringify(tmp);

	let url = urlBase + testBranch + api + '/AddUser.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try {
		xhr.onreadystatechange = function () {
			if (this.readyState == 4 && this.status == 200) {

				let jsonObject = JSON.parse( xhr.responseText );

				if(jsonObject.error && jsonObject.error === "Login already exists."){
					showToast("Username already exists! Please create a different one.");
					return;
				}

				userId = jsonObject.id;

				console.log(userId);

				saveCookie();
				
				window.location.href = "Landingpage.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch (err) {
		console.log(err);
	}

}
