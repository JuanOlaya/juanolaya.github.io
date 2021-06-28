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

$sql = "INSERT INTO ThoughtProbesPhase2 (CaseNumber, Probe0 ,Probe1, Probe2, Probe3, Probe4, Probe5, ScoreQ1 , ScoreQ2, ScoreQ3, ScoreQ4, ScoreQ5, ScoreQ6, ScoreQ7, ScoreQ8, ScoreQ9, ScoreQ10, TotalTime, Cond, EndDate, EndHour)
VALUES ('".$decoded["CaseNumber"]."', '".$decoded["Probe0"]."', '".$decoded["Probe1"]."', '".$decoded["Probe2"]."', '".$decoded["Probe3"]."', '".$decoded["Probe4"]."', '".$decoded["Probe5"]."', '".$decoded["ScoreQ1"]."', '".$decoded["ScoreQ2"]."', '".$decoded["ScoreQ3"]."', '".$decoded["ScoreQ4"]."', '".$decoded["ScoreQ5"]."', '".$decoded["ScoreQ6"]."', '".$decoded["ScoreQ7"]."', '".$decoded["ScoreQ8"]."', '".$decoded["ScoreQ9"]."', '".$decoded["ScoreQ10"]."', '".$decoded["TotalTime"]."', '".$decoded["Cond"]."', '".$decoded["EndDate"]."', '".$decoded["EndHour"]."')";

if ($conn->query($sql) === TRUE) {
  header("Access-Control-Allow-Origin: https://www.soscisurvey.de");
  echo '{"message":"New record created successfully "}'; 
} else {
  echo "Error: " . $sql . "<br>" . $conn->error;
}
$conn->close();

// VALUES ('1','2','3','4')";
?>