import { IContainer, IRemoteProcedure } from '@power-cms/common/application';
import { ValidationException, Id } from '@power-cms/common/domain';
import { validate } from '@power-cms/common/infrastructure';
import { Db } from 'mongodb';
import { createContainer } from '../../infrastructure/awilix.container';
import { SettingsView } from '../query/settings.view';
import { UpdateAction } from './update.action';
import { CreateAction } from './create.action';

const RemoteProcedureMock = jest.fn<IRemoteProcedure, any>(() => ({
  call: jest.fn(),
}));

const properData = {
  title: 'Test title',
  logo: 'logo',
};

const updateData = {
  title: 'New test title',
  logo: 'new logo',
};

describe('Update action', () => {
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

  it('Updates settings', async () => {
    const action = container.resolve<UpdateAction>('settingsUpdateAction');
    const result: SettingsView = await action.execute({ data: updateData });

    expect(JSON.parse(JSON.stringify(result))).toEqual({ ...properData, ...updateData });
  });

  it('Validates settings', async () => {
    const action = container.resolve<UpdateAction>('settingsUpdateAction');

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

  it('Calls authorize action', async () => {
    const action = container.resolve<UpdateAction>('settingsUpdateAction');

    await action.authorize({});
    expect(remoteProcedure.call).toBeCalled();
  });
});
