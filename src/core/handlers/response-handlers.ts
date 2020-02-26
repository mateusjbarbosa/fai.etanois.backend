import { Request, Response, ErrorRequestHandler, NextFunction } from 'express';
import * as HttpStatus from 'http-status';
import * as jwt from 'jwt-simple';
import * as bcrypt from 'bcrypt';
import Configuration from '../../config/config';

class Handlers {
  authFail(req: Request, res: Response) {
    res.sendStatus(HttpStatus.UNAUTHORIZED);
  }

  authSuccess(res: Response, credentials: any, data: any) {
    const isMatch = bcrypt.compareSync(credentials.password, data.password);
  
    if (isMatch) {
      const payload = {id: data.id};
      res.json({
        token: jwt.encode(payload, Configuration.secret)
      });
    } else {
      res.sendStatus(HttpStatus.UNAUTHORIZED);
    }
  }

  onError(res: Response, menssage: string, err: any) {
    console.log(`Error: ${err}`);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ payload: menssage });
  }

  onSuccess(res: Response, data: any) {
    res.status(HttpStatus.OK).json({ payload: data });
  }

  errorHandlerApi(err: ErrorRequestHandler, req: Request, res: Response, next: NextFunction) {
    console.log(`API error handler was executed: ${err}`);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      errorCode: 'ERR-001',
      message: 'Internal error'
    });
  }

  dbErrorHandler(res: Response, err: any) {
    let errors: string[] = new Array();
    console.log(`Db error: ${err}`)

    if (err.errors) {
      err.errors.forEach(element => {
        if (element.message) {
          errors.push(element.message);
        }
      });
    }

    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      code: 'ERR-002',
      message: errors
    });
  }
}

export default new Handlers();