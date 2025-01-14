import { Test, TestingModule } from '@nestjs/testing';
import { EmployeesService } from './employees.service';
import { DatabaseService } from '../database/database.service';
import { Prisma } from '@prisma/client';
import { query } from 'express';

describe('EmployeesService', () => {
  let service: EmployeesService;
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
  const mockedDatabaseService = {
    employee: {
      create: jest.fn(({}: Prisma.EmployeeCreateInput) => {
        return createdEmployee;
      }),
      findMany: jest.fn((query) => {
        if (query?.where)
          return [createdEmployee].filter((e) => e.role === query.where.role);
        return [createdEmployee];
      }),
      findUnique: jest.fn((query) => {
        return createdEmployee.id === query.where.id
          ? createdEmployee
          : undefined;
      }),
      update: jest.fn((query) => {
        return createdEmployee.id === query.where.id
          ? updatedEmployee
          : undefined;
      }),
      delete: jest.fn((query) => {
        return createdEmployee.id === query.where.id
          ? createdEmployee
          : undefined;
      }),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmployeesService, DatabaseService],
    })
      .overrideProvider(DatabaseService)
      .useValue(mockedDatabaseService)
      .compile();

    service = module.get<EmployeesService>(EmployeesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create an employee', async () => {
    expect(await service.create(createEmployeeDto)).toStrictEqual(
      createdEmployee,
    );
  });

  it('should find all employees', async () => {
    expect(await service.findAll()).toStrictEqual([createdEmployee]);
  });

  it('should find all employees by role', async () => {
    expect(await service.findAll('ENGINEER')).toStrictEqual([createdEmployee]);
  });

  it('should not find any employees by role', async () => {
    expect(await service.findAll('ADMIN')).toStrictEqual([]);
  });

  it('should find an employee', async () => {
    expect(await service.findOne(1)).toStrictEqual(createdEmployee);
  });

  it('should not find an employee', async () => {
    expect(await service.findOne(2)).toBeUndefined();
  });

  it('should update an employee', async () => {
    expect(await service.update(1, updateEmployeeDto)).toStrictEqual(
      updatedEmployee,
    );
  });

  it('should not update an employee', async () => {
    expect(await service.update(2, updateEmployeeDto)).toBeUndefined();
  });

  it('should remove an employee', async () => {
    expect(await service.remove(1)).toStrictEqual(createdEmployee);
  });

  it('should not remove an employee', async () => {
    expect(await service.remove(2)).toBeUndefined();
  });
});
