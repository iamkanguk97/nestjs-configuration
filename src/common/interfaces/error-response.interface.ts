import type { HttpStatus } from '@nestjs/common';

export interface IErrorResponse {
  /**
   * 성공 여부
   */
  isSuccess: false;

  /**
   * HTTP 상태 코드
   */
  statusCode: HttpStatus;

  /**
   * 에러 메시지
   */
  message: string;

  /**
   * 에러 타입 (BadRequest, Unauthorized, InternalServerError 등)
   */
  error: string;

  /**
   * 요청 경로
   */
  path: string;

  /**
   * 에러 발생 시간 (ISO 8601)
   */
  timestamp: string;

  /**
   * 스택 트레이스 (개발 환경에서만 노출)
   */
  stack?: string;
}
