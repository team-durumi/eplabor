<?php
/**
 * ProcessConsulting
 * 
 * 상담 생성, 수정 시 넘어온 상담 데이터를 휴고 콘텐츠 디렉토리 내 마크다운 파일로 저장 그리고, 커밋, 푸시한다.
 * directus custom hook for creating and updating eplabor_consultings
 * 
 */

namespace Directus\Custom\Hooks\eplabor;

use Directus\Hook\HookInterface;
use Slim\Views\Twig;

class ProcessConsulting implements HookInterface {
    
    private $container;
    private $logger;
    private $slack_base_uri;
    private $slack_payload;
    private $type;
    private $base_path;
    private $view;
    private $tableGateway;
    private $config;

    public function __construct($data, $type){
        $this->container = \Directus\Application\Application::getInstance()->getContainer();
        $this->logger = $this->container->get('logger');
        $this->slack_base_uri = getenv('SLCAK_WEBHOOK_ENDPOINT') ?: '';
        $this->slack_payload = [ 'text' => '' ];
        $this->type = $type;
        $this->base_path = $this->container->get('path_base');
        $this->view = new Twig([ $this->base_path . '/public/extensions/custom/hooks/eplabor/' ]);
        $this->tableGateway = \Directus\Database\TableGatewayFactory::create('eplabor_consultings', [
            'connection' => $this->container->get('database'),
            'acl' => false
        ]);
        $app = \Directus\create_app_with_project_name($this->base_path, 'eplabor');
        $this->config = $app->getConfig();

        $this->handle($data);
    }

    /**
     *  실제 처리
     * @param Array $data
     *
     * @return void
     */
    public function handle($data = null) {
        // 요청 형식에 따라 실행
        $this->logger->debug('[HOOK] --- handle! --- ' . $this->type);
        if(!empty($this->type) && in_array($this->type, ['create', 'update'])) {
            $this->{$this->type}($data);
        }
        if($this->config->get('env') != 'development') {
            $this->logger->debug('[HOOK] --- handle! --- gitpush');
            $this->gitPush();
        }
    }

    private function create($data = null) {
        $markdown_string = $this->slack_payload['text'] = $this->buildMarkdown($data);
        $pull = system('cd /home/ubuntu/eplabor/ && git pull');
        // 디스크에 마크다운 파일로 저장
        $result = file_put_contents($this->base_path . '/../homepage/content/consulting/online/' . $data['id'] . '.md', $markdown_string);
        if($result === FALSE) {
            $error = error_get_last();
            $this->logger->error(print_r($error, true)); 
        } elseif(is_int($result) && $result > 0) {
            $this->logger->debug('[HOOK] Written to homepage/content/consulting/online/' . $data['id'] . '.md');
        }
        // $this->logger->debug('/vagrant/homepage/content/consulting/online/' . $data['id'] . '.md');
    }

    private function update($data = null) {
        // $this->logger->debug('[HOOK] --- update() --- ' . $data['id'] . ' -- ' . $data['status']);
        $this->logger->debug(print_r($data, true));
        $pull = system('cd /home/ubuntu/eplabor/ && git pull');
        // 삭제
        if(!empty($data['status']) && $data['status'] == 'deleted') {
            $output = system('rm -f ' . $this->base_path  . '/../homepage/content/consulting/online/' . $data['id'] . '.md 2>&1', $retval);
            $this->logger->debug($data['id'] . ' deleted --- ' . 'rm -f ' . $this->base_path  . '/../homepage/content/consulting/online/' . $data['id'] . '.md 2>&1 ----' . $retval);
        } else {
            $item = $this->tableGateway->getOneData($data['id']);
            // $this->logger->debug(print_r($item, true));
            $this->create($item);
        }
    }

    private function buildMarkdown($data) {
        // 마크다운 형식으로 데이터 정리
        $data['consultee_name'] = mb_substr($data['consultee_name'], 0, 1) . 'OO';
        // UTC => Asia/Seoul
        $l10nDate = new \DateTime($data['created_on'], new \DateTimeZone('UTC'));
        $l10nDate->setTimeZone(new \DateTimeZone('Asia/Seoul'));
        // TO ISO8601
        $data['created_on'] = $l10nDate->format(\DateTime::ISO8601);
        $data['consulting_status'] = !empty($data['consulting_answer']) ? 'answered' : 'waiting';

        $lines = explode(PHP_EOL, $data['consulting_answer']);
        $data['consulting_answer'] = implode("\n    ", $lines );

        return $this->view->fetch('markdown.twig', $data);
    }

    private function slackNotify($data) {
        // 슬랙 웹훅 엔드포인트가 있는 경우 노티
        if(!empty($this->slack_base_uri)) {
            $client = new \GuzzleHttp\Client([
                'base_uri' => $this->slack_base_uri
            ]);
            $this->slack_payload['text'] .= $markdown_text;
            $response = $client->post('', [ 'body' => json_encode($this->slack_payload) ]);
        }
    }

    private function gitPush() {
        $line = system('cd /home/ubuntu/eplabor/ && git add -A 2>&1', $output);
        $this->logger->debug('git add -- ' . $line);
        $commit = system('cd /home/ubuntu/eplabor/ && git commit -m "노동 상담 문의글을 작성했습니다." 2>&1', $output);
        $this->logger->debug('git commit -- ' . $commit);
        $push = system('cd /home/ubuntu/eplabor/ && git push 2>&1', $output);
        $this->logger->debug('git push -- ' . $push);
    }

}
?>