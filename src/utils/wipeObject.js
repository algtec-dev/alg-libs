export default function wipeObject(o) {
    if (typeof o !== "object") {
        return o;
    }
    let oKeys = Object.keys(o);

    for (let j = 0; j < oKeys.length; j++) {
        let p = oKeys[j];
        switch (typeof o[p]) {
            case "object":
                if (Array.isArray(o[p])) {
                    for (let i = 0; i < o[p].length; i++) {
                        o[p][i] = wipeObject(o[p][i]);
                        if (isEmpty(o[p][i])) {
                            o[p].splice(i, 1);
                            i--;
                        }
                    }
                    if (o[p].length === 0) {
                        if (Array.isArray(o)) {
                            o.splice(parseInt(p), 1);
                            j--;
                        } else {
                            delete o[p];
                        }
                    }
                } else {
                    if (isEmpty(o[p])) {
                        delete o[p];
                    } else {
                        o[p] = wipeObject(o[p]);
                        if (isEmpty(o[p])) {
                            delete o[p];
                        }
                    }
                }
                break;
            default:
                if (isEmpty(o[p])) {
                    delete o[p];
                }
                break;
        }
    }
    if (Object.keys(o).length === 0) {
        return;
    }

    return o;
}

function isEmpty(obj) {
    const stringify = JSON.stringify(obj) 
    return (
        obj === "" ||
        obj === null ||
        obj === undefined ||
        stringify === "{}" ||
        stringify === "[]" ||
        (typeof obj === 'object' && Object.keys(obj).length === 0)
    ) 
}