<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);

date_default_timezone_set('UTC');

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

define('BASE_PATH', dirname(__DIR__));
define('FONTS_PATH', BASE_PATH . '/fonts/');

if (!is_dir(FONTS_PATH)) {
    mkdir(FONTS_PATH, 0755, true);
}