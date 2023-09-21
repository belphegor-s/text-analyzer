interface Props {
    word: string;
    count: number;
}

const Card = ({ word, count }: Props) => {

    return (
        <div className="card">
            <h3>{word ?? ''}</h3>
            <p>Count: {count ?? ''}</p>
        </div>
    )
}

export default Card