import { Request, Response } from "express";
import { User } from "./typegoose/schemasDefinitions";
import { Types } from "mongoose";

export interface StartServerProps {
  app: Express;
  PORT: number;
}

export interface ErrorResponse {
  error: string;
}

export interface EncryptBcryptParams {
  data: string;
  saltRounts?: number;
}

export interface CompareBcryptParams {
  data: string;
  hash: string;
}

export interface SimetrycEncryptParams {
  data: string;
  keyDecrypt: string;
}

export interface TSGooseHandlerProps {
  connectionString: string;
}

export type ClazzT<T> = new () => T;

export interface CreateModelParams<T> {
  clazz: ClazzT<T>;
}

type DefineModelSchemasType =
  | BasePropOptions
  | ArrayPropOptions
  | MapPropOptions
  | PropOoptionsForNumber
  | VirtualOptions
  | undefined;

export interface DefineModelParams<T> {
  name: string;
  schema: Record<string, DefineModelSchemasType>;
}

export interface AddDocumentParams<T> {
  Model: ReturnModelType<ClazzT<T>>;
  data: T;
}

export interface RemoveDocumentParams<T> {
  Model: ReturnModelType<ClazzT<T>>;
  id: string;
}

export interface EditDocumentParams<T> {
  Model: ReturnModelType<ClazzT<T>>;
  id: string;
  newData: Partial<T>;
}

export interface SearchIdParams<T> {
  Model: ReturnModelType<ClazzT<T>>;
  id: string;
  transform?: Record<string, number>;
}

export interface SearchAll<T> {
  Model: ReturnModelType<ClazzT<T>>;
  transform?: Record<string, number>;
}

export interface SearchRelationsParams<T> {
  Model: ReturnModelType<ClazzT<T>>;
  id?: string;
  relationField: string;
}

export interface ContactInterface {
  id: string;
  name: string;
  number: string;
  photo: string;
}

export type ContactsUsers = ContactInterface | undefined;

export interface HostConfig {
  host: string;
  port: number;
  secure: boolean;
}

export interface MailerConfig {
  host: string;
  user: string;
  password: string;
}

export interface ReqRes {
  req: Request;
  res: Response;
}

export interface RegisterUser {
  userName: string;
  email: string;
  password: string;
  image?: string;
  dateOfBirth: Date;
}

export interface RegisteredUser {
  data: RegisterUser;
  code: string;
}

export interface SearchOneParams<T> {
  Model: ReturnModelType<ClazzT<T>>;
  condition: Partial<T>;
  transform?: Record<string, number>;
}

export type ValidatorFunction = (v: string | Date) => boolean;

export interface MailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

export interface AddActivateCodeParams {
  code: string;
  idUser: string;
}

export interface UserInterface {
  id?: string;
  _id: string;
  userName: string;
  email: string;
  password: string;
  attempts: number;
  blocked: boolean;
  active: boolean;
  dateOfBirth: Date;
}
