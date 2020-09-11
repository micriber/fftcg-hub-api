import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    Timestamp,
} from 'typeorm';
import { Index } from 'typeorm/index';

export type userType = {
    id: number;
    firstName: string;
    lastName: string;
    userName?: string;
    email: string;
    locale: string;
    authenticationType: string;
    createdAt: Timestamp;
    updatedAt: Timestamp;
};

@Entity('users')
export default class User {
    @PrimaryGeneratedColumn('uuid')
    public id!: number;

    @Column('varchar')
    public firstName!: string;

    @Column('varchar')
    public lastName!: string;

    @Column('varchar', { nullable: true })
    public userName?: string;

    @Column('varchar')
    @Index({ unique: true })
    public email!: string;

    @Column('varchar')
    public locale!: string;

    @Column('varchar')
    public authenticationType!: string;

    @CreateDateColumn()
    public createdAt!: Timestamp;

    @UpdateDateColumn()
    public updatedAt!: Timestamp;
}
