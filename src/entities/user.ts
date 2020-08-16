import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Timestamp} from "typeorm";

@Entity("users")
export class User {

    @PrimaryGeneratedColumn()
    public id!: number;

    @Column("varchar")
    public firstName!: string;

    @Column("varchar")
    public lastName!: string;

    @CreateDateColumn()
    public createdAt!: Timestamp;

    @UpdateDateColumn()
    public UpdatedAt!: Timestamp;
}
