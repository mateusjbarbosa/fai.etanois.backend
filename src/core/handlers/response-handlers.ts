import { Request, Response, ErrorRequestHandler, NextFunction } from 'express';
import Authenticate from '../../modules/Auth/authenticate.service';
import * as HttpStatus from 'http-status';
import * as bcrypt from 'bcrypt';

class Handlers {
  authFail(req: Request, res: Response) {
    res.sendStatus(HttpStatus.UNAUTHORIZED);
  }

  authSuccess(res: Response, password: any, data: any) {
    const isMatch = bcrypt.compareSync(password, data.password);

    if (isMatch) {
      this.sendToken(res, data)
    } else {
      res.sendStatus(HttpStatus.UNAUTHORIZED);
    }
  }

  sendToken(res: Response, user: any) {
    const token = Authenticate.getToken(user);
    const payload = {
      token: token,
      id: user.id
    }

    res.status(HttpStatus.OK).json({ payload });
  }

  onSuccess(res: Response, data: any) {
    res.status(HttpStatus.OK).json({ payload: data });
  }

  errorHandlerApi(err: ErrorRequestHandler, req: Request, res: Response, next: NextFunction) {
    console.log(`API error handler was executed: ${err}`);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      code: 'ERR-001',
      msg: ['Internal error']
    });
  }

  dbErrorHandler(res: Response, err: any) {
    let errors: string[] = new Array();

    if (err.errors) {
      err.errors.forEach(element => {
        if (element.message) {
          errors.push(element.message);
        }
      });
    }

    res.status(HttpStatus.PRECONDITION_FAILED).json({
      code: 'ERR-002',
      msg: errors
    });
  }

  onError(res: Response, menssage: string) {
    res.status(HttpStatus.PRECONDITION_FAILED).json({ 
      code: 'ERR-03',
      msg: [menssage]
    });
  }
}

export default new Handlers();