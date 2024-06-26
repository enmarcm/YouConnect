import { ContactModel, GroupContactModel, GroupModel } from "../typegoose/models";
import { ITSGooseHandler } from "../data/instances";
import { GroupContactData, GroupInterfaceData } from "../types";

export default class GroupsModelClass {
  static async createGroup({
    name,
    description,
    idUser,
    maxContacts = 50,
  }: {
    name: string;
    description: string;
    maxContacts: number;
    idUser: string;
  }) {
    try {
      const group = await ITSGooseHandler.addDocument({
        Model: GroupModel,
        data: { name, description, idUser, maxContacts },
      });
      return group;
    } catch (error) {
      console.error(
        `Error creating group: ${error} in createGroup method in GroupsModelClass.ts`
      );
      throw new Error(`Error creating group: ${error}`);
    }
  }

  static async getGroupsByUserId({ idUser }: { idUser: string }) {
    try {
      const groupsContact: GroupInterfaceData[] =
        await ITSGooseHandler.searchRelations({
          Model: GroupModel,
          id: idUser,
          relationField: "idUser",
        });

      if (groupsContact.length === 0 || "error" in groupsContact) return [];

      const groups = await Promise.all(
        groupsContact.map((groupContact: GroupInterfaceData) => {
          if (!groupContact.id) return;
          return ITSGooseHandler.searchId({
            Model: GroupModel,
            id: groupContact.id,
          });
        })
      );

      return groups;
    } catch (error) {
      console.error(
        `Error getting all groups by user id: ${error} in getGroupsByUserId method in GroupsModelClass.ts`
      );
      throw new Error(`Error getting all groups by user id: ${error}`);
    }
  }

  static async deleteGroup({ id }: { id: string }) {
    try {
      const result = await GroupsModelClass.deleteGroupAndContacts({
        idGroup: id,
      });
      return result;
    } catch (error) {
      console.error(
        `Error deleting group: ${error} in deleteGroup method in GroupsModelClass.ts`
      );
      throw new Error(`Error deleting group: ${error}`);
    }
  }

  static async viewAllGroups() {
    try {
      const groups = await ITSGooseHandler.searchAll({ Model: GroupModel });
      return groups;
    } catch (error) {
      console.error(
        `Error getting all groups: ${error} in viewAllGroups method in GroupsModelClass.ts`
      );
      throw new Error(`Error getting all groups: ${error}`);
    }
  }

  static async updateGroup({
    id,
    newGroupData,
  }: {
    id: string;
    newGroupData: GroupInterfaceData;
  }) {
    try {
      const group = await ITSGooseHandler.editDocument({
        Model: GroupModel,
        id,
        newData: newGroupData,
      });
      return group;
    } catch (error) {
      console.error(
        `Error updating group: ${error} in updateGroup method in GroupsModelClass.ts`
      );
      throw new Error(`Error updating group: ${error}`);
    }
  }

  static async getInfoGroup({ id }: { id: string }) {
    try {
      const group = await ITSGooseHandler.searchId({ Model: GroupModel, id });

      if (!group) return { error: "Group not found" };

      return group;
    } catch (error) {
      console.error(
        `Error getting group info: ${error} in getInfoGroup method in GroupsModelClass.ts`
      );
      throw new Error(`Error getting group info: ${error}`);
    }
  }

  static async getGroupsByContactId({ idContact }: { idContact: string }) {
    try {
      const groupContacts: GroupContactData[] =
        await ITSGooseHandler.searchRelations({
          Model: GroupContactModel,
          id: idContact,
          relationField: "idContact",
          lean: true
        });

      if (groupContacts.length === 0 || "error" in groupContacts) return [];

      const groups = await Promise.all(
        groupContacts.map((groupContact: GroupContactData) => {
          if (!groupContact.idGroup) return;
          return ITSGooseHandler.searchId({
            Model: GroupModel,
            id: groupContact.idGroup,
          });
        })
      );

      // Filtrar los resultados undefined
      const filteredGroups = groups.filter((group) => group !== undefined);

      // Verificar si no se encontraron grupos
      if (filteredGroups.length === 0) {
        throw new Error("No groups found for the provided contact id");
      }

      return filteredGroups;
    } catch (error) {
      console.error(
        `Error getting all groups by contact id: ${error} in getGroupsByContactId method in GroupsModelClass.ts`
      );
      throw new Error(`Error getting all groups by contact id: ${error}`);
    }
  }

  static async addContactToGroup({
    idGroup,
    idContact,
  }: {
    idGroup: string;
    idContact: string;
  }) {
    try {
      const groupContact = await ITSGooseHandler.addDocument({
        Model: GroupContactModel,
        data: { idGroup, idContact },
      });

      return groupContact;
    } catch (error) {
      console.error(
        `Error adding contact to group: ${error} in addContactToGroup method in GroupsModelClass.ts`
      );
      throw new Error(`Error adding contact to group: ${error}`);
    }
  }

  static async removeContactFromGroup({
    idGroup,
    idContact,
  }: {
    idGroup: string;
    idContact: string;
  }) {
    try {
      const groupContact = await ITSGooseHandler.searchOne({
        Model: GroupContactModel,
        condition: { idGroup, idContact },
      });

      if (!groupContact) {
        throw new Error(
          `GroupContact with idGroup ${idGroup} and idContact ${idContact} not found`
        );
      }

      await ITSGooseHandler.removeDocument({
        Model: GroupContactModel,
        id: groupContact.id,
      });

      return groupContact;
    } catch (error) {
      console.error(
        `Error removing contact from group: ${error} in removeContactFromGroup method in GroupsModelClass.ts`
      );
      throw new Error(`Error removing contact from group: ${error}`);
    }
  }

  static async removeGroupContacts({
    idGroup,
    idContact,
  }: {
    idGroup?: string;
    idContact?: string;
  }) {
    try {
      if ((!idGroup && !idContact) || (idGroup && idContact)) {
        throw new Error("Either idGroup or idContact must be provided");
      }

      const condition: Partial<{ idGroup: string; idContact: string }> = idGroup
        ? { idGroup }
        : { idContact };

      const groupContacts = await ITSGooseHandler.searchOne({
        Model: GroupContactModel,
        condition,
      });

      if (!groupContacts || groupContacts.length === 0) {
        throw new Error(
          `No GroupContacts found with ${
            idGroup ? "idGroup " + idGroup : "idContact " + idContact
          }`
        );
      }

      await Promise.all(
        groupContacts.map((groupContact: any) =>
          ITSGooseHandler.removeDocument({
            Model: GroupContactModel,
            id: groupContact.id,
          })
        )
      );

      return groupContacts;
    } catch (error) {
      console.error(
        `Error removing group contacts: ${error} in removeGroupContacts method in GroupsModelClass.ts`
      );
      throw new Error(`Error removing group contacts: ${error}`);
    }
  }

  //TODO: PROBAR ESTE METODO Y SI FUNCIONA, BORRAR EL METODO removeGroupContacts
  static async deleteGroupAndContacts({ idGroup }: { idGroup: string }) {
    try {
      // Get all contacts of the group from the groupcontact collection
      const groupContacts = await ITSGooseHandler.searchRelations({
        Model: GroupContactModel,
        id: idGroup,
        relationField: "idGroup",
      });

      // Delete all contacts of the group from the groupcontact collection
      await Promise.all(
        groupContacts.map((groupContact: any) =>
          ITSGooseHandler.removeDocument({
            Model: GroupContactModel,
            id: groupContact.id,
          })
        )
      );

      // Delete the group
      const group = await ITSGooseHandler.removeDocument({
        Model: GroupModel,
        id: idGroup,
      });

      return group;
    } catch (error) {
      console.error(
        `Error deleting group and contacts: ${error} in deleteGroupAndContacts method in GroupsModelClass.ts`
      );
      throw new Error(`Error deleting group and contacts: ${error}`);
    }
  }

  static async getContactsByGroupId({ idGroup }: { idGroup: string }) {
    try {
      const groupContacts: GroupContactData[] =
        await ITSGooseHandler.searchRelations({
          Model: GroupContactModel,
          id: idGroup,
          relationField: "idGroup",
          lean: true
        });

      if (groupContacts.length === 0 || "error" in groupContacts) return [];

      const contacts = await Promise.all(
        groupContacts.map((groupContact: GroupContactData) => {
          if (!groupContact.idContact) return;
          return ITSGooseHandler.searchId({
            Model: ContactModel,
            id: groupContact.idContact,
          });
        })
      );

      // Filtrar los resultados undefined
      const filteredContacts = contacts.filter((contact) => contact !== undefined);

      // Verificar si no se encontraron contactos
      if (filteredContacts.length === 0) {
        throw new Error("No contacts found for the provided group id");
      }

      return filteredContacts;
    } catch (error) {
      console.error(
        `Error getting all contacts by group id: ${error} in getContactsByGroupId method in GroupsModelClass.ts`
      );
      throw new Error(`Error getting all contacts by group id: ${error}`);
    }
  }
}
