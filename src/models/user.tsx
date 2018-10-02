import { query } from "./query"

export interface User {
  id: string
  username: string
  password: string
}

export const login = async (
  username: string,
  password: string
): Promise<any | Error> => {
  const gqlQuery = `query { login(username: "${username}", password: "${password}") }`
  return query(gqlQuery, "login")
}

export const fetchUserFromStorage = (): User | undefined => {
  const user = localStorage.getItem("hf-user")
  return user && JSON.parse(user)
}

export const saveUserToStorage = (user: User) =>
  localStorage.setItem("hf-user", JSON.stringify(user))
