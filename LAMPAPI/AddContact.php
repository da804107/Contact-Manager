<?php
    $inData = getRequestInfo();
		

    $name = $inData["name"];
    $phone = $inData["phone"];
    $email = $inData["email"];
    $userId = $inData["userId"];
		
    $phone = formatPhoneNumber($phone);

    $conn = new mysqli("localhost", "daisy", "SPOoks0219!!", "SMALLPROJ");
    if($conn->connect_error)
    {
				returnWithSuccess();
        //returnWithError( $conn->connect_error );
    }
    else{
        $stmt = $conn->prepare("INSERT into Contacts (Name,Phone,Email,UserID) VALUES(?,?,?,?)");
        $stmt->bind_param("ssss", $name, $phone, $email, $userId);
        $stmt->execute();
        $stmt->close();
        $conn->close();
        returnWithSuccess();
    }

    function formatPhoneNumber($phone)
    {
        if (preg_match("/^\d{3}-\d{3}-\d{4}$/", $phone)) {
            // if the phone # is already in the format XXX-XXX-XXXX, return the phone #
            return $phone;
        }
        else{
            // format the phone number as XXX-XXX-XXXX
            return substr($phone, 0, 3) . '-' . substr($phone, 3, 3) . '-' . substr($phone, 6, 4);
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

    ?>
