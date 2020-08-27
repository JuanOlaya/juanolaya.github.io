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

//If json_decode failed, the JSON is invalid.
if(!is_array($decoded)){
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

//$sql = "INSERT INTO Experiment1 (CaseNumber, Probe1, Probe2, Probe3)
//VALUES ('".$decoded["CaseNumber"]."', '".$decoded["Probe1"]."', '".$decoded["Probe2"]."', '".$decoded["Probe3"]."')";

$sql = "INSERT INTO ThoughtProbes (CaseNumber, Probe1, Probe2, Probe3, Probe4, Probe5, TotalTime)
VALUES ('".$decoded["CaseNumber"]."', '".$decoded["Probe1"]."', '".$decoded["Probe2"]."', '".$decoded["Probe3"]."', '".$decoded["Probe4"]."', '".$decoded["Probe5"]."', '".$decoded["totalTime"]."')";

if ($conn->query($sql) === TRUE) {
  echo '{"message":"New record created successfully"}'; 
} else {
  echo "Error: " . $sql . "<br>" . $conn->error;
}
$conn->close();

// VALUES ('1','2','3','4')";
?>