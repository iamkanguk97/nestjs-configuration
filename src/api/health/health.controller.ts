import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Health')
@Controller('/health')
export class HealthController {
  /**
   * 서버 상태 체크 API
   *
   * @remarks 서버가 정상적으로 동작하는지 확인합니다.
   *
   * @throws {500} 서버 오류
   */
  @Get('/')
  @HttpCode(HttpStatus.OK)
  healthCheck(): void {
    return;
  }
}
