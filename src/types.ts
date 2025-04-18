export interface User{
  id:string
  fullName:string
  userName:string
  role:string
}

export interface UserForm extends Omit<User, "role" | "id">{
  password: string
}

export type userLogin = Omit<UserForm, "fullName">
export type userRegister = UserForm
export type token = string