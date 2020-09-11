import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Index, OneToMany } from 'typeorm/index';
import UserCard from './userCard';

@Entity('cards')
export default class Card {
    @PrimaryGeneratedColumn('uuid')
    public id!: number;

    @Column('varchar')
    @Index({ unique: true })
    public code!: string;

    @Column('varchar')
    public element!: string;

    @Column('varchar')
    public rarity!: string;

    @Column('varchar')
    public cost!: string;

    @Column('varchar')
    public power!: string;

    @Column('varchar')
    public category1!: string;

    @Column('varchar')
    public category2!: string;

    @Column('varchar')
    public multicard!: string;

    @Column('varchar')
    public exBurst!: string;

    @Column('varchar')
    public name!: string;

    @Column('varchar')
    public type!: string;

    @Column('varchar')
    public job!: string;

    @Column('varchar')
    public text!: string;

    @OneToMany(() => UserCard, (userCard: UserCard) => userCard.card)
    public userCard!: UserCard[];
}
