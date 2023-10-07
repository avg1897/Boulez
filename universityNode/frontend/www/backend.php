<?php
$log = fopen('backend.log', 'a+');

$host = getenv('CONTAINER_NAME_WEB');
$port = getenv('API_PORT');
//fwrite($log, "ENV|CONTAINER_NAME_WEB|".$host.':'.$port."\n");

$API_base_url = $host.':'.$port.'/chatbot/chat';

if (array_key_exists('method', $_POST) && array_key_exists('body', $_POST)) {
    $postdata = json_encode($_POST['body']);
    $url = $API_base_url.'/'.$_POST['method'];
    fwrite($log, "REQUEST|".$_POST['method']."|".$url."|".$postdata."\n");
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $postdata);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json'));
    $result = curl_exec($ch);
    //se httpcode = 0 -> server non raggiungibile | crashato
    $httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    fwrite($log, "RESPONSE|".$_POST['method']."|".$httpcode."|".$result."\n");
    curl_close($ch);
    echo $result;
} else {
    echo json_encode(['status' => 'KO']);
}

fclose($log);

