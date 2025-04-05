<?php
require_once __DIR__ . '/../models/Font.php';
require_once __DIR__ . '/../core/Response.php';

class FontController
{
    private $fontModel;
    
    public function __construct()
    {
        $this->fontModel = new Font();
    }
    
    public function upload()
    {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            Response::error('Method not allowed.', 405);
            return;
        }
        
        if (!isset($_FILES['font'])) {
            Response::error('No file uploaded.');
            return;
        }
        
        $result = $this->fontModel->saveFont($_FILES['font']);
        
        if (is_array($result)) {
            Response::success($result, 'Font uploaded successfully.');
        } else {
            Response::error($result);
        }
    }
    
    public function getAllFonts()
    {
        if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
            Response::error('Method not allowed.', 405);
            return;
        }
        
        $fonts = $this->fontModel->getAllFonts();
        
        Response::success($fonts, 'Fonts retrieved successfully.');
    }
}