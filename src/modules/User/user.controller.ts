import { Request, Response} from 'express';
import * as _ from 'lodash';
import User from './user.service';
import Handlers from '../../core/handlers/response-handlers';

class UserController {
  constructor() {}

  public create(req: Request, res: Response) {
    User.create(req.body)
    .then(_.partial(Handlers.onSuccess, res))
    .catch(_.partial(Handlers.dbErrorHandler, res))
    .catch(_.partial(Handlers.onError, res, 'Error inserting new user'));
  }

  public readOnly(req: Request, res: Response) {
    const userId = parseInt(req.params.id);

    User.getById(userId)
    .then(_.partial(Handlers.onSuccess, res))
    .catch(_.partial(Handlers.onError, res, 'User not found'));
  }

  public readAll(req: Request, res: Response) {
    User.getAll()
    .then(_.partial(Handlers.onSuccess, res))
    .catch(_.partial(Handlers.onError, res, 'Error fetching all users'));
  }

  public update(req: Request, res: Response) {
    const userId = parseInt(req.params.id);
    const props = req.body;
    
    User.update(userId, props)
    .then(_.partial(Handlers.onSuccess, res))
    .catch(_.partial(Handlers.dbErrorHandler, res))
    .catch(_.partial(Handlers.onError, res, 'Error updating user'));
  }

  public delete(req: Request, res: Response) {
    const userId = parseInt(req.params.id);
    
    User.delete(userId)
    .then(_.partial(Handlers.onSuccess, res))
    .catch(_.partial(Handlers.onError, res, 'Error deleting user'));
  }
}

export default new UserController();