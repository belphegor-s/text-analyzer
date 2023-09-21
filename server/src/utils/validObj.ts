type obj = Record<string, any>;

const validObj = (obj: obj) => {
    return Object.keys(obj)?.length > 0;
}

export default validObj;