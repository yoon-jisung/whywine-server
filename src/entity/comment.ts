import { IncomingMessage } from "http";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToMany,
  JoinTable,
  ManyToOne,
} from "typeorm";
import { User } from "./user";
import { Wine } from "./wine";
import { Recomment } from "./recomment";
@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  @OneToMany(() => Recomment, (recomment) => recomment.comment)
  id: number;

  @Column()
  text: string;

  @ManyToOne(() => User, (user) => user.id)
  user: User;

  @ManyToOne(() => Wine, (wine) => wine.id)
  wine: Wine;

  @Column()
  good_count: number;

  @Column()
  bad_count: number;
}
