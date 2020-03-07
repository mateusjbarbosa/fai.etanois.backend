 import * as Chai from 'chai';
 import * as td from 'testdouble';
 import { CoreModule } from '../../core/core'

 const supertest = require('supertest');

 const app = new CoreModule();
 const request = supertest;
 const expect = Chai.expect;
 const testDouble = td;

 export { app, request, expect, testDouble };