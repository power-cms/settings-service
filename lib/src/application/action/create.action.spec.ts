import { IContainer, IRemoteProcedure } from '@power-cms/common/application';
import { ValidationException, Id } from '@power-cms/common/domain';
import { validate } from '@power-cms/common/infrastructure';
import { Db } from 'mongodb';
import { createContainer } from '../../infrastructure/awilix.container';
import { SettingsView } from '../query/settings.view';
import { CreateAction } from './create.action';

const RemoteProcedureMock = jest.fn<IRemoteProcedure, any>(() => ({
  call: jest.fn(),
}));

const properData = {
  title: 'Test title',
  logo: 'logo',
};

describe('Create action', () => {
  let container: IContainer;
  let remoteProcedure: IRemoteProcedure;

  beforeAll(async () => {
    remoteProcedure = new RemoteProcedureMock();

    container = await createContainer(undefined, remoteProcedure);
  });

  beforeEach(async () => {
    (await container.resolve<Db>('db')).dropDatabase();
  });

  it('Creates settings', async () => {
    const action = container.resolve<CreateAction>('settingsCreateAction');
    const { ...result }: SettingsView = await action.execute({ data: properData });

    expect(result).toEqual(properData);
  });

  it('Validates settings', async () => {
    const action = container.resolve<CreateAction>('settingsCreateAction');

    expect.assertions(2);

    expect(() => {
      validate({}, action.validator);
    }).toThrowError(ValidationException);

    try {
      validate({}, action.validator);
    } catch (e) {
      const messageRequired = 'any.required';

      expect(e.details).toEqual([{ path: 'title', message: messageRequired }]);
    }
  });

  it('Authorizes anauthenticated client', async () => {
    const action = container.resolve<CreateAction>('settingsCreateAction');

    const auth = await action.authorize();
    expect(auth).toBeTruthy();
  });
});
