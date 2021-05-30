import { Entity, Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import Card from './card';

@Entity('cardsElements')
export default class CardElement {
    @PrimaryGeneratedColumn('uuid')
    public id!: string;

    @ManyToOne(() => Card, (card: Card) => card.elements, {
        onDelete: 'CASCADE',
        cascade: ['insert'],
    })
    public card!: Card;

    @Column('varchar')
    public element!: string;
}
