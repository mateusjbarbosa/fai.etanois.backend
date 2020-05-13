import {UserIntegrationTest} from './users.test';

class IntegrationTest {
  private userTest: UserIntegrationTest;

  constructor() {
    this.userTest = new UserIntegrationTest();

    this.runTest();
  }

  private runTest() {
    this.userTest.runTests();
  }
}

export default new IntegrationTest();