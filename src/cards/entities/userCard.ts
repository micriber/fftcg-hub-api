import {Entity, Column} from "typeorm";
import {ManyToOne} from "typeorm/index";
import Card from "./card";
import User from "../../users/entities/user";

export enum version {
    CLASSIC = "classic",
    FOIL = "foil",
    FULL_ART = "full-art"
}

@Entity("userCards")
export default class userCard {

    @Column("integer")
    public quantity!: number;

    @Column({
        type: "enum",
        enum: version,
        default: version.CLASSIC,
        primary: true
    })
    public version!: version

    @ManyToOne(type => User, {primary: true})
    public user!: User;

    @ManyToOne(() => Card, (card: Card) => card.userCard, {primary: true})
    public card!: Card;
}
