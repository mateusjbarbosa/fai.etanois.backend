import { expect } from '../../tests/unit/helpers';
import User from './user.service';
import { IUser, EUserRoles, EPaymentMode } from './user.module';

export class UserTest {
  constructor() {}

  private propetyExpected: string[] = ['email', 'id', 'name', 'cep', 'payment_mode', 'username',
  'search_distance_with_route', 'search_distance_without_route', 'etacoins', 'UserPreferenceFuels'];

  public runTests(): void {
    describe('Unit Test: User', () => {
      'use strict';
      const model = require('../../entities');
      const defaultUser: IUser = {
        id: 1,
        name: 'Default User',
        email: 'defaultuser@email.com',
        password: '1234',
        username: 'userDefault',
        cep: '37540000',
        search_distance_with_route: 1000,
        search_distance_without_route: 2000,
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
            username: 'newUser',
            password: '1234',
            cep: '37548000',
            search_distance_with_route: 100,
            search_distance_without_route: 200,
            payment_mode: EPaymentMode.CREDIT_CARD,
          };
    
          return User.create(newUser);
        });
      });
    
      describe('Método update', () => {
        it('Deve atualizar um usuáiro', () => {
          const userUpdate = {
            name: 'Nome atualizado',
            email: 'atualizado@email.com'
          }
    
          return User.update(defaultUser.id, userUpdate, EUserRoles.ADMIN).then(data => {
            expect(data).to.have.all.keys(
              this.propetyExpected
            );
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
              this.propetyExpected
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