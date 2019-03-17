import { IActionHandler, IService } from '@power-cms/common/application';

export class SettingsService implements IService {
  public name: string = 'settings';

  constructor(public actions: IActionHandler[]) {}
}
