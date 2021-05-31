import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "./user";
import { Wine } from "./wine";
@Entity()
export class Rating {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  rating: number;

  @ManyToOne(() => Wine, (wine) => wine.id)
  wine: Wine;

  @ManyToOne(() => User, (user) => user.id)
  user: User;
}
