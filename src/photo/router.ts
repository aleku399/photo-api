import Datauri from "datauri";
import { Request, Router } from "express";
import multer from "multer";
import * as path from "path";
import { wrapAsyncHandler } from "../express";
import { PhotoAttrs } from "./model";
import { create } from "./operations/create";
import { list } from "./operations/list";
import { cloudinaryConfig } from "../config";

const router = Router();

export type ContactBody = Omit<PhotoAttrs, "createdAt" | "updatedAt">;

export interface MulterFile {
  key: string;
  path: string;
  mimetype: string;
  originalname: string;
  size: number;
  buffer: unknown;
}

export interface File {
  originalname: string;
  buffer: unknown;
}

export interface ProfileFiles {
  photos: string;
}

export const dataUri = (req: File): { content: string } =>
  new Datauri().format(path.extname(req.originalname).toString(), req.buffer);

const storage = multer.memoryStorage();

const multerUploads = multer({ storage }).fields([
  { name: "document", maxCount: 1 }
]);

router.post(
  "/",
  multerUploads,
  wrapAsyncHandler(async (req: Request, res) => {

    const details = req.files && await getDocumentUrl(JSON.parse(JSON.stringify(req.files)))
    
    const data = await create(details);
    return res.json({ data });
  })
);

router.get(
  "/",
  wrapAsyncHandler(async (req, res) => {
    const data = await list(req.query);
    return res.json({ data });
  })
);

async function getDocumentUrl(files: {
  document: File[];
}): Promise<ProfileFiles> {
  let documentUrl = null;

  if (files.document) {
    const documentFile: string = dataUri(files.document[0]).content;
    documentUrl = (await cloudinaryConfig(documentFile)) as string;
  }

  return {
    photos: documentUrl
  };
}

export default router;
