import { PrismaService } from '@database/prisma/prisma.service';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';

describe('PrismaService', () => {
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService],
    }).compile();

    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(async () => {
    await prismaService.$disconnect();
  });

  it('PrismaService가 정의되어 있어야 합니다.', () => {
    expect(prismaService).toBeDefined();
  });

  describe('onModuleInit', () => {
    it('$connect를 호출해야 합니다.', async () => {
      const connectSpy = jest.spyOn(prismaService, '$connect').mockResolvedValue();
      await prismaService.onModuleInit();

      expect(connectSpy).toHaveBeenCalled();
    });
  });

  describe('onModuleDestroy', () => {
    it('$disconnect를 호출해야 합니다.', async () => {
      const disconnectSpy = jest.spyOn(prismaService, '$disconnect').mockResolvedValue();
      await prismaService.onModuleDestroy();

      expect(disconnectSpy).toHaveBeenCalled();
    });
  });

  it('Database에 연결이 되어있어야 합니다.', async () => {
    const result = await prismaService.$queryRaw`SELECT 1 as test`;
    expect(result).toBeDefined();
  });
});
