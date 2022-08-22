import { Test, TestingModule } from '@nestjs/testing';
import { Save } from './dto/save.dto';
import { UserController } from './user.controller';
import { UserEntity } from './user.entity';
import { UserService } from './user.service';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
    expect(userService).toBeDefined();
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

      jest.spyOn(userService, 'save').mockResolvedValueOnce(userEntityMock);

      const result = await userService.save(data);

      expect(result).toBeDefined();
      expect(userService.save).toHaveBeenCalledTimes(1);
    });
  });
});
