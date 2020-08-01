<?php

return [
    'actions' => [
        'item.create.eplabor_consultings' => function($data){ new \Directus\Custom\Hooks\eplabor\ProcessConsulting($data, 'create'); },
        'item.update.eplabor_consultings' => function($data){ new \Directus\Custom\Hooks\eplabor\ProcessConsulting($data, 'update'); },
        'item.delete.eplabor_consultings' => function($data){ new \Directus\Custom\Hooks\eplabor\ProcessConsulting($data, 'delete'); },
    ]
];
