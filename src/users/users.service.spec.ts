import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

describe('UsersService', () => {
  let service: UsersService;
  let users;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);

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
    expect(service).toBeDefined();
  });

  it('should return all users', () => {
    expect(service.findAll()).toStrictEqual(users);
  });

  it('should return all users with role INTERN', () => {
    expect(service.findAll('INTERN')).toStrictEqual(
      users.filter((user) => user.role === 'INTERN'),
    );
  });

  it('should return all users with role ENGINEER', () => {
    expect(service.findAll('ENGINEER')).toStrictEqual(
      users.filter((user) => user.role === 'ENGINEER'),
    );
  });

  it('should return all users with role ADMIN', () => {
    expect(service.findAll('ADMIN')).toStrictEqual(
      users.filter((user) => user.role === 'ADMIN'),
    );
  });

  it('should find a user by id', () => {
    expect(service.findOne(1)).toStrictEqual(users[0]);
  });

  it('should throw an error when user is not found', () => {
    expect(() => service.findOne(6)).toThrow('User not found');
  });

  it('should create a new user', () => {
    const newUser: CreateUserDto = {
      name: 'Eve',
      email: 'eve@ning.com',
      role: 'INTERN',
    };
    service.create(newUser);
    expect(service.findAll()).toContainEqual({
      id: 6,
      ...newUser,
    });
  });

  it('should update a user', () => {
    const updatedUser = {
      name: 'Alice',
    };
    service.update(3, updatedUser);
    expect(service.findOne(3)).toStrictEqual({
      ...users.find((user) => user.id === 3),
      ...updatedUser,
    });
  });

  it('should not update a user when user is not found', () => {
    expect(() => service.update(6, {})).toThrow('User not found');
  });

  it('should delete a user', () => {
    const removedUser = service.delete(1);
    expect(service.findAll()).not.toContainEqual(removedUser);
  });

  it('should not delete a user when user is not found', () => {
    expect(() => service.delete(6)).toThrow('User not found');
  });
});
