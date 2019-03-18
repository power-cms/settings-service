import { IContainer, IRemoteProcedure } from '@power-cms/common/application';
import { Db } from 'mongodb';
import { createContainer } from '../../infrastructure/awilix.container';
import { SettingsView } from '../query/settings.view';
import { ReadAction } from './read.action';
import { CreateAction } from './create.action';

const properRoute = {
  id: 'fake-id',
  title: 'Home',
  url: '/home',
};

const properData = {
  title: 'Test title',
  logo: undefined,
};

const RemoteProcedureMock = jest.fn<IRemoteProcedure, any>(() => ({
  call: async () => {
    return Promise.resolve<any>({
      data: [properRoute],
      page: 1,
      totalPages: 1,
    });
  },
}));

describe('Read action', () => {
  let container: IContainer;
  let remoteProcedure: IRemoteProcedure;

  beforeAll(async () => {
    remoteProcedure = new RemoteProcedureMock();

    container = await createContainer(undefined, remoteProcedure);
  });

  beforeEach(async () => {
    (await container.resolve<Db>('db')).dropDatabase();
    await container.resolve<CreateAction>('settingsCreateAction').execute({ data: properData });
  });

  it('Fetches settings', async () => {
    const action = container.resolve<ReadAction>('settingsReadAction');
    const result: SettingsView = await action.execute({});
    expect(JSON.parse(JSON.stringify(result))).toEqual({ ...properData, logo: null, routes: [properRoute] });
  });

  it('Authorizes anauthenticated client', async () => {
    const action = container.resolve<ReadAction>('settingsReadAction');

    const auth = await action.authorize();
    expect(auth).toBeTruthy();
  });
});
