export type AppRole = "admin" | "user";

export type UserProfile = {
  role: AppRole;
  libraryAccess: boolean;
};
