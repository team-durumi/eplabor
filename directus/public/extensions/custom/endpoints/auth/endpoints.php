<?php

require __DIR__ . '/controllers/Home.php';
require __DIR__ . '/controllers/Process.php';

return [
    '' => [
        'method' => 'POST',
        'handler' => Home::class
    ],
    'process' => [
        'method' => 'POST',
        'handler' => Process::class
    ]
];
