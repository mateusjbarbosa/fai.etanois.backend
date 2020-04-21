import * as passport from 'passport';
import { Strategy, ExtractJwt} from 'passport-jwt';
import User from '../User/user.service'
import Configuration from '../../config/config';

class AuthService {
  config() {
    let opts = {
      secretOrKey: Configuration.secret,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
    };

    passport.use(new Strategy(opts, (jwtPayload, done) => {
      User.getUserForAuthorization(jwtPayload.email, jwtPayload.username).then(user => {
        if (user && (user.password == jwtPayload.password) && (user.id == jwtPayload.id)) {
          return done(null, {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role
          });
        }
  
        return done(null, false);
      })
      .catch(error => {
        done(error, null);
      });
    }));
  
    return {
      initialize: () => passport.initialize(),
      authenticate: () => passport.authenticate('jwt', {session: false})
    }
  }
}

export default new AuthService().config();