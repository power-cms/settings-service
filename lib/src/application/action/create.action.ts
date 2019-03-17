import { BaseCreateAction } from '@power-cms/common/application';
import { JoiObject } from 'joi';
import { CreateSettingsCommandHandler } from '../command/create-settings.command-handler';
import { ISettingsQuery } from '../query/settings.query';
import { SettingsView } from '../query/settings.view';
import { validator } from '../validator/validator';

export class CreateAction extends BaseCreateAction<SettingsView> {
  public validator: JoiObject = validator;
  public private = true;

  constructor(createSettingsHandler: CreateSettingsCommandHandler, settingsQuery: ISettingsQuery) {
    super(createSettingsHandler, settingsQuery);
  }

  public async authorize(): Promise<boolean> {
    return true;
  }
}
