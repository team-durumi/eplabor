<?php

use Directus\Application\Http\Request;
use \Directus\Database\TableGatewayFactory;
use Directus\Services\UtilsService;

// {
// 	"type": "update",
// 	"consulting_id": 1,
// 	"string": "1234"
// }

if (!function_exists('eplaborInitBot')) {
    function eplaborInitBot() {
        $base_uri = 'http://localhost';
        $client = new GuzzleHttp\Client(['base_uri' => $base_uri]);
        $identity = [
            'form_params' => [
                'email' => getenv('BOT_EMAIL'),
                'password' => getenv('BOT_PASSWORD'),
                'mode' => 'cookie'
            ]
        ];
        $res = $client->post('/eplabor/auth/authenticate', $identity);
        return $res->getBody();
    }
}

if (!function_exists('eplaborHandleAuth')) {
    // 
    /**
     * @return array
     */
    function eplaborHandleAuth(Request $request) {
        $container = \Directus\Application\Application::getInstance()->getContainer();
        $logger = $container->get('logger');
        $params = $request->getParsedBody();
        // $logger->debug(print_r($params, true));

        // init bot!
        $bot = eplaborInitBot();
        // $logger->debug(print_r($bot, true));

        // get tableGateway
        $tableGateway = TableGatewayFactory::create('eplabor_consultings', [
            'connection' => $container->get('database'),
            'acl' => false
        ]);
        $consulting = $tableGateway->getOneData($params['id']);

        // auth
        $utilService = new UtilsService($container);
        $auth = $utilService->verifyHashString($params['string'],  $consulting['consultee_password'], $hasher = 'core', []);
        $isValid = $auth['data']['valid'];
        if(!$isValid) return $auth;

        switch ($params['type']) {
            case 'update':
                $logger->debug('eplaborHandleAuth -- update');
                return $consulting;
                break;
            case 'delete':
                $logger->debug('eplaborHandleAuth -- delete');
                
                $updates = [
                    'form_params' => [
                        'status' => 'deleted'
                    ]
                ];
                //  PATCH /:project/items/:collection/:id
                $base_uri = 'http://localhost';
                $client = new GuzzleHttp\Client(['base_uri' => $base_uri]);
                $res = $client->patch('/eplabor/items/eplabor_consultings/' . $params['id'], $updates );
                // $logger->debug(print_r($res->getBody(), true));
                return $res->getBody();
                break;
        }

    }

}

?>
