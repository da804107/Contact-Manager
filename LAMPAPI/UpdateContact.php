<?php

		// HOW TO SECURE THIS?
		// Store user id and hashed password on client side 
		// All operations need the user to send the user id and hashed password for verification
		// Contact updating/deleting requests must belong to the user
		
    $inData = getRequestInfo();

    $id = $inData["id"];
    $name = $inData["name"];
    $email = $inData["email"];
    $phone = $inData["phone"];

    $userID = $inData["userId"];


    //$hash = $inData["Hash"];
		
	//$validity = validateUser($userID, $hash);

    $conn = new mysqli("localhost", "daisy", "SPOoks0219!!", "SMALLPROJ");
    if($conn->connect_error)
    {
        returnWithError( $conn->connect_error );
    }
    else{
        $stmt = $conn->prepare("Update Contacts set Name = ? WHERE ID=?");
        $stmt->bind_param("ss", $name, $id);
        $stmt->execute();
        $stmt->close();
				
				$stmt = $conn->prepare("Update Contacts set Phone = ? WHERE ID=?");
        $stmt->bind_param("ss", $phone, $id);
        $stmt->execute();
        $stmt->close();
				
				$stmt = $conn->prepare("Update Contacts set Email = ? WHERE ID=?");
        $stmt->bind_param("ss", $email, $id);
        $stmt->execute();
				
        $stmt->close();
        $conn->close();
        returnWithSuccess();
    }
		
		function validateUser($userID, $hash)
    {
				return true;
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

    ?>
