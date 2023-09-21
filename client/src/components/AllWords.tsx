interface Props {
    data: Record<string, number>;
    keyword: string;
}

const AllWords = ({ data, keyword }: Props) => {
    return (
        <section className="all-word-freq">
            <h2>All words frequency</h2>
            <div className="table-wrap">
                <table>
                    <thead>
                        <tr>
                            <th>Word</th>
                            <th>Count</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.keys(data)?.filter((word: string) => keyword.toLowerCase() === '' ? word : word?.toLowerCase()?.includes(keyword?.toLowerCase()))?.map((word: string, i: number) => {
                            return (
                                <tr key={`word-${i}`}>
                                    <td>{word ?? ''}</td>
                                    <td>{data?.[word]}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </section>
    )
}

export default AllWords