import * as passport from 'passport';
import { Strategy, ExtractJwt} from 'passport-jwt';
import User from '../User/user.service'
import Configuration from '../../config/config';
import { to } from '../../core/util/util';
import { IUserForAuthorization } from '../User/user.module';

class AuthService {
  config() {
    let opts = {
      secretOrKey: Configuration.secret,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
    };

    passport.use(new Strategy(opts, async(jwtPayload, done) => {
      const [err, user] =  await to<IUserForAuthorization>(User.getUserForAuthorization(
        jwtPayload.email, jwtPayload.username, null));

      if (err) {
        return (done(err, null));
      }

      if (user && (user.password == jwtPayload.password) && (user.id == jwtPayload.id)) {
        return done(null, {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role
        });
      }

      return done(null, false);
    }));
  
    return {
      initialize: () => passport.initialize(),
      authenticate: () => passport.authenticate('jwt', {session: false})
    }
  }
}

export default new AuthService().config();