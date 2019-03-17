import { BaseCreateCommandHandler } from '@power-cms/common/application';
import { Settings } from '../../domain/settings';
import { ISettingsRepository } from '../../domain/settings.repository';
import { ICreateSettingsCommand } from './create-settings.command';

export class CreateSettingsCommandHandler extends BaseCreateCommandHandler<Settings, ICreateSettingsCommand> {
  constructor(settingsRepository: ISettingsRepository) {
    super(settingsRepository);
  }

  protected transform(command: ICreateSettingsCommand): Settings {
    return new Settings(command.title, command.logo);
  }
}
