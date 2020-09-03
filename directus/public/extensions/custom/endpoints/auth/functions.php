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
        $logger->debug('[/custom/auth] eplaborHandleAuth -- params');
        $logger->debug(print_r($params, true));

        $item = [];

        // auth
        $auth = $bot->check($params);
        $logger->debug('[/custom/auth] -- $bot->check($param) : ' . print_r($auth, true));
        // 비밀번호 불일치
        if(!isset($auth['data']) || !$auth['data']['valid']) {
            return ['valid' => false];
        }
        $logger->debug($params['action_type']);
        switch ($params['action_type']) {
            case 'check':
                return $auth['data'];
            case 'update': // return item
                $id = ($params['collection'] == 'eplabor_workshop_participants') ? $auth['data']['id'] : $params['item_id'];
                $item = $bot->get($params['collection'], $id);
                break;
            case 'delete':
                $id = ($params['collection'] == 'eplabor_workshop_participants') ? $auth['data']['id'] : $params['item_id'];
                $response = $bot->delete($params['collection'], $id);
                if($response->getStatusCode() == 204) {
                    return ['status' => 'deleted', 'id' => $id, 'valid' => true];
                }
                break;
        }
        $item['valid'] = true;
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
        $logger->debug('[/custom/auth/process] eplaborProcessItem');
        $logger->debug(print_r($params, true));

        // 모델 외 파라미터 정리 후 제거
        $payloads = [];
        $targets = ['collection', 'action_type', 'item_id'];
        foreach ($targets as $key) {
            // $logger->debug($key . '--' . $params[$key]);
            $payloads[$key] = $params[$key];
            unset($params[$key]);
        }

        switch ($payloads['action_type']) {
            case 'create': 
                return  $bot->create($payloads['collection'], $params);
                break;
            case 'update':
                $res = $bot->update($payloads['collection'], $params['id'], $params);
                $item = json_decode($res->getBody()->getContents(), true);
                return $item['data'];
                break;
            case 'delete':
                return $bot->delete($payloads['collection'], $params['id']);
                break;
        }
    }
}
