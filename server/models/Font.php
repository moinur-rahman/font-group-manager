<?php

class Font
{
    private $fontDir;
    
    public function __construct()
    {
        $this->fontDir = dirname(__DIR__) . '/uploads/';
        
        if (!is_dir($this->fontDir)) {
            mkdir($this->fontDir, 0755, true);
        }
    }
    
    public function validateFont($file)
    {
        if (!isset($file) || $file['error'] != 0) {
            return 'No file uploaded or upload error occurred.';
        }
        
        if ($file['size'] > 10 * 1024 * 1024) {
            return 'File size exceeds the maximum limit of 10MB.';
        }
        
        $extension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
        if ($extension !== 'ttf') {
            return 'Only .ttf files are allowed.';
        }
        
        return true;
    }
    
    public function saveFont($file)
    {
        $validation = $this->validateFont($file);
        if ($validation !== true) {
            return $validation;
        }
        
        $filename = preg_replace('/[^a-zA-Z0-9_-]/', '', pathinfo($file['name'], PATHINFO_FILENAME));
        $filename = $filename . '_' . time() . '.ttf';
        
        $destination = $this->fontDir . $filename;
        
        if (move_uploaded_file($file['tmp_name'], $destination)) {
            return [
                'name' => $file['name'],
                'filename' => $filename,
                'path' => '/uploads/' . $filename,
                'uploadedAt' => date('Y-m-d H:i:s')
            ];
        } else {
            return 'Failed to save the font file.';
        }
    }
    
    public function deleteFont($filename)
    {
        $filepath = $this->fontDir . $filename;
        
        if (file_exists($filepath)) {
            if (unlink($filepath)) {
                return true;
            }
            return 'Failed to delete the font file.';
        }
        
        return 'Font file not found.';
    }
    
    public function getAllFonts()
    {
        $fonts = [];
        
        if (is_dir($this->fontDir)) {
            $files = glob($this->fontDir . '*.ttf');
            
            foreach ($files as $file) {
                $filename = basename($file);
                $fonts[] = [
                    'name' => $filename,
                    'path' => '/uploads/' . $filename,
                    'uploadedAt' => date('Y-m-d H:i:s', filemtime($file))
                ];
            }
        }
        
        return $fonts;
    }
}