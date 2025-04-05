<?php
require_once __DIR__ . '/../models/FontGroup.php';
require_once __DIR__ . '/../core/Response.php';

class FontGroupController
{
    private $fontGroupModel;
    
    public function __construct()
    {
        $this->fontGroupModel = new FontGroup();
    }
    
    public function create()
    {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            Response::error('Method not allowed.', 405);
            return;
        }
        
        $data = json_decode(file_get_contents('php://input'), true);
        
        if (!$data) {
            Response::error('Invalid JSON data.');
            return;
        }
        
        $result = $this->fontGroupModel->saveGroup($data);
        
        if (is_array($result)) {
            Response::success($result, 'Font group created successfully.');
        } else {
            Response::error($result);
        }
    }
    
    public function getAllGroups()
    {
        if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
            Response::error('Method not allowed.', 405);
            return;
        }
        
        $groups = $this->fontGroupModel->getAllGroups();
        
        Response::success($groups, 'Font groups retrieved successfully.');
    }
    
    public function deleteGroup()
    {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST' && $_SERVER['REQUEST_METHOD'] !== 'DELETE') {
            Response::error('Method not allowed.', 405);
            return;
        }
        
        $data = json_decode(file_get_contents('php://input'), true);
        
        if (!isset($data['id'])) {
            Response::error('Group ID is required.');
            return;
        }
        
        $result = $this->fontGroupModel->deleteGroup($data['id']);
        
        if ($result === true) {
            Response::success(null, 'Font group deleted successfully.');
        } else {
            Response::error($result);
        }
    }
    
    public function updateGroup()
    {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST' && $_SERVER['REQUEST_METHOD'] !== 'PUT') {
            Response::error('Method not allowed.', 405);
            return;
        }
        
        $data = json_decode(file_get_contents('php://input'), true);
        
        if (!isset($data['id'])) {
            Response::error('Group ID is required.');
            return;
        }
        
        $result = $this->fontGroupModel->updateGroup($data['id'], $data);
        
        if ($result === true) {
            Response::success(null, 'Font group updated successfully.');
        } else {
            Response::error($result);
        }
    }
}