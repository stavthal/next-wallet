import {Card} from "@prisma/client";

export default function CardComponent({cardNumber, expiryDate, brand, cardType, cvv}:Card): JSX.Element {
    return (
        <div className="border-2 p-4 rounded-xl shadow-md flex flex-row justify-between">
            <div>
                <h2 className="text-lg font-semibold">{cardNumber}</h2>
                <p>{brand}</p>
                <p>{cardNumber}</p>
                <p>{cvv}</p>
                <p>{cardType}</p>
                <p className="text-sm">{expiryDate}</p>
            </div>
        </div>
    );
}