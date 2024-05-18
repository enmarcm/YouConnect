import { getModelForClass, prop, ReturnModelType } from "@typegoose/typegoose";
import mongoose from "mongoose";
import {
  AddDocumentParams,
  ClazzT,
  CreateModelParams,
  DefineModelParams,
  EditDocumentParams,
  RemoveDocumentParams,
  SearchAll,
  SearchIdParams,
  SearchOneParams,
  SearchRelationsParams,
  TSGooseHandlerProps,
} from "../types";

class TSGooseHandler implements TSGooseHandlerProps {
  connectionString: string;

  constructor({ connectionString }: TSGooseHandlerProps) {
    this.connectionString = connectionString;
    this.connectToDB();
  }

  public isConnected = (): boolean => mongoose.connection.readyState === 1;

  private async connectToDB() {
    try {
      await mongoose.connect(this.connectionString);
      console.log("Connected to database");
      return;
    } catch (error) {
      console.error(`Error connecting to database: ${error}`);
      return { error: `Error connecting to database: ${error}` };
    }
  }

  async disconnectFromDB() {
    try {
      await mongoose.disconnect();
      return;
    } catch (error) {
      console.error(`Error disconnecting from database: ${error}`);
      return { error: `Error disconnecting from database: ${error}` };
    }
  }

  /**
   * Create a model using Typegoose
   */
  createModel<T>({ clazz }: CreateModelParams<T>): ReturnModelType<ClazzT<T>> {
    try {
      const Model = getModelForClass(clazz);
      Model.schema.set("toJSON", {
        transform: (_document, returnedObject) => {
          returnedObject.id = returnedObject._id.toString();
          delete returnedObject._id;
          delete returnedObject.__v;
        },
      });
      return Model;
    } catch (error) {
      console.error(error);
      throw new Error(`Error creating model for class ${clazz.name}`);
    }
  }

  /**
   * Define a class and create a model using Typegoose
   */
  defineModel<T>({
    name,
    schema,
  }: DefineModelParams<T>): ReturnModelType<ClazzT<T>> {
    class DynamicClass {
      constructor() {
        for (const key in schema) {
          if (schema.hasOwnProperty(key)) {
            const element = schema[key];
            prop(element)(this, key);
          }
        }
      }
    }
    Object.defineProperty(DynamicClass, "name", { value: name });
    const Model = getModelForClass(DynamicClass as ClazzT<T>);
    Model.schema.set("toJSON", {
      transform: (_document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
      },
    });
    return Model;
  }

  /**
   * Add a document to a model with the provided data
   */
  async addDocument<T>({ Model, data }: AddDocumentParams<T>) {
    try {
      const document = new Model(data);
      await document.save();
      return document;
    } catch (error) {
      console.error(error);
      return {
        error: `Error adding document to model ${Model.modelName}. Error: ${error}`,
      };
    }
  }

  /**
   * Remove a document from a model by its ID
   */
  async removeDocument<T>({ Model, id }: RemoveDocumentParams<T>) {
    try {
      const document = await Model.findByIdAndDelete(id);
      return document;
    } catch (error) {
      console.error(error);
      return { error: `Error removing document from model ${Model.modelName}` };
    }
  }

  /**
   * Edit a document in a model by its ID with the new data
   */
  async editDocument<T>({ Model, id, newData }: EditDocumentParams<T>) {
    try {
      const document = await Model.findByIdAndUpdate(id, newData, {
        new: true,
      });
      return document;
    } catch (error) {
      console.error(error);
      return { error: `Error editing document in model ${Model.modelName}` };
    }
  }

  /**
   * Search for one document in a model by a condition
   */
  async searchOne<T>({ Model, condition, transform }: SearchOneParams<T>) {
    try {
      const document = await Model.findOne(condition, transform);

      return document ? document : false;
    } catch (error) {
      console.error(error);
      return {
        error: `Error searching for one document in model ${Model.modelName}`,
      };
    }
  }

  /**
   * Search for a document in a model by its ID
   */
  async searchId<T>({ Model, id, transform }: SearchIdParams<T>) {
    try {
      const document = await Model.findById(id, transform);
      return document;
    } catch (error) {
      console.error(error);
      return {
        error: `Error searching for document in model ${Model.modelName}`,
      };
    }
  }

  /**
   * Search for all documents in a model
   */
  async searchAll<T>({ Model, transform }: SearchAll<T>) {
    try {
      const documents = await Model.find({}, transform);
      return documents;
    } catch (error) {
      console.error(error);
      return {
        error: `Error searching for all documents in model ${Model.modelName}`,
      };
    }
  }

  /**
   * Search for all documents in a model and their relations
   */
  async searchRelations<T>({
    Model,
    id,
    relationField,
  }: SearchRelationsParams<T>) {
    try {
      const query = id ? { _id: id } : {};
      const documents = await Model.find(query).populate(relationField);
      return documents;
    } catch (error) {
      console.error(error);
      return {
        error: `Error searching for all documents in model ${Model.modelName} and their relations`,
      };
    }
  }
}

export default TSGooseHandler;