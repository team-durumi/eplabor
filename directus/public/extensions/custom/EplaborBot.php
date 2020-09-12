<?php

class EplaborBot
{
    private $client;
    private $container;
    private $logger;
    private $collections;

    public function __construct()
    {
        $http_params = [
            'base_uri' => 'http://localhost/',
            // 'debug' => true
            'headers' => [
                'Authorization' => 'Bearer ' . getenv('BOT_TOKEN'),
                'Content-Type' => 'application/json',
            ],
        ];
        $this->client = new GuzzleHttp\Client($http_params);
        $this->container = \Directus\Application\Application::getInstance()->getContainer();
        $this->logger = $this->container->get('logger');
        $this->collections = ['eplabor_consultings', 'eplabor_workshop_paricipants'];
    }

    // 커스텀 인증 처리
    public function check($params)
    {
        $this->logger->debug('[EplaborBot] check -------');
        // $this->logger->debug(print_r($params, true));
        $message = null;
        $fields = [
            'eplabor_consultings' => 'consultee_password',
            'eplabor_workshop_participants' => 'participant_password'
        ];
        $field = $fields[$params['collection']] ?: null;
        if($params['collection'] == 'eplabor_consultings') {
            try {
                $hash = $this->get($params['collection'], $params['item_id'], $field);
            } catch(Exception $e) {
                $this->logger->error($e->getMessage());
                return [ 'error' => $e->getMessage() ];
            }
        }
        if($params['collection'] == 'eplabor_workshop_participants') {
            $this->logger->debug('[EplaborBot] check --- eplabor_workshop_participants');
            $query = [
                'single' => true,
                'filter' => [
                    'workshop_name' => $params['item_id'],
                    'participant_email' => $params['participant_email']
                ]
            ];
            // $this->logger->debug(print_r($query, true));
            try {
                $response = $this->client->get('/eplabor/items/eplabor_workshop_participants?' . http_build_query($query));
                $data = json_decode($response->getBody()->getContents(), true);
                $hash = $data['data']['participant_password'];
                // $this->logger->debug(print_r($data, true));
            } catch (GuzzleHttp\Exception\ClientException $e) {
                $this->logger->debug(print_r($e));
                return [ 'error' => $e->getMessage() ];
            }
        }

        // $this->logger->debug(print_r($hash, true));
        $payload = ['hash' => $hash, 'string' => $params['string']];
        // $this->logger->debug(print_r($payload, true));
        try {
            $response = $this->client->post('/eplabor/utils/hash/match', ['form_params' => $payload]);
            // $this->logger->debug('[bot->check($params) => $response->getBody() ' . $response->getBody());
            $message = json_decode( $response->getBody(), true );
            // $this->logger->debug('[bot->check($params) => messase = ' . print_r($message, true));
            if($params['collection'] == 'eplabor_workshop_participants') {
                $message['data']['id'] = $data['data']['id'];
            }
        } catch (Exeption $e) {
            $this->logger->error($e->getMessage());
            return [ 'error' => $e->getMessage() ];
        }
        // $this->logger->debug('final', [print_r($message, true)]);

        return $message;
    }

    public function create($collection, $params = [])
    {
        try {
            $res = $this->client->post('/eplabor/items/' . $collection, ['form_params' => $params]);
            $item = json_decode($res->getBody()->getContents(), true);
            return $item['data'];
        } catch (Exception $e) {
            $this->logger->debug($e->getMessage());
            return ['error' => $e->getCode()];
        }
        
    }

    public function get($collection, $id, $field = null)
    {
        try {
            $response = $this->client->get('/eplabor/items/' . $collection . '/' . $id);
            $item = json_decode($response->getBody(), true);
            // $this->logger->debug(print_r($item, true));
            if ($field) {
                return $item['data'][$field];
            }
            return $item['data'];
        } catch (Exception $e) {
            $this->logger->error($e->getMessage());
        }
    }

    public function update($collection, $id, $params = [])
    {
        return $this->client->patch('/eplabor/items/' . $collection . '/' . $id, ['form_params' => $params]);
    }

    public function delete($collection, $id) // soft-delete
    {
        return $this->client->patch('/eplabor/items/' . $collection . '/' . $id, ['form_params' => ['status' => 'deleted']]);
    }

    public function ping()
    {
        $message = null;
        try {
            $response = $this->client->get('/eplabor/users/me');
            $result = json_decode($response->getBody(), true);
            $message = $result['data'];
        } catch (Exeption $e) {
            $this->logger->error($e->getMessage());
            $message = $e->getMessage();
        }
        return $message;
    }
}
