<?php

require __DIR__ . '/controllers/Home.php';

return [
    '' => [
        'method' => 'POST',
        'handler' => Home::class
    ],
];
