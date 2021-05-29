import { Entity, Column, ManyToOne } from 'typeorm';
import Card from './card';

@Entity('cardsElements')
export default class CardElement {
    @ManyToOne(() => Card, (card: Card) => card.elements, {
        primary: true,
        onDelete: 'CASCADE',
        cascade: ['insert'],
    })
    public card!: Card;

    @Column('varchar')
    public element!: string;
}
