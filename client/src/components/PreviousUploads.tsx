import { SetStateAction, Dispatch } from "react";
import { obj } from "../types/global";

interface Props {
    ids: string[];
    setResultData: SetStateAction<Dispatch<obj>>
    previousUploads: obj[];
}

const PreviousUploads = ({ ids, setResultData, previousUploads }: Props) => {
    const onIdClickHandler = (id: string) => {
        previousUploads?.forEach((el) => {
            if(el?._id === id) {
                setResultData(() => el);
            }
        })
    }

    return (
        <div className="previous-uploads">
            <h3>Previous Uploads</h3>
            <div className="table-wrap">
                <table>
                    <thead>
                        <tr>
                            <th style={{ borderRight: '.1em solid #000' }}>Uploaded data ID</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ids?.length > 0 ? ids?.map((id: string, i: number) => {
                            return (
                                <tr key={`id-${i}`}>
                                    <td style={{ borderRight: '.1em solid #000', color: '#0084ff', cursor: 'pointer' }} onClick={() => onIdClickHandler(id)}>{id ?? ''}</td>
                                </tr>
                            )
                        }) : <tr><td style={{ borderRight: '.1em solid #000' }}>No Previous Uploads</td></tr>}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
export default PreviousUploads