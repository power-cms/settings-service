import { SettingsView } from './settings.view';

export interface ISettingsQuery {
  get(): Promise<SettingsView>;
}
