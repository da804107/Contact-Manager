<?php
    $inData = getRequestInfo();

    $name = $inData["name"];
    $phone = $inData["phone"];
    $email = $inData["email"];
    $ID = $inData["id"];

    $conn = new mysqli("localhost", "daisy", "SPOoks0219!!", "SMALLPROJ");
    if($conn->connect_error)
    {
        returnWithError( $conn->connect_error );
    }
    else{
        $stmt = $conn->prepare("UPDATE Contacts (Name,Phone,Email) VALUES(?,?,?) WHERE ID=?");
        $stmt->bind_param("ssss", $name, $phone, $email, $ID);
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
