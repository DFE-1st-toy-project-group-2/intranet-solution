# intranet-solution
패스트캠퍼스 데브캠프 1기, 첫번째 토이프로젝트 2조


#conventionMessageTemplate 사용법

1.템플릿 경로 설정 - 커밋 메세지 템플릿의 경로를 지정합니다.

$ git config --global commit.template [파일경로]
*글로벌 옵션은 다른 프로젝트에도 적용하고 싶으면 쓰시면 됩니다. 저는 옵션을 빼고 진행 했습니다.
*파일의 이름은 'conventionTemplate.txt'입니다.

2. 커밋
1번을 진행한 후, 커밋을 진행 하실때는 $git commit 커맨드를 사용합니다. 메세지 옵션을 넣지 않습니다.
commit 후, 템플릿이 안내하는 데로 커밋 메세지를 작성 하시면 됩니다.