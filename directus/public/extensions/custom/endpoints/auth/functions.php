<?php

use Directus\Application\Http\Request;

require_once __DIR__ . '../../../EplaborBot.php';

if (!function_exists('eplaborHandleAuth')) {
    // 인증 요청 처리
    function eplaborHandleAuth(Request $request)
    {
        $container = \Directus\Application\Application::getInstance()->getContainer();
        $logger = $container->get('logger');
        $bot = new EplaborBot();
        $params = $request->getParsedBody();
        $logger->debug('eplaborHandleAuth');
        // $logger->debug(print_r($params, true));

        // auth
        $authenticated = $bot->check($params);
        if ($authenticated === false) {
            return $authenticated;
        }
        switch ($params['type']) {
            case 'update': // return item
                $item = $bot->get($params['collection'], $params['item_id']);
                break;
            case 'delete':
                $item = $bot->delete($params['collection'], $params['item_id']);
                break;
        }
        $item['valid'] = $authenticated['data']['valid'];
        return $item;
    
    }

}

if (!function_exists('eplaborProcessItem')) {
    // 아이템 처리
    function eplaborProcessItem(Request $request)
    {
        $container = \Directus\Application\Application::getInstance()->getContainer();
        $logger = $container->get('logger');
        $bot = new EplaborBot();
        $params = $request->getParsedBody();
        $logger->debug('eplaborProcessItem');
        $logger->debug(print_r($params, true));

        // 모델 외 파라미터 정리 후 제거
        if (!empty($params['collection'])) {
            $collection = $params['collection'];
            unset($params['collection']);
        }
        if (!empty($params['action_type'])) {
            $action_type = $params['action_type'];
            unset($params['action_type']);
        }
        if (!empty($params['id'])) {
            $id = $params['id'];
            unset($params['id']);
        }

        switch ($action_type) {
            case 'create': 
                return $bot->create($collection, $params);
                break;
            case 'update':
                return $bot->update($collection, $id, $params);
                break;
            case 'delete':
                return $bot->delete($collection, $id);
                break;
        }
    }
}
