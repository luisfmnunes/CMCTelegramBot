import { endianness } from "os";

const cooldown = (start: number, end: number, interval: number = 1) => {
    const diff: number = (end - start)/60000;
    console.log("Time difference: " + diff);
    return diff < interval ? true : false;
};

export default {cooldown};
