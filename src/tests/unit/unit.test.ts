import {UserTest} from '../../modules/User/user.test'


class UnitTest {
  private userTest: UserTest;

  constructor() {
    this.userTest = new UserTest();

    this.test();
  }

  private test() {
    this.userTest.runTests();
  }
}

export default new UnitTest();