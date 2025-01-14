import { Test, TestingModule } from '@nestjs/testing';
import { EmployeesController } from './employees.controller';
import { EmployeesService } from './employees.service';
import { Prisma } from '@prisma/client';

describe('EmployeesController', () => {
  let controller: EmployeesController;
  const createEmployeeDto: Prisma.EmployeeCreateInput = {
    name: 'John Doe',
    role: 'ENGINEER',
    email: 'john@doe.com',
  };
  const createdEmployee = {
    id: 1,
    ...createEmployeeDto,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  const updateEmployeeDto: Prisma.EmployeeUpdateInput = {
    name: 'Jane Doe',
    role: 'ADMIN',
  };
  const updatedEmployee = {
    ...createdEmployee,
    ...updateEmployeeDto,
    updatedAt: new Date(),
  };
  const mockEmployeesService = {
    create: jest.fn(({}: Prisma.EmployeeCreateInput) => {
      return createdEmployee;
    }),
    findAll: jest.fn((role?: 'INTERN' | 'ENGINEER' | 'ADMIN') => {
      if (role) return [createdEmployee].filter((e) => e.role === role);
      return [createdEmployee];
    }),
    findOne: jest.fn((id: number) => {
      return createdEmployee.id === id ? createdEmployee : undefined;
    }),
    update: jest.fn((id: number, {}: Prisma.EmployeeUpdateInput) => {
      return createdEmployee.id === id ? updatedEmployee : undefined;
    }),
    remove: jest.fn((id: number) => {
      return createdEmployee.id === id ? createEmployeeDto : undefined;
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmployeesController],
      providers: [EmployeesService],
    })
      .overrideProvider(EmployeesService)
      .useValue(mockEmployeesService)
      .compile();

    controller = module.get<EmployeesController>(EmployeesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create an employee', async () => {
    const result = await controller.create(createEmployeeDto);
    expect(result).toStrictEqual(createdEmployee);
  });

  it('should find all employees', async () => {
    const result = await controller.findAll('192.168.1.1');
    expect(result).toStrictEqual([createdEmployee]);
  });

  it('should not find all employees', async () => {
    const result = await controller.findAll('192.168.1.1', 'ADMIN');
    expect(result).toStrictEqual([]);
  });

  it('should find an employee by id', async () => {
    const result = await controller.findOne(1);
    expect(result).toStrictEqual(createdEmployee);
  });

  it('should not find an employee by id', async () => {
    const result = await controller.findOne(2);
    expect(result).toBeUndefined();
  });

  it('should update an employee', async () => {
    const result = await controller.update(1, updateEmployeeDto);
    expect(result).toStrictEqual(updatedEmployee);
  });

  it('should not update an employee', async () => {
    const result = await controller.update(2, updateEmployeeDto);
    expect(result).toBeUndefined();
  });

  it('should remove an employee', async () => {
    const result = await controller.remove(1);
    expect(result).toStrictEqual(createEmployeeDto);
  });
  it('should not remove an employee', async () => {
    const result = await controller.remove(2);
    expect(result).toBeUndefined();
  });
});
