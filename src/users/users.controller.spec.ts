import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { NotFoundException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  const usersService = {
    findAll: jest.fn((role) => {
      if (role) {
        return users.filter((user) => user.role === role);
      }
      return users;
    }),
    findOne: jest.fn((id) => {
      return users.find((user) => user.id === id);
    }),
    create: jest.fn((createUserDto) => {
      const newUser = {
        id: users.length + 1,
        ...createUserDto,
      };

      users.push(newUser);

      return newUser;
    }),
    update: jest.fn((id, updateUserDto) => {
      const foundUsers = users.find((user) => user.id === id);

      if (!foundUsers) {
        throw new NotFoundException('User not found');
      }

      const updatedUser = {
        ...foundUsers,
        ...updateUserDto,
      };

      users = users.map((user) => {
        if (user.id === id) {
          return updatedUser;
        }
        return user;
      });

      return updatedUser;
    }),
    delete: jest.fn((id) => {
      const removedUser = users.find((user) => user.id === id);

      if (!removedUser) {
        throw new NotFoundException('User not found');
      }

      users = users.filter((user) => user.id !== id);

      return removedUser;
    }),
  };
  let users;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService],
    })
      .overrideProvider(UsersService)
      .useValue(usersService)
      .compile();

    controller = module.get<UsersController>(UsersController);

    users = [
      {
        id: 1,
        name: 'John Doe',
        email: 'sincere@april.biz',
        role: 'INTERN',
      },
      {
        id: 2,
        name: 'Jane Doe',
        email: 'Shanna@melissa.tv',
        role: 'INTERN',
      },
      {
        id: 3,
        name: 'Alice',
        email: 'nathan@yesenia.net',
        role: 'ENGINEER',
      },
      {
        id: 4,
        name: 'Bob',
        email: 'julianne.oconner@kory.org',
        role: 'ENGINEER',
      },
      {
        id: 5,
        name: 'Charlie',
        email: 'lucio_hettinger@annie.ca',
        role: 'ADMIN',
      },
    ];
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return all users', () => {
    expect(controller.findAll()).toStrictEqual(users);
  });

  it('should return all users with role INTERN', () => {
    expect(controller.findAll('INTERN')).toStrictEqual(
      users.filter((user) => user.role === 'INTERN'),
    );
  });

  it('should return all users with role ENGINEER', () => {
    expect(controller.findAll('ENGINEER')).toStrictEqual(
      users.filter((user) => user.role === 'ENGINEER'),
    );
  });

  it('should return all users with role ADMIN', () => {
    expect(controller.findAll('ADMIN')).toStrictEqual(
      users.filter((user) => user.role === 'ADMIN'),
    );
  });

  it('should return a user by id', () => {
    expect(controller.findOne(1)).toStrictEqual(users[0]);
  });

  it('should create a user', () => {
    const newUser: CreateUserDto = {
      name: 'Eve',
      email: 'eve@ning.com',
      role: 'INTERN',
    };

    expect(controller.create(newUser)).toStrictEqual({
      id: 6,
      ...newUser,
    });
  });

  it('should update a user', () => {
    const updateUserDto = {
      name: 'John Doe',
    };

    expect(controller.update(1, updateUserDto)).toStrictEqual({
      ...users.find((user) => user.id === 1),
      ...updateUserDto,
    });
  });

  it('should not update a user', () => {
    const updateUserDto = {
      name: 'John Doe',
    };

    expect(() => controller.update(10, updateUserDto)).toThrow(
      'User not found',
    );
  });

  it('should delete a user', () => {
    const deletedUser = users[0];

    expect(controller.delete(1)).toStrictEqual(deletedUser);
  });

  it('should not delete a user', () => {
    expect(() => controller.delete(10)).toThrow('User not found');
  });
});
