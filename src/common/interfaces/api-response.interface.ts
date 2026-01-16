export interface IApiResponse<T = unknown> {
  /**
   * 성공 여부
   */
  isSuccess: true;

  /**
   * 응답 데이터
   */
  data: T | null;

  /**
   * 응답 생성 시간
   */
  timestamp: string;
}
