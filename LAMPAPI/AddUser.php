<?php
    $inData = getRequestInfo();

    $firstName = $inData["firstName"];
    $lastName = $inData["lastName"];
    $login = $inData["login"];
    $password = $inData["password"];

    $conn = new mysqli("localhost", "daisy", "SPOoks0219!!", "SMALLPROJ");
    if($conn->connect_error)
    {
        returnWithError( $conn->connect_error );
    }
    else{
			// Search for existing user with that name.
			$stmt = $conn->prepare("select ID from Users where Login=?");
			$stmt->bind_param("s", $login);
			$stmt->execute();
			$result = $stmt->get_result();
			$stmt->close();
			// If an existing user exists, return fail.
			if($row = $result->fetch_assoc())
			{
				returnWithError("Login already exists.");
			}
			else {
				// If not, add the new user. 
				$stmt = $conn->prepare("INSERT into Users (FirstName, LastName, Login, Password) VALUES(?,?,?,?)");
				$stmt->bind_param("ssss", $firstName, $lastName, $login, $password);
				$stmt->execute();
				$stmt->close();

				$stmt = $conn->prepare("select ID from Users where Login=?");
				$stmt->bind_param("s", $login);
				$stmt->execute();
				$result = $stmt->get_result();
				$stmt->close();
				$row = $result->fetch_assoc();
				
				$conn->close();
				
				returnWithInfo( $row['ID'] );
			}
    }

    function getRequestInfo()
    {
        return json_decode(file_get_contents('php://input'), true);
    }

    function sendResultInfoAsJson( $obj )
    {
        header('Content-type: application/json');
        echo $obj;
    }

    function returnWithError( $err )
    {
        $retValue = '{"result":"error","error":"' . $err . '"}';
        sendResultInfoAsJson( $retValue );
    }
		
		function returnWithSuccess()
    {
        $retValue = '{"result":"success"}';
        sendResultInfoAsJson( $retValue );
    }
function returnWithInfo( $id )
	{
		$retValue = '{"id":' . $id . ',"error":""}';
		sendResultInfoAsJson( $retValue );
	}

    ?>
