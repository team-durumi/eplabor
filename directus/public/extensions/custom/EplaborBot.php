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
            // 'debug' => true,
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
        $message = null;
        $fields = [
            'eplabor_consultings' => 'consultee_password',
            'eplabor_workshop_paricipants' => 'participant_password'
        ];
        $field = $fields[$params['collection']] ?: null;
        $hash = $this->get($params['collection'], $params['item_id'], $field);
        $payload = ['hash' => $hash, 'string' => $params['string']];
        $this->logger->debug(print_r($payload, true));
        try {
            $response = $this->client->post('/eplabor/utils/hash/match', ['form_params' => $payload]);
            $result = json_decode( $response->getBody(), true);
            $message = $result['data']['valid'] ?: false;
        } catch (Exeption $e) {
            $this->logger->error($e->getMessage());
            $message = $e->getMessage();
        }

        return $message;
    }

    public function create($collection, $params = [])
    {
        return $this->client->post('/eplabor/items/' . $collection, ['form_params' => $params]);
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
        return $this->client->update('/eplabor/items/' . $collection . '/' . $id, ['form_params' => ['status' => 'deleted']]);
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
