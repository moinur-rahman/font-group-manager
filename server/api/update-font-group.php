<?php
require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../controllers/FontGroupController.php';

$controller = new FontGroupController();
$controller->updateGroup();