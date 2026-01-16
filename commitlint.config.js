/**
 * feat: 새로운 기능
 * fix: 버그 수정
 * docs: 문서 변경
 * style: 코드 스타일 변경 (포맷팅, 세미콜론 등)
 * refactor: 리팩토링
 * test: 테스트 코드
 * chore: 기타 잡일 (빌드 프로세스, 패키지 변경 등)
 * ci: CI 설정 변경
 * revert: 이전 커밋 되돌리기
 * remove: 파일 또는 소스코드 삭제
 * rename: 파일명 수정
 * commit: 임시 커밋
 */
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'docs', 'style', 'refactor', 'test', 'chore', 'ci', 'revert', 'remove', 'rename', 'commit'],
    ],
    'subject-min-length': [2, 'always', 3], // 최소 3글자
    'subject-max-length': [2, 'always', 100], // 최대 100글자
    'subject-empty': [2, 'never'], // 커밋 제목은 필수
    // 'subject-case': [2, 'never', ['upper-case']], // 전체 대문자만 금지, PascalCase는 허용
    'type-empty': [2, 'never'], // 커밋 타입도 필수
    'type-case': [2, 'always', 'lower-case'], // 커밋 타입은 소문자만 가능
  },
};
