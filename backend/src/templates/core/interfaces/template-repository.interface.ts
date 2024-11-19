import { ITemplate } from './template.interface';

export interface ITemplateRepository<T extends ITemplate> {
  findActive(): Promise<T[]>;

  findActiveById(id: string): Promise<T | null>;

  create(template: Partial<T>): Promise<T>;

  update(id: string, template: Partial<T>): Promise<T>;

  deactivate(id: string): Promise<void>;

  findValidAt(date: Date): Promise<T[]>;
}
