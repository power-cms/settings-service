import { PersistanceException } from '@power-cms/common/domain';
import { Collection, Db, ObjectID } from 'mongodb';
import { ISettingsQuery } from '../application/query/settings.query';
import { SettingsView } from '../application/query/settings.view';
import { Settings } from '../domain/settings';
import { ISettingsRepository } from '../domain/settings.repository';

export class MongodbSettings implements ISettingsRepository, ISettingsQuery {
  private static COLLECTION_NAME = 'settings';

  constructor(private readonly db: Promise<Db>) {}

  public async get(): Promise<SettingsView> {
    const collection = await this.getCollection();
    const settings = await collection.findOne({});

    return this.toView(settings);
  }

  public async create(settings: Settings): Promise<void> {
    try {
      const collection = await this.getCollection();
      await collection.insertOne({
        _id: new ObjectID(),
        title: settings.getTitle(),
        logo: settings.getLogo(),
      });
    } catch (e) {
      throw PersistanceException.fromError(e);
    }
  }

  public async update(settings: Settings): Promise<void> {
    try {
      const collection = await this.getCollection();
      await collection.updateOne(
        {},
        {
          $set: {
            title: settings.getTitle(),
            logo: settings.getLogo(),
          },
        }
      );
    } catch (e) {
      throw PersistanceException.fromError(e);
    }
  }

  private toView(data: any): SettingsView {
    return new SettingsView(data.title, data.logo);
  }

  private async getCollection(): Promise<Collection> {
    const db = await this.db;

    return db.collection(MongodbSettings.COLLECTION_NAME);
  }
}
