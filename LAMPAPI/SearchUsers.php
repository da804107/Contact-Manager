<?php

	$inData = getRequestInfo();

	$conn = new mysqli("localhost", "daisy", "SPOoks0219!!", "SMALLPROJ");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$stmt = $conn->prepare("select ID from Users where Login=?");
		$stmt->bind_param("s", $contactName, $inData["login"]);
		$stmt->execute();
		
		$result = $stmt->get_result();

		if( $searchCount == 0 )
		{
			returnWithError( "No Records Found" );
		}
		else
		{
			returnWithSuccess();
		}
		
		$stmt->close();
		$conn->close();
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
		$retValue = '{"present":false,"result":"error","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
	function returnWithSuccess( )
	{
		$retValue = '{"present":true,"result":"success","error":""}';
		sendResultInfoAsJson( $retValue );
	}
	
?>
