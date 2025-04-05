<?php
require_once __DIR__ . '/config/config.php';
require_once __DIR__ . '/controllers/FontController.php';

$controller = new FontController();
$controller->upload();