<?php

use Directus\Application\Http\Request;
use Directus\Application\Http\Response;
use Directus\Services\ItemsService;

return [
    '' => [
        'method' => 'GET',
        'handler' => function (Request $request, Response $response) {
            $container = \Directus\Application\Application::getInstance()->getContainer();
            $logger = $container->get('logger');
            // $logger->debug('test');

            $dbConnection = $container->get('database');
            $acl = $container->get('acl');

            $tableGateway = Directus\Database\TableGatewayFactory::create('eplabor_consultings', [
                'connection' => $dbConnection,
                'acl' => false
            ]);
            $params = [
                'status' => 'published'
            ];

            $items = [];
            try {
                $items = $tableGateway->getItems($params);
            } catch(Exception $e) {
                $logger->debug($e);
            }
            $logger->debug($items);

            // $itemsService = new ItemsService($container);
            // try {
            //     $onlines = $itemsService->findAll('eplabor_consultings', ['acl' => false]);
            // } catch(Exception $e) {
            //     $logger->debug($e);
            // }

            return $response->withJson([ $items ]);
        }
    ]
];
