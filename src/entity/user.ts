import { IncomingMessage } from "http";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToMany,
  JoinTable,
} from "typeorm";
import { Comment } from "./comment";
import { Tag } from "./tag";
import { Recomment } from "./recomment";
import { Wine } from "./wine";
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  @OneToMany(() => Comment, (comment) => comment.user)
  @OneToMany(() => Recomment, (recomment) => recomment.user)
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  nickname: string;

  @Column()
  likes: number;

  @Column()
  image: string;

  // 사용자의 선호 태그 join table
  @ManyToMany(() => Tag)
  @JoinTable({ name: "user_tag" })
  tags: Tag[];

  // 댓글 좋아요 join table
  @ManyToMany(() => Comment)
  @JoinTable({ name: "good" })
  good: Comment[];

  // 댓글 싫어요 join table
  @ManyToMany(() => Comment)
  @JoinTable({ name: "bad" })
  bad: Comment[];

  // 사용자 찜 join table
  @ManyToMany(() => Wine)
  @JoinTable({ name: "user_wine" })
  wines: Wine[];
}
