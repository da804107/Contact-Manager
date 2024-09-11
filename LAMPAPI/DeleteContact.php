<?php

		// HOW TO SECURE THIS?
		
    $inData = getRequestInfo();

    $id = $inData["ID"];

    $conn = new mysqli("localhost", "daisy", "SPOoks0219!!", "SMALLPROJ");
    if($conn->connect_error)
    {
        returnWithError( $conn->connect_error );
    }
    else{
        $stmt = $conn->prepare("DELETE from Contacts WHERE ID=?");
        $stmt->bind_param("s", $id);
        $stmt->execute();
        $stmt->close();
        $conn->close();
        returnWithSuccess();
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
