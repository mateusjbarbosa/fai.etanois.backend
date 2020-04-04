import { IFuel, createFuels, create } from './fuel.module';
import * as Bluebird from 'bluebird';
const model = require('../../entities');

class Fuel {
  constructor() {}

  create(fuel: any): Promise<any>{
    if (fuel.name) {
      return model.Fuel.create(fuel);
    } else {
      throw new Error('Name of fuel is required').message;
    }
  }
  
  getAll(): Bluebird<IFuel[]>{
    return model.Fuel.findAll({
      order: ['name']
    })
    .then(createFuels);
  }

  update(oldName: string, newName: string){
    return model.Fuel.update(newName, {
      where: {name: oldName},
      fields: [ 'name' ],
      hooks: true,
      individualHooks: true
    })
    .then(create);
  }

  delete(name: string){
    return model.Fuel.destroy({
      where: {name}
    });
  }
}

export default new Fuel();