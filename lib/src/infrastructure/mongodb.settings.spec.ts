import { IContainer } from '@power-cms/common/application';
import { Id, PersistanceException } from '@power-cms/common/src/domain';
import { Db } from 'mongodb';
import { Settings } from '../domain/settings';
import { ISettingsRepository } from '../domain/settings.repository';
import { createContainer } from './awilix.container';

const MockCollection = jest.fn(() => ({
  insertOne: jest.fn(() => {
    throw new Error();
  }),
}));

const properData = new Settings('title', undefined);

describe('Mongodb handler', () => {
  let container: IContainer;

  beforeAll(async () => {
    container = await createContainer();
  });

  beforeEach(async () => {
    (await container.resolve<Db>('db')).dropDatabase();
  });

  it('Throws persistance exception', async () => {
    const db = await container.resolve<Db>('db');
    // @ts-ignore
    db.collection = MockCollection;

    const mongoHandler: ISettingsRepository = container.resolve<ISettingsRepository>('settingsRepository');

    expect.assertions(2);

    await expect(mongoHandler.create(properData)).rejects.toThrowError(PersistanceException);
    await expect(mongoHandler.update(properData)).rejects.toThrowError(PersistanceException);
  });
});
