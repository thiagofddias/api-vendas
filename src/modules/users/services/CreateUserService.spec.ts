import 'reflect-metadata';
import CreateUsersService from './CreateUserService';
import FakeUsersRepository from '../domain/repositories/fakes/FakeUsersRepository';
import AppError from '@shared/errors/AppError';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

let fakeUserRepository: FakeUsersRepository;
let createUser: CreateUsersService;
let fakeHashProvider: FakeHashProvider;

describe('CreateUser', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    createUser = new CreateUsersService(fakeUserRepository, fakeHashProvider);
  });

  it('should be able to create a new user', async () => {
    const customer = await createUser.execute({
      name: 'Dias',
      email: 'teste@teste.com',
      password: '123456',
    });

    expect(customer).toHaveProperty('id');
  });

  it('should not be able to create two users with the same email', async () => {
    await createUser.execute({
      name: 'Dias',
      email: 'teste@teste.com',
      password: '123456',
    });

    expect(
      createUser.execute({
        name: 'Dias',
        email: 'teste@teste.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
