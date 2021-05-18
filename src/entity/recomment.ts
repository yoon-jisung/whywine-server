import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "./user";
import { Comment } from "./comment";
@Entity()
export class Recomment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  text: string;

  @ManyToOne(() => Comment, (comment) => comment.id)
  comment: Comment;

  @ManyToOne(() => User, (user) => user.id)
  user: User;
}
