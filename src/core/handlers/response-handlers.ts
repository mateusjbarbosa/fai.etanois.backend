import { Request, Response, ErrorRequestHandler, NextFunction } from 'express';
import * as HttpStatus from 'http-status';
import * as jwt from 'jwt-simple';
import * as bcrypt from 'bcrypt';
import Configuration from '../../config/config';

class Handlers {
  authFail(req: Request, res: Response) {
    res.sendStatus(HttpStatus.UNAUTHORIZED);
  }

  authSuccess(res: Response, password: any, data: any) {
    const isMatch = bcrypt.compareSync(password, data.password);

    if (isMatch) {
      this.generateToken(res, data)
    } else {
      res.sendStatus(HttpStatus.UNAUTHORIZED);
    }
  }

  generateToken(res: Response, data: any) {
    const payload = {id: data.id, password: data.password, email: data.email,
      username: data.username};

    res.status(HttpStatus.OK).json({
      token: jwt.encode(payload, Configuration.secret)
    });
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