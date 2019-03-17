import {
  Acl,
  CommandHandlerLogger,
  IActionHandler,
  IContainer,
  ILogger,
  IRemoteProcedure,
  IService,
} from '@power-cms/common/application';
import {
  createDatabaseConnection,
  getDecorator,
  MongoConnection,
  NullLogger,
  NullRemoteProcedure,
} from '@power-cms/common/infrastructure';
import * as awilix from 'awilix';
import { CreateAction } from '../application/action/create.action';
import { ReadAction } from '../application/action/read.action';
import { UpdateAction } from '../application/action/update.action';
import { CreateSettingsCommandHandler } from '../application/command/create-settings.command-handler';
import { UpdateSettingsCommandHandler } from '../application/command/update-settings.command-handler';
import { ISettingsQuery } from '../application/query/settings.query';
import { SettingsService } from '../application/service/service';
import { ISettingsRepository } from '../domain/settings.repository';
import { MongodbSettings } from './mongodb.settings';

export const createContainer = (logger?: ILogger, remoteProcedure?: IRemoteProcedure): IContainer => {
  const container = awilix.createContainer({
    injectionMode: awilix.InjectionMode.CLASSIC,
  });

  const decorator = getDecorator(container);

  container.register({
    logger: awilix.asValue<ILogger>(logger || new NullLogger()),
    remoteProcedure: awilix.asValue<IRemoteProcedure>(remoteProcedure || new NullRemoteProcedure()),
    acl: awilix.asClass<Acl>(Acl).singleton(),

    db: awilix.asValue<MongoConnection>(createDatabaseConnection()),

    settingsRepository: awilix.asClass<ISettingsRepository>(MongodbSettings).singleton(),
    settingsQuery: awilix.asClass<ISettingsQuery>(MongodbSettings).singleton(),

    settingsCreateAction: awilix.asClass<CreateAction>(CreateAction).singleton(),
    settingsReadAction: awilix.asClass<ReadAction>(ReadAction).singleton(),
    settingsUpdateAction: awilix.asClass<UpdateAction>(UpdateAction).singleton(),

    service: awilix.asClass<IService>(SettingsService).singleton(),
  });

  decorator.decorate('createSettingsHandler', CreateSettingsCommandHandler, CommandHandlerLogger);
  decorator.decorate('updateSettingsHandler', UpdateSettingsCommandHandler, CommandHandlerLogger);

  container.register({
    actions: awilix.asValue<IActionHandler[]>([
      container.resolve<IActionHandler>('settingsCreateAction'),
      container.resolve<IActionHandler>('settingsReadAction'),
      container.resolve<IActionHandler>('settingsUpdateAction'),
    ]),
  });

  return container;
};
