<?php

//Make sure that it is a POST request.
if(strcasecmp($_SERVER['REQUEST_METHOD'], 'POST') != 0){
    throw new Exception('Request method must be POST!');
}

//Make sure that the content type of the POST request has been set to application/json
$contentType = isset($_SERVER["CONTENT_TYPE"]) ? trim($_SERVER["CONTENT_TYPE"]) : '';
if(strcasecmp($contentType, 'application/json') != 0){
    throw new Exception('Content type must be: application/json');
}
//echo '{"message":"New record created successfully"}'; 

//Receive the RAW post data.
$content = trim(file_get_contents("php://input"));

//Attempt to decode the incoming RAW post data from JSON.
$decoded = json_decode($content, true);
$data = $decoded [ 'levels' ] ;  // new

//If json_decode failed, the JSON is invalid.
if(!is_array($data)){
    throw new Exception('Received content contained invalid JSON!');
}

$servername = "localhost";
$username = "futurework";
$password = "WZG66h6ZqvLU";
$dbname = "futurework";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}

$query = '';
$condicion = FALSE;
foreach ($data as $item) {
    $query .= "INSERT INTO Platforms (CaseNumber, PlatformID, TotalVisitsPlatformGame, LastVisitTimeSpentOnPlat, TotalTimeSpentOnPlat, LastStrokesLeftArrow, LastStrokesRightArrow, TotalStrokesLeftArrowOnPlat, TotalStrokesRightArrowOnPlat, LastVisitMissedOpporOnPlat, TotalMissedOpportOnPlat, ReactionTime, TotalMissedOpportGame ) VALUES ('"
    .$item["CaseNumber"]."', '"
    .$item["PlatformID"]."', '"
    .$item["TotalVisitsPlatformGame"]."', '"
    .$item["LastVisitTimeSpentOnPlat"]."', '"
    .$item["TotalTimeSpentOnPlat"]."', '"
    .$item["LastStrokesLeftArrow"]."', '"
    .$item["LastStrokesRightArrow"]."', '"
    .$item["TotalStrokesLeftArrowOnPlat"]."', '"
    .$item["TotalStrokesRightArrowOnPlat"]."', '"
    .$item["LastVisitMissedOpporOnPlat"]."', '"
    .$item["TotalMissedOpportOnPlat"]."', '"
    .$item["ReactionTime"]."', '"
    .$item["TotalMissedOpportGame"]."');\n";
    // $condicion=$condicion&&$conn->query($query);
}
$condicion = $conn->multi_query($query);
// multi_query($sql)
// echo $query;

if ($condicion===TRUE) {
  echo '{"message":"New record created successfully"}'; 
} else {
  
  $error = array( 
    "error" => "1", 
    "name" => $query, 
    "message" => $conn->error
  ); 
  $errorJSON=json_encode($error);
  echo $errorJSON;
  
  // echo '{"message":"paila"}'; 
}

$conn->close();
// echo $query;

?>

