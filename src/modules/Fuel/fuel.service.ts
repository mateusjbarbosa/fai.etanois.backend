import { IFuel, createFuels, create, IFuelDetail } from './fuel.module';
import * as Bluebird from 'bluebird';
import { to } from '../../core/util/util';
import e = require('express');
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

  public async findByName(fuel_name: string): Promise<IFuel>{
    const [err, success] = await to<any>(model.Fuel.findOne( {
      where: {name: fuel_name}
    }));

    if (err) {
      throw err
    }

    return (create(success));
  }

  public async update(old_fuel: IFuel, new_fuel: IFuel): Promise<IFuel>{
    const [err, success] = await to<any>(model.Fuel.update(new_fuel, {
      where: {name: old_fuel.name},
      fields: [ 'name' ],
      hooks: true,
      individualHooks: true
    }));

    if (err) {
      throw err;
    }

    return(create(success));
  }

  delete(name: string){
    return model.Fuel.destroy({
      where: {name}
    });
  }
}

export default new Fuel();