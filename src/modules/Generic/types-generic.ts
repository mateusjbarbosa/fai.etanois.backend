export interface IUpdateElement {
  delete_element?: Function | null;
  args_delete_element?: any[];

  create_element?: Function | null;
  args_create_element?: any[];
  
  read_element?: Function | null;
  args_read_element?: any[];
}

export enum EUpdateError {
  ERR_NONE,
  ERR_READ,
  ERR_DELETE,
  ERR_CREATE
}

export interface IElementUpdated {
  big_mistake?: EUpdateError;
  element_updated?: any;
}