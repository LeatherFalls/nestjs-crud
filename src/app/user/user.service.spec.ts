import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Save } from './dto/save.dto';
import { UserEntity } from './user.entity';
import { UserService } from './user.service';

describe('UserService', () => {
  let userService: UserService;
  let userRepository: Repository<UserEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get<Repository<UserEntity>>(
      getRepositoryToken(UserEntity),
    );
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
    expect(userRepository).toBeDefined();
  });

  describe('save method:', () => {
    it('should save a new user with sucess', async () => {
      const data: Save = {
        username: 'test_name',
        email: 'test@test.com',
        password: 'test_password',
        age: 20,
      };

      const userEntityMock = {
        username: 'test_name',
        email: 'test@test.com',
        password: 'test_password',
        age: 20,
      } as UserEntity;

      jest.spyOn(userRepository, 'create').mockReturnValueOnce(userEntityMock);

      jest.spyOn(userRepository, 'save').mockResolvedValueOnce(userEntityMock);

      const result = await userService.save(data);

      expect(result).toBeDefined();
      expect(userRepository.create).toBeCalledTimes(1);
      expect(userRepository.save).toBeCalledTimes(1);
    });
  });
});
