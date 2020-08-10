<?php

require_once 'ProcessConsulting.php';

return [
    'actions' => [
        'item.create.eplabor_consultings' => function ($data) {new Directus\Custom\Hooks\eplabor\ProcessConsulting($data, 'create');},
        'item.update.eplabor_consultings' => function ($data) {new Directus\Custom\Hooks\eplabor\ProcessConsulting($data, 'update');},
        'item.delete.eplabor_consultings' => function ($data) {new Directus\Custom\Hooks\eplabor\ProcessConsulting($data, 'delete');},
        // 'item.create.eplabor_workshop_participants' => function ($data) {new Directus\Custom\Hooks\eplabor\ProcessWorkshopParticipants($data, 'create');},
        // 'item.update.eplabor_workshop_participants' => function ($data) {new Directus\Custom\Hooks\eplabor\ProcessWorkshopParticipants($data, 'update');},
        // 'item.delete.eplabor_workshop_participants' => function ($data) {new Directus\Custom\Hooks\eplabor\ProcessWorkshopParticipants($data, 'delete');},
    ],
];

?>