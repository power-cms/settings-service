import { IContainer } from '@power-cms/common/application';
import { createContainer } from '../../infrastructure/awilix.container';
import { SettingsService } from './service';

describe('Service', () => {
  let container: IContainer;

  beforeAll(async () => {
    container = await createContainer();
  });

  it('Creates service', async () => {
    const service = container.resolve<SettingsService>('service');

    expect(service.name).toBe('settings');
    expect(Array.isArray(service.actions)).toBeTruthy();
  });
});
