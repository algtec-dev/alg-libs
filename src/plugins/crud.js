export async function create(route) {
    try {
        var response = await http.get(route);
        return response.data
    } catch (error) {
        return error
    }
}


export async function readAll(route) {
    try {
        var response = await http.get(route);
        return response.data
    } catch (error) {
        return error
    }
}

export async function updateById(id, data) {
    if (id == undefined) {
        throw ('id is a required param');
    }

    if (data == undefined) {
        throw ('data is a required param');
    }
    try {
        var response = await http.patch('/vehicle/' + id,
            data = data);
        return response.data
    } catch (error) {
        return error
    }
}

export async function deleteById(id) {
    if (id == undefined) {
        throw ('ALGLIBS: id is a required param');
    }
    try {
        var response = await http.delete('/vehicle/' + id);
        return response.data
    } catch (error) {
        return error
    }
}