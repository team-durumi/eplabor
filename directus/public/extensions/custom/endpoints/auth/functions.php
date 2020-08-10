<?php

use Directus\Application\Http\Request;

require_once __DIR__ . '../../../EplaborBot.php';

if (!function_exists('eplaborInitAPI')) {
    // initilize api
    function eplaborInitAPI(Request $request)
    {
        $container = \Directus\Application\Application::getInstance()->getContainer();
        $logger = $container->get('logger');
        $bot = new EplaborBot();
        $params = $request->getParsedBody();
        // $logger->debug(print_r($params, true));
    }
}

if (!function_exists('eplaborHandleAuth')) {
    // 인증 요청 처리
    function eplaborHandleAuth(Request $request)
    {
        eplaborInitAPI($request);
        // auth
        $authenticated = $bot->check($params);
        if ($authenticated === false) {
            return $authenticated;
        }
        switch ($params['type']) {
            case 'update': // return item
                return $bot->get($params['collection'], $params['item_id']);
                break;
            case 'delete':
                return $bot->delete($params['collection'], $params['item_id']);
                break;
        }
    }

}

if (!function_exists('eplaborProcessItem')) {
    // 아이템 처리
    function eplaborProcessItem(Request $request)
    {
        // initilize api
        eplaborInitAPI($request);

        // 모델 외 파라미터 정리 후 제거
        if (!emtpy($params['collection'])) {
            $collection = $params['collection'];
            unset($params['collection']);
        }
        if (!emtpy($params['action_type'])) {
            $action_type = $params['action_type'];
            unset($params['action_type']);
        }

        switch ($params['action_type']) {
            case 'create': // return item
                return $bot->get($params['collection'], $params['item_id']);
                break;
            case 'update': // return item
                return $bot->update($params['collection'], $params['item_id'], $params);
                break;
            case 'delete':
                return $bot->delete($params['collection'], $params['item_id']);
                break;
        }
        return $results;
    }
}
