<?php
/**
 * ProcessConsultingAsMarkdown
 * 
 * 상담 생성, 수정 시 넘어온 상담 데이터를 휴고 콘텐츠 디렉토리 내 마크다운 파일로 저장 그리고, 커밋, 푸시한다.
 * directus custom hook for creating and updating eplabor_consultings
 * 
 * @return void
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

    public function __construct($data, $type){
        $this->container = \Directus\Application\Application::getInstance();
        $this->logger = $this->container->fromContainer('logger');
        $this->slack_base_uri = getenv('SLCAK_WEBHOOK_ENDPOINT') ?: '';
        $this->slack_payload = [ 'text' => '' ];
        $this->type = $type;
        $this->base_path = $this->container->fromContainer('path_base');
        $this->view = new Twig([ $this->base_path . '/public/extensions/custom/hooks/eplabor/' ]);
        $this->handle($data);
    }

    /**
     *  실제 처리
     * @param Array $data
     *
     * @return void
     */
    public function handle($data = null) {
        
        if(!empty($this->type) && in_array($this->type, ['create', 'update'])) {
            $this->{$this->type}($data);
        }

        // git commit and push
        // chdir('/vagrant/');
        // // https://github.com/simonthum/git-sync
        // $output = shell_exec('git-sync');
        // $this->logger->debug($output);

        // 슬랙 웹훅 엔드포인트가 있는 경우 노티
        if(!empty($this->slack_base_uri)) {
            $client = new \GuzzleHttp\Client([
                'base_uri' => $this->slack_base_uri
            ]);
            $this->slack_payload['text'] .= $markdown_text;
            $response = $client->post('', [ 'body' => json_encode($this->slack_payload) ]);
        }
        
    }

    private function create($data = null) {
        $markdown_string = $this->buildMarkdown($data);
        // 디스크에 마크다운 파일로 저장
        file_put_contents('/vagrant/homepage/content/consulting/online/' . $data['id'] . '.md', $markdown_string);
        $this->logger->debug('/vagrant/homepage/content/consulting/online/' . $data['id'] . '.md');
    }

    private function update($data = null) {
        $this->logger->debug('update()--------');
        $this->logger->debug(print_r($this->data, true));
        if(!empty($data) && $data['status'] == 'deleted') {
            $output = shell_exec('rm -f /vagrant/homepage/content/consulting/online/' . $data['id'] . '.md');
            $this->logger->debug($output . ' deleted?');
        }
    }

    private function buildMarkdown($data) {
        // 마크다운 형식으로 데이터 정리
        $data['consultee_name'] = mb_substr($data['consultee_name'], 0, 1) . 'OO';
        // UTC => Asia/Seoul
        $l10nDate = new \DateTime($data['created_on'], new \DateTimeZone('UTC'));
        $l10nDate->setTimeZone(new \DateTimeZone('Asia/Seoul'));
        $data['created_on'] = $l10nDate->format('Y-m-d H:i:s');
        $data['status'] = !empty($data['consulting_anwser']) ? 'answered' : 'waiting';

        return $this->view->fetch('markdown.twig', $data);
    }
}
