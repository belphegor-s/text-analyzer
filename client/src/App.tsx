import { ChangeEvent, FormEvent, useState, useEffect } from "react";
import "./styles/App.scss";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { obj } from "./types/global";
import backendURL from "./constants/backendURL";
import Card from "./components/Card";
import AllWords from "./components/AllWords";
import PreviousUploads from "./components/PreviousUploads";

const App = () => {
    const [file, setFile] = useState<File>();
    const [resultData, setResultData] = useState<obj>({});
    const [uploading, setUploading] = useState(false);
    const [keyword, setKeyword] = useState('');
    const [previousUploadsIds, setPreviousUploadsIds] = useState<string[]>([]);
    const [previousUploads, setPreviousUploads] = useState<obj[]>([]);

    const onFileInputChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (!file) {
            return;
        }

        setFile(file);
    }

    const onFileUploadClickHandler = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if(!file) {
            return;
        } else if(file.size > 5 * 1024 * 1024) { // max 5MB
            toast.error('File size should be at max 5MB');
            return;
        } else if(file.type !== 'text/plain') {
            toast.error('Only .txt files are allowed');
            return;
        }

        if(uploading) return;

        setUploading(true);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch(`${backendURL}/text-analyze`, {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const responseData = await response.json();

                if(responseData.success) {
                    setResultData(responseData?.data ?? {});
                    toast.success(responseData?.msg);
                } else {
                    toast.error(responseData?.msg ?? 'Failed to upload file.');
                }
            } else {
                toast.error('Failed to upload file.');
            }
        } catch (error) {
            toast.error('Error uploading file! Please try again.');
        } finally {
            setUploading(false);
        }
    }

    useEffect(() => {
        (async () => {
            try {
                const response = await fetch(`${backendURL}/text-analyze-data`);

                if (response.ok) {
                    const responseData = await response.json();

                    if(responseData.success) {
                        setPreviousUploads(responseData?.data ?? {});
                        setPreviousUploadsIds(responseData?.data?.map((el: Record<string, unknown>) => el?._id))
                        toast.success(responseData?.msg, {
                            toastId: 'success-previous-upload'
                        });
                    } else {
                        toast.error(responseData?.msg ?? 'Error fetching data!');
                    }
                } else {
                    toast.error('Error fetching data!');
                }
            } catch (error) {
                toast.error('Error fetching data! Please try again.');
            } finally {
                setUploading(false);
            }
        })()
    }, [uploading])

    return (
        <>
            <div className="main container">
                <form onSubmit={onFileUploadClickHandler} encType="multipart/form-data">
                    <label htmlFor="file-input">Upload a TXT file:</label>
                    <input type="file" onChange={onFileInputChangeHandler} accept="text/plain"/>
                    <button className="btn" disabled={uploading}>{uploading ? "Uploading..." : "Upload"}</button>
                </form>
                <PreviousUploads ids={previousUploadsIds} setResultData={setResultData} previousUploads={previousUploads}/>
                {Object.keys(resultData)?.length > 0 &&
                    <div className="results">
                        <input type="text" placeholder="Keyword search" onChange={(e) => setKeyword(e.target.value)}/>
                        <h2>Most Occured Words</h2>
                        <div className="cards-wrap">
                            {Object.keys(resultData?.topWords)?.filter((word: string) => keyword.toLowerCase() === '' ? word : word?.toLowerCase()?.includes(keyword?.toLowerCase())).map((word: string, i: number) => {
                                return (
                                    <Card key={`top-word-${i}`} word={word} count={resultData?.topWords?.[word]}/>
                                )
                            })}
                        </div>
                        <br />
                        <br />
                        <h2>Most Co-occured words</h2>
                        <div className="cards-wrap">
                            {Object.keys(resultData?.topWordPairs)?.filter((word: string) => keyword.toLowerCase() === '' ? word : word?.toLowerCase()?.includes(keyword?.toLowerCase())).map((word: string, i: number) => {
                                return (
                                    <Card key={`top-word-pairs-${i}`} word={word} count={resultData?.topWordPairs?.[word]}/>
                                )
                            })}
                        </div>
                        <br />
                        <br />
                        <AllWords data={resultData?.wordFreq} keyword={keyword}/>
                    </div>
                }
            </div>
            <ToastContainer/>
        </>
    )
}

export default App