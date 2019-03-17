import { Acl, ActionType, BaseAction, IActionData } from '@power-cms/common/application';
import { JoiObject } from 'joi';
import { UpdateSettingsCommandHandler } from '../command/update-settings.command-handler';
import { ISettingsQuery } from '../query/settings.query';
import { SettingsView } from '../query/settings.view';
import { validator } from '../validator/validator';

export class UpdateAction extends BaseAction {
  public name: string = 'update';
  public type: ActionType = ActionType.UPDATE;
  public validator: JoiObject = validator;

  constructor(
    private updateSettingsHandler: UpdateSettingsCommandHandler,
    private settingsQuery: ISettingsQuery,
    private acl: Acl
  ) {
    super();
  }

  public authorize(action: IActionData): Promise<boolean> {
    return this.acl
      .createBuilder(action)
      .isAdmin()
      .check();
  }

  protected async perform(action: IActionData): Promise<SettingsView> {
    await this.updateSettingsHandler.handle({ ...action.data });

    return this.settingsQuery.get();
  }
}
