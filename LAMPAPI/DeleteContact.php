<?php

		// HOW TO SECURE THIS?
		// Store user id and hashed password on client side 
		// All operations need the user to send the user id and hashed password for verification
		// Contact updating/deleting requests must belong to the user
		
    $inData = getRequestInfo();

    $id = $inData["ID"];
    $userID = $inData["UserID"];
    $hash = $inData["Hash"];
		
		$validity = validateUser($userID, $hash);

    $conn = new mysqli("localhost", "daisy", "SPOoks0219!!", "SMALLPROJ");
    if($conn->connect_error)
    {
        returnWithError( $conn->connect_error );
    }
    else{
        $stmt = $conn->prepare("DELETE from Contacts WHERE ID=? and UserID=?");
        $stmt->bind_param("ss", $id, $userID);
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
