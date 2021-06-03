import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  UpdateDateColumn,
  CreateDateColumn,
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

  @Column({ type: "float" })
  rating: number;

  @UpdateDateColumn({ type: "timestamp", name: "updated_at" })
  updatedAt?: Date;

  @CreateDateColumn({ type: "timestamp", name: "created_at" })
  createdAt?: Date;
}
