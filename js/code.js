const urlBase = 'http://nteaman_instance1.natalieteaman.site';
const api = '/LAMPAPI';
const extension = 'php';
// Set to "" later
const testBranch = '/test/POOSD-PROJECT-1';

let userId = 0;
let firstName = "";
let lastName = "";

function doLogin()
{
	userId = 0;
	firstName = "";
	lastName = "";
	
	let login = document.getElementById("loginName").value;
	let password = document.getElementById("loginPassword").value;
//	var hash = md5( password );
	
	//document.getElementById("loginResult").innerHTML = "";

	let tmp = {login:login,password:password};
//	var tmp = {login:login,password:hash};
	let jsonPayload = JSON.stringify( tmp );
	
	let url = urlBase + testBranch + api + '/Login.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse( xhr.responseText );
				userId = jsonObject.id;
				//console.log(userId);

				if( userId < 1 )
				{		
					//document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
					showToast("User/Password combination incorrect");
					return;
				}
		
				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				saveCookie();
	
				window.location.href = "Landingpage.html";
				//console.log(userId);

			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		//document.getElementById("loginResult").innerHTML = err.message;
	}

}

function saveCookie()
{
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie()
{
	userId = -1;
	let data = document.cookie;
	let splits = data.split(",");
	for(var i = 0; i < splits.length; i++) 
	{
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");
		if( tokens[0] == "firstName" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}
	}
	
	if( userId < 0 )
	{
		window.location.href = "index.html";
	}
	else
	{
//		document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
	}
}

function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}

function addContact()
{
	let name = document.getElementById("firstname").value + " " + document.getElementById("lastname").value;
	let phone = document.getElementById("phone").value;
	let email = document.getElementById("email").value;

	let phoneRegex = /^\d{3}-\d{3}-\d{4}$/;
	
	if(!name || !phone || !email) {
		showToast("Please fill in all fields");
		return;
	}

	if (!phoneRegex.test(phone)) {
		console.log("Phone messed up");
		showToast("Please enter in format of ###-###-####");
        	return;
    	}

	let tmp = {name:name,phone:phone,email:email,userId:userId};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + testBranch + api + '/AddContact.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				//document.getElementById("colorAddResult").innerHTML = "Color has been added";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		//document.getElementById("colorAddResult").innerHTML = err.message;
	}

	showToast("Contact successfully added!");
	
}


function searchTable()
{
	console.log(userId);
	
	let search = document.getElementById("searchInput").value;
	
	let colorList = "";

	let tmp = {search:search,userId:userId};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + testBranch + api + '/SearchContacts.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	//console.log(jsonPayload);
	
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				//console.log(JSON.stringify( xhr.responseText ));
				
				let jsonObject = JSON.parse( xhr.responseText );

				let table = document.getElementById('myTable');
				//table.getElementsByTagName('tbody')[0].innerHTML = "";

				let bodyRef = document.getElementById('myTable').getElementsByTagName('tbody')[0];
				bodyRef.innerHTML = '';
				
				for( let i=0; i<jsonObject.name.length; i++ )
				{
					
					let newRow = document.createElement('tr');
					newRow.id = jsonObject.id[i];

					let cell0 = document.createElement('td'); 
					cell0.textContent = i + 1; 
					newRow.appendChild(cell0); 
					
					let cell1 = document.createElement('td'); 
					cell1.textContent = jsonObject.name[i]; 
					newRow.appendChild(cell1); 
 
					let cell2 = document.createElement('td'); 
					cell2.textContent = jsonObject.phone[i]; 
					newRow.appendChild(cell2); 
 
					let cell3 = document.createElement('td'); 
					cell3.textContent = jsonObject.email[i]; 
					newRow.appendChild(cell3); 

					let cell4 = document.createElement('td'); 
					cell4.innerHTML = '<button class="edit-button" onclick="editContact(this)" >Edit</button>';
					newRow.appendChild(cell4);

					let cell5 = document.createElement('td'); 
					cell5.innerHTML = '<button class="delete-button" onclick="deleteContact(this)">Delete</button>';
					newRow.appendChild(cell5); 
 
					// Append the new row to the table 
					bodyRef.appendChild(newRow); 
				}
				
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		console.log("Big error");
	}
	
}

function editContact(row) {
	let id = row.parentNode.parentNode.id;
	let name = row.parentNode.parentNode.getElementsByTagName('td')[1].innerHTML;
	let phone = row.parentNode.parentNode.getElementsByTagName('td')[2].innerHTML;
	let email = row.parentNode.parentNode.getElementsByTagName('td')[3].innerHTML;
	
	let table = document.getElementById('myTable');
	let ind = row.parentNode.parentNode.rowIndex + 1;
	let newRow = table.insertRow(ind);

	newRow.insertCell(0);
	let newCell = newRow.insertCell(1);

  	// Append a text node to the cell
  	let newText = document.createElement('input');
	newText.type = "text";
	newText.id = "nameField";
	newText.placeholder = "Enter new name here...";
  	newCell.appendChild(newText);

	newCell = newRow.insertCell(2);

  	// Append a text node to the cell
  	newText = document.createElement('input');
	newText.type = "text";
	newText.id = "phoneField";
	newText.placeholder = "Enter new phone number here...";
  	newCell.appendChild(newText);

	newCell = newRow.insertCell(3);

  	// Append a text node to the cell
  	newText = document.createElement('input');
	newText.type = "text";
	newText.id = "emailField";
	newText.placeholder = "Enter new email here...";
  	newCell.appendChild(newText);

	newRow.insertCell(4);
	newCell = newRow.insertCell(5);

  	// Append a text node to the cell
  	newText = document.createElement('BUTTON');
	newText.type = "button";
	newText.class="edit-button";
	newText.id = "confirmButton";
	newText.innerHTML = "Confirm!";
	newText.onclick = function(){sendUpdate(id, name, phone, email);};
	newCell.appendChild(newText);

	


}

function sendUpdate(id, name, phone, email) {

	if (document.getElementById("nameField").value){
		console.log("Name not blank");
		name = document.getElementById("nameField").value;
	}
	if (document.getElementById("phoneField").value) {
		console.log("Phone not blank");
		phone = document.getElementById("phoneField").value;
	}
	if (document.getElementById("emailField").value) {
		console.log("Email not blank");
		email = document.getElementById("emailField").value;
	}

	let tmp = {name:name, phone:phone, email:email, id:id, userId:userId};
	let jsonPayload = JSON.stringify( tmp );
	console.log(jsonPayload);

	let url = urlBase + testBranch + api + '/UpdateContact.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				searchTable();
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		//document.getElementById("colorAddResult").innerHTML = err.message;
	}
}

function deleteContact(row) {
    
	
	let name = row.parentNode.parentNode.getElementsByTagName('td')[1].innerHTML;

	let id = row.parentNode.parentNode.id;
	

	if(!confirm("You are about to delete " + name + " from your contacts. \nPress OK to confirm.")) return;

	let tmp = {id:id,userId:userId};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase +testBranch + api + '/DeleteContact.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				console.log(JSON.stringify( xhr.responseText ));
				searchTable();
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		//document.getElementById("colorAddResult").innerHTML = err.message;
	}
	
};

function logout() {
	userId = 0;
	firstName = "";
	lastName = "";
	saveCookie();
	window.location.href = "index.html";
}

function goDashboard(){
	window.location.href = "Landingpage.html";
}

function showToast(msg) {
    let toast = document.getElementById('toast');
	toast.innerHTML = msg;
	console.log("Message:");
	console.log(msg);
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 5000);
}
