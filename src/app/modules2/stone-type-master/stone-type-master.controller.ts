import {BaseController} from "../BaseController";
import {Application, Request, Response} from "express";
import {JsonResponse, TryCatch} from "../../helper";
import {guard} from "../../helper/Auth";
import { Messages } from "../../constants";
import { StoneTypeMasterRepository } from "./stone-type-master.repository";
import { IStoneTypeMaster } from "./stone-type-master.types";
import StoneTypeMasterBusiness from "./stone-type-maste.business";
import { StoneTypeMasterValidation } from "./stone-type-master.validation";

export class StoneTypeMasterController extends BaseController<IStoneTypeMaster> {
    constructor() {
        super(new StoneTypeMasterBusiness(), "stoneTypeMaster", true);
        this.init();
    }

    register(express: Application) {
        express.use('/api/v1/stone-type-master',guard, this.router);
    }

    init() {
        const validation: StoneTypeMasterValidation = new StoneTypeMasterValidation();
        this.router.get("/index", TryCatch.tryCatchGlobe(this.indexBC));
        this.router.post("/" , validation.createStoneTypeMaster, TryCatch.tryCatchGlobe(this.create));
        this.router.put("/" , validation.updateStoneTypeMaster, TryCatch.tryCatchGlobe(this.update));
        this.router.delete("/", TryCatch.tryCatchGlobe(this.deleteBC));
        this.router.get("/get-by-id", TryCatch.tryCatchGlobe(this.findByIdBC));
        this.router.post("/group-by", TryCatch.tryCatchGlobe(this.groupByBC))
    }

    create = async(req: Request, res: Response): Promise<void> => {
        res.locals = {status: false, message: Messages.CREATE_FAILED}
        let {body, body:{_id, loggedInUser:{_id:loggedInUserId}}} = req
        body.createdBy = body.updatedBy = loggedInUserId
        const data = await new StoneTypeMasterRepository().create(body)
        res.locals = {status: true, message: Messages.CREATE_SUCCESSFUL, data}
        await JsonResponse.jsonSuccess(req, res, `{this.url}.create`);
    }

    update = async(req: Request, res: Response): Promise<void> => {
        res.locals = {status: false, message: Messages.UPDATE_FAILED}
        let {body, body:{_id, loggedInUser:{_id:loggedInUserId}}} = req
        body.updatedBy = loggedInUserId
        const data = await new StoneTypeMasterRepository().update(body)
        res.locals = {status: true, message: Messages.UPDATE_SUCCESSFUL, data}
        await JsonResponse.jsonSuccess(req, res, `{this.url}.create`);
    }
}