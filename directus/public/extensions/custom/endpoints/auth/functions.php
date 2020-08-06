<?php

use Directus\Application\Http\Request;
use \Directus\Database\TableGatewayFactory;
use Directus\Services\UtilsService;

// {
// 	"type": "update",
// 	"consulting_id": 1,
// 	"string": "1234"
// }

if (!function_exists('eplaborHandleAuth')) {
    // 
    /**
     * @return array
     */
    function eplaborHandleAuth(Request $request) {
        $container = \Directus\Application\Application::getInstance()->getContainer();
        $logger = $container->get('logger');
        $params = $request->getParsedBody();

        // get tableGateway
        $tableGateway = TableGatewayFactory::create('eplabor_consultings', [
            'connection' => $container->get('database'),
            'acl' => false
        ]);
        $consulting = $tableGateway->getOneData($params['consulting_id']);

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
                // get zendTableGateway
                $zendTableGateway = new \Zend\Db\TableGateway\TableGateway('eplabor_consultings', $container->get('database'));
                $result = $zendTableGateway->update(['status' => 'published'], ['id' => $params['consulting_id']]);
                $logger->debug($result);
                $updates = [
                    'status' => 'published',
                    'id' => $params['consulting_id'],
                    'modified_on' => gmdate("Y-m-d H:i:s", time()+date("Z")),
                    'modified_by' => 0
                ];
                $tableGateway->runHook('item.update.eplabor_consultings', ['data' => $updates]);
                break;
        }

    }

}

?>
