import { Controller, Get, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  @ApiOperation({
    summary: '서버 상태 체크',
    description: '서버가 정상적으로 동작하는지 확인합니다.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '서버가 정상적으로 동작 중입니다.',
  })
  @Get('/')
  healthCheck(): void {
    return;
  }
}
