<?php

class FontGroup
{
    private $dataFile;
    
    public function __construct()
    {
        $this->dataFile = dirname(__DIR__) . '/data/font_groups.json';
        
        $dataDir = dirname($this->dataFile);
        if (!is_dir($dataDir)) {
            mkdir($dataDir, 0755, true);
        }
        
        if (!file_exists($this->dataFile)) {
            file_put_contents($this->dataFile, json_encode([]));
        }
    }
    
    public function validateGroup($data)
    {
        if (!isset($data['title']) || empty(trim($data['title']))) {
            return 'Group title is required.';
        }
        
        if (!isset($data['fonts']) || !is_array($data['fonts']) || count($data['fonts']) < 2) {
            return 'At least two fonts are required.';
        }
        
        $fontNames = [];
        foreach ($data['fonts'] as $font) {
            if (!isset($font['name']) || empty(trim($font['name']))) {
                return 'Each font must have a name.';
            }
            
            if (!isset($font['fontFile']) || empty(trim($font['fontFile']))) {
                return 'Each font must have a font file selected.';
            }
            
            if (in_array($font['fontFile'], $fontNames)) {
                return 'Duplicate fonts are not allowed.';
            }
            
            $fontNames[] = $font['fontFile'];
        }
        
        return true;
    }
    
    public function saveGroup($data)
    {
        $validation = $this->validateGroup($data);
        if ($validation !== true) {
            return $validation;
        }
        
        $groups = $this->getAllGroups();
        
        $newGroup = [
            'id' => uniqid(),
            'title' => $data['title'],
            'fonts' => $data['fonts'],
            'createdAt' => date('Y-m-d H:i:s')
        ];
        
        $groups[] = $newGroup;
        
        if (file_put_contents($this->dataFile, json_encode($groups))) {
            return $newGroup;
        } else {
            return 'Failed to save font group.';
        }
    }
    
    public function getAllGroups()
    {
        if (file_exists($this->dataFile)) {
            $jsonData = file_get_contents($this->dataFile);
            return json_decode($jsonData, true) ?: [];
        }
        
        return [];
    }
    
    public function deleteGroup($id)
    {
        $groups = $this->getAllGroups();
        $found = false;
        
        $filteredGroups = array_filter($groups, function($group) use ($id, &$found) {
            if ($group['id'] == $id) {
                $found = true;
                return false;
            }
            return true;
        });
        
        if (!$found) {
            return 'Font group not found.';
        }
        
        if (file_put_contents($this->dataFile, json_encode(array_values($filteredGroups)))) {
            return true;
        } else {
            return 'Failed to delete font group.';
        }
    }
    
    public function updateGroup($id, $data)
    {
        $validation = $this->validateGroup($data);
        if ($validation !== true) {
            return $validation;
        }
        
        $groups = $this->getAllGroups();
        $found = false;
        
        foreach ($groups as &$group) {
            if ($group['id'] == $id) {
                $group['title'] = $data['title'];
                $group['fonts'] = $data['fonts'];
                $group['updatedAt'] = date('Y-m-d H:i:s');
                $found = true;
                break;
            }
        }
        
        if (!$found) {
            return 'Font group not found.';
        }
        
        if (file_put_contents($this->dataFile, json_encode($groups))) {
            return true;
        } else {
            return 'Failed to update font group.';
        }
    }
}