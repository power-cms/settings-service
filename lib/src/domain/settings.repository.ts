import { ICreateRepository, IUpdateRepository } from '@power-cms/common/domain';
import { Settings } from './settings';

export interface ISettingsRepository extends ICreateRepository<Settings>, IUpdateRepository<Settings> {}
