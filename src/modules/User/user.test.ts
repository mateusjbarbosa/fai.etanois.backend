import { expect } from '../../tests/unit/helpers';
import User from './user.service';
import { IUser, EUserRoles, EPaymentMode } from './user.module';

export class UserTest {
  constructor() {}

  public runTests(): void {
    describe('Unit Test: User', () => {
      'use strict';
      const model = require('../../entities');
      const defaultUser: IUser = {
        id: 1,
        name: 'Default User',
        email: 'defaultuser@email.com',
        password: '1234',
        phone_number: '35984552145',
        cep: '37540000',
        search_distance: 1000,
        payment_mode: EPaymentMode.BOTH,
        role: EUserRoles.ADMIN
      };
    
      beforeEach((done) => {
        model.sequelize.sync().then(() => {
          model.User.destroy({
            where: {}
          })
          .then(() => {
            model.User.create(defaultUser)
            .then(() => {
              console.log('User default created');
              done();
            });
          });
        });
      });
    
      describe('Method create', () => {
        it('Deve criar um novo usuário', () => {
          const newUser: IUser = {
            id: 2,
            name: 'Novo Usuário',
            email: 'novousuario@email.com',
            password: '1234',
            cep: '37548000',
            search_distance: 200,
            payment_mode: EPaymentMode.CREDIT_CARD,
          };
    
          return User.create(newUser)
          .then(data => {
            expect(data.dataValues).to.have.all.keys(
              ['email', 'id', 'name', 'password', 'phone_number', 'cep', 'payment_mode', 'role',
              'search_distance', 'updatedAt', 'createdAt']
            );
          })
        });
      });
    
      describe('Método update', () => {
        it('Deve atualizar um usuáiro', () => {
          const userUpdate = {
            name: 'Nome atualizado',
            email: 'atualizado@email.com'
          }
    
          return User.update(defaultUser.id, userUpdate, EUserRoles.ADMIN).then(data => {
            expect(data[0]).to.be.equal(1);
          })
        });
      });
    
      describe('Método get users', () => {
        it('Deve retornar uma lista com todos os usuários', () => {
          return User.getAll().then(data => {
            expect(data).to.be.an('array');        
          });
        });
      });
    
      describe('Método get by id', () => {
        it('Deve retornar um usuário de acordo com o id passado', () => {
          return User.getById(defaultUser.id).then(data => {
            expect(data).to.have.all.keys(
              ['email', 'id', 'name', 'cep', 'payment_mode', 'phone_number', 'search_distance']
            );
          });
        });
      });
    
      describe('Método delete', () => {
        it('Deve deletar um usuário', () => {
          return User.delete(defaultUser.id).then(data => {
            expect(data).to.be.equal(1);
          })
        });
      });
    });
  }
}