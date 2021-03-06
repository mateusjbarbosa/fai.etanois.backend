import { app, request, expect} from './helpers';
import * as status from 'http-status';
import { IUser, EPaymentMode, EUserRoles } from '../../modules/User/user.module';

export class UserIntegrationTest {
  private endpoint: string = '/api/v1/';

  constructor() {}

  runTests() {
    describe('Testes de integração dos usuários', () => {
      'use strict';
      const model = require('../../entities/');
    
      const userTest: IUser = {
        id: 100,
        name: 'Usuário Teste',
        email: 'teste@email.com',
        password: 'teste',
        cep: '37540000',
        username: 'userTest',
        payment_mode: EPaymentMode.CREDIT_CARD,
        search_distance_without_route: 100,
        search_distance_with_route: 500
      };
      const userDefault: IUser = {
        id: 1,
        name: 'Default User',
        email: 'userdafault@email.com',
        password: 'default',
        cep: '37548000',
        payment_mode: EPaymentMode.MONEY,
        username: 'userDafault',
        search_distance_without_route: 1000,
        search_distance_with_route: 500,
        role: EUserRoles.ADMIN
      };
      let token: string;
    
      beforeEach((done) => {
        model.sequelize.sync().then(() => {
          model.User.destroy({
            where: {}
          })
          .then(() => {
            return model.User.create(userDefault);
          })
          .then(() => {
            const credential = {
              username: userDefault.username,
              password: userDefault.password
            };

            request(app).post(this.endpoint + 'auth/token').send(credential).end((error, res) => {
              token = res.body.token;
              
              model.User.create(userTest)
              .then(() => {
                done();
              });
            });
          });
        });
      });
    
      describe('POST auth/token', () => {
        it('Com o email sendo fornecido, deve receber um JWT', done => {
          const credential = {
            username: userDefault.username,
            password: userDefault.password
          };
    
          request(app).post(this.endpoint + 'auth/token').send(credential).end((error, res) => {
            expect(res.status).to.equal(status.OK);
            token = res.body.token;
            done(error)
          })
        });
    
        it('Não deve gerar token, pois usuário não está cadastrado', done => {
          const credential = {
            email: 'qualquer@email.com',
            password: 'qualquer'
          };
    
          request(app).post(this.endpoint + 'auth/token').send(credential).end((error, res) => {
            expect(res.status).to.equal(status.UNAUTHORIZED);
            expect(res.body).to.empty;
            done(error);
          })
        })
      })
    
      describe('GET /api/v1/user', () => {
        it('Deve retornar um array com todos os usuários', done => {
          request(app)
          .get(this.endpoint + 'user')
          .set('Content-Type', 'application/json')
          .set('Authorization', `Bearer ${token}`)
          .end((error, res) => {
            expect(res.status).to.equal(status.OK);
            expect(res.body.payload).to.be.an('array');
            expect(res.body.payload[0].name).to.be.equal(userDefault.name);
            expect(res.body.payload[0].username).to.be.equal(userDefault.username);
            done(error);
          });
        });
      });
    
      describe('GET /api/v1/user/:id', () => {
        it('Deve retornar um array com apenas um usuário', done => {
          request(app)
          .get(this.endpoint + `user/${userDefault.id}`)
          .set('Content-Type', 'application/json')
          .set('Authorization', `Bearer ${token}`)
          .end((error, res) => {
            expect(res.status).to.equal(status.OK);
            expect(res.body.payload.id).to.equal(userDefault.id);
            expect(res.body.payload).to.have.all.keys(
              ['id', 'name', 'email', "cep", 'payment_mode', 'username',
              'search_distance_with_route', 'search_distance_without_route', 'etacoins',
              'UserPreferenceFuels']);
            done(error);
          });
        });
      });
    
      describe('POST /api/v1/user/new', () => {
        it('Deve criar um novo usuário', done => {
          const user: IUser = {
            id: 2,
            name: 'Usuário teste',
            email: 'usuario@email.com',
            password: 'novouser',
            username: 'newUser',
            cep: '37548000',
            payment_mode: EPaymentMode.MONEY,
            search_distance_without_route: 1000,
            search_distance_with_route: 5000,
            role: EUserRoles.DRIVER
          };
    
          request(app).post(this.endpoint + 'user/new')
          .send(user)
          .set('Content-Type', 'application/json')
          .end((error, res) => {
            expect(res.status).to.equal(status.OK);
            done(error);
          });
        });
      });
    
      describe('PUT /api/v1/user/:id', () => {
        it('Deve atualizar um usuário', done => {
          const user = {
            name: 'TestUpdate',
            email: 'update@email.com'
          };
    
          request(app).patch(this.endpoint + `user/${userTest.id}`)
          .send(user)
          .set('Content-Type', 'application/json')
          .set('Authorization', `Bearer ${token}`)
          .end((error, res) => {
            expect(res.status).to.equal(status.OK);
            expect(res.body.payload.name).to.eql(user.name);
            expect(res.body.payload.email).to.eql(user.email);
            done(error);
          });
        });
      });
    
      describe('DELETE /api/v1/user/:id', () => {
        it('Deve deletar um usuário', done => {
          request(app)
          .delete(this.endpoint + `user/${userTest.id}`)
          .set('Content-Type', 'application/json')
          .set('Authorization', `Bearer ${token}`)
          .end((error, res) => {
            expect(res.status).to.equal(status.OK);
            expect(res.body.payload).to.equal(1);
            done(error);
          });
        });
      });
    });
  }
}