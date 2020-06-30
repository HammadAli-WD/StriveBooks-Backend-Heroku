const{ writeJSON, readJSON} = require("fs-extra")

const readDB = async (filepath) => {
    try {
        const fileJSON = await readJSON(filepath)
        return fileJSON
    } catch (error) {
        console.log("Cannot readable", error)
        throw new Error(error)
    }
}

const writeDB = async (filepath, data) => {
    try {
        await writeJSON(filepath, data)
    } catch (error) {
        throw new Error(error)
    }
}

module.exports ={
    readDB,
    writeDB
}