export enum Routes {
  MAIN = "/",
  AUTH = "/auth",
  CONTACT = "/contact",
  GROUP = "/group",
  PROFILE = "/profile",
}

export enum URLS {
  MAIN = "http://localhost:7878",
  ACTIVATE_USER = `${URLS.MAIN}/auth/activateUser`,
}

export enum Constants {
  ERROR = "error",
  IMAGE_DEFAULT = "https://e7.pngegg.com/pngimages/889/832/png-clipart-google-contacts-mobile-app-contact-manager-app-store-android-application-package-email-miscellaneous-blue.png",
}

export enum IdParams {
  Id = "id",
  IdUser = "idUser",
  IdContact = "idContact",
  IdGroup = "idGroup",
}
