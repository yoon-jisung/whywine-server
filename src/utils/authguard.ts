import { createQueryBuilder } from "typeorm";
import dotenv from "dotenv";
dotenv.config();
interface userInfo {
    id: number;
    email: string;
    nickname: string;
    likes?: number;
    image?: string;
}

const authguard = async (sessionToken: userInfo) => {
    
    try {
        const user = await createQueryBuilder("user")
            .where("id = :id", { id: sessionToken.id })
            .execute();

        if (user.length !== 0) {
          return true
        }
      } catch (error) {
        console.error(error.message);
        if (error.message === "Cannot read property 'user' of undefined") {
          return false
        } else {
          return false
        }
      };
};

export default authguard;
