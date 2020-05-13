import { IFuel, createFuels, create, IFuelDetail } from './fuel.module';
import * as Bluebird from 'bluebird';
import { to } from '../../core/util/util';
const model = require('../../entities');

class Fuel {
  constructor() {}

  public async create(fuel: any): Promise<IFuel>{

    const [err, success] = await to<any>(model.Fuel.create(fuel));

    if (err) {
      throw err;
    }

    return (create(success));
  }
  
  public async getAll(): Bluebird<IFuel[]>{
    const [err, success] = await to<any>(model.Fuel.findAll({
      order: ['name']
    }));

    if (err) {
      console.log(err);
    }

    return createFuels(success);
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