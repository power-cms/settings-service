import { BaseUpdateCommandHandler } from '@power-cms/common/application';
import { Settings } from '../../domain/settings';
import { ISettingsRepository } from '../../domain/settings.repository';
import { IUpdateSettingsCommand } from './update-settings.command';

export class UpdateSettingsCommandHandler extends BaseUpdateCommandHandler<Settings, IUpdateSettingsCommand> {
  constructor(settingsRepository: ISettingsRepository) {
    super(settingsRepository);
  }

  protected transform(command: IUpdateSettingsCommand): Settings {
    return new Settings(command.title, command.logo);
  }
}
