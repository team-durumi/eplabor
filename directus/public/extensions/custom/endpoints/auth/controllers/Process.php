<?php

use Directus\Application\Http\Request;
use Directus\Application\Http\Response;

require_once __DIR__ . '/../functions.php';

class Process {
    public function __invoke(Request $request, Response $response) {
        $results = eplaborProcessItem($request);
        return $response->withJson(['data' => $results]);
    }
}

?>