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

@Entity()
export class Wine {
  @PrimaryGeneratedColumn()
  @OneToMany(() => Comment, (comment) => comment.wine)
  id: number;

  @Column()
  name: string;

  @Column()
  likeCount: number;

  @Column()
  description: string;

  @Column()
  image: string;

  @Column()
  price: number;

  @Column()
  sort: string;

  // 와인에 붙는 태그
  @ManyToMany(() => Tag, (tag) => tag.id)
  @JoinTable({ name: "wine_tag" })
  tags: Tag[];
}
