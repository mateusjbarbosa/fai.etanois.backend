import { IUpdateElement, IElementUpdated, EUpdateError } from './types-generic'; 
import { to } from '../../core/util/util';

export default class UpdateElementGeneric {
  private element: IUpdateElement;

  constructor(element: IUpdateElement) {
    this.element = element;
  }

  public async runUpdateElement(): Promise<IElementUpdated> {
    let element_updated: IElementUpdated = {};

    element_updated.big_mistake = EUpdateError.ERR_NONE;

    if (this.element.read_element && Array.isArray(this.element.args_read_element)) {
      const [err_read, success_read] = await to<any>(
        this.element.read_element.apply(this, Array.from(this.element.args_read_element)))
      
      if (err_read) {
        element_updated.big_mistake = EUpdateError.ERR_READ;
      }
    }

    if (this.element.delete_element && Array.isArray(this.element.args_delete_element)) {
      const [err_delete, success_delete] = await to<any>(
        this.element.delete_element.apply(this, Array.from(this.element.args_delete_element)));
    }

    if (this.element.create_element && Array.isArray(this.element.args_create_element)) {
      const [err_create, success_create] = await to<any>(
        this.element.create_element.apply(this, Array.from(this.element.args_create_element)));
      if (err_create) {
        element_updated.big_mistake = EUpdateError.ERR_CREATE
      } else {
        element_updated.element_updated = success_create;
      }
    }

    return element_updated;
  }
}