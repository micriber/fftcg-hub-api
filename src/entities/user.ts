import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Timestamp} from "typeorm";

@Entity("users")
export default class User {

    @PrimaryGeneratedColumn()
    public id!: number;

    @Column("varchar")
    public firstName!: string;

    @Column("varchar")
    public lastName!: string;

    @Column("varchar")
    public email!: string;

    @Column("varchar")
    public locale!: string;

    @CreateDateColumn()
    public createdAt!: Timestamp;

    @UpdateDateColumn()
    public UpdatedAt!: Timestamp;
}
