import { Request, Response} from 'express';

class UserController {
  constructor() {}

  public create(req: Request, res: Response) {
    return res.sendStatus(200);
  }

  public readOnly(req: Request, res: Response) {
    return res.sendStatus(200);
  }

  public readAll(req: Request, res: Response) {
    return res.sendStatus(200);
  }

  public update(req: Request, res: Response) {
    return res.sendStatus(200);
  }

  public delete(req: Request, res: Response) {
    return res.sendStatus(200);
  }
}

export default new UserController();