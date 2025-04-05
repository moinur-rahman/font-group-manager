<?php

class Response
{
    public static function json($data, $status = 200)
    {
        header('Content-Type: application/json');
        http_response_code($status);
        echo json_encode($data);
        exit;
    }

    public static function success($data = null, $message = 'Success')
    {
        self::json([
            'success' => true,
            'message' => $message,
            'data' => $data
        ]);
    }

    public static function error($message = 'An error occurred', $status = 400)
    {
        self::json([
            'success' => false,
            'message' => $message
        ], $status);
    }
}