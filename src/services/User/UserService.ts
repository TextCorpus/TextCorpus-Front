import { UserRepository } from './../../repository/User/UserRepository';
import {User } from "../../entity/user/User";
import UserStorage from "../../util/UserStorage"


export class UserService {

    public async getUser(): Promise<User> {
        return await UserRepository.getUser();
    }

    public static async create(user: User): Promise<User> {
        return await UserRepository.createUser(user)
      }
      public static async get(id: any): Promise<User> {
        const token = UserStorage.getToken()
        const user  = await UserRepository.getUserById(id, token)
        return user
      }
    
      public static async update(user: User): Promise<User> {
        const token = UserStorage.getToken()
        return await UserRepository.updateUser(user, token)
      }

      public static async delete(id: any): Promise<void> {
        const token = UserStorage.getToken()
        return await UserRepository.deleteUser(id, token)
      }

    
}