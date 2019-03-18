import { ActionType, BaseAction, IActionData, IPaginationView, IRemoteProcedure } from '@power-cms/common/application';
import { FullSettingsView } from '../query/full-settings.view';
import { RouteView } from '../query/route.view';
import { ISettingsQuery } from '../query/settings.query';

export class ReadAction extends BaseAction {
  public name: string = 'read';
  public type: ActionType = ActionType.READ;

  constructor(private settingsQuery: ISettingsQuery, private remoteProcedure: IRemoteProcedure) {
    super();
  }

  public async authorize(): Promise<boolean> {
    return true;
  }

  protected async perform(action: IActionData): Promise<FullSettingsView> {
    const settings = await this.settingsQuery.get();

    const sites: IPaginationView<any> = await this.remoteProcedure.call('site', ActionType.COLLECTION, {
      auth: action.auth,
      query: { limit: 100 },
    });
    const routes = sites.data.map((site: any) => new RouteView(site.id, site.url, site.title));

    return new FullSettingsView(settings.title, routes, settings.logo);
  }
}
