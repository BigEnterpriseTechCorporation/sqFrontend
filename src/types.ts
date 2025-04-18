export interface User{
  id:string
  fullName:string
  userName:string
  role:string
}

export type checkType = 0 | 1 |2
export type exerciseType = 0 | 1 |2 | 3 | 4
export type difficulty = 0 | 1 | 2 | 3

export interface Unit{
  id:string
  createdAt:string
  updatedAt:string
  title:string
  description:string
  ownerId:string
  ownerName:string
  exerciseCount:string
}

export interface Excerises{
  id:string
  createdAt:string
  updatedAt:string
  unitId:string
  unitTitle:string
  title:string
  description:string
  difficulty:difficulty
  type:exerciseType
  schema:string
  checkType:checkType
  checkQueryInsert:string
  checkQuerySelect:string
  options:string
  queryParts:string
}

export interface UserForm extends Omit<User, "role" | "id">{
  password: string
}

export type userLogin = Omit<UserForm, "fullName">
export type userRegister = UserForm
export type token = string