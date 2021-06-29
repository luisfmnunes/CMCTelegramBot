const cooldown = (start: number, end: number, interval: number = 1) => {
    const diff: number = (end - start)/60000;
    console.log("Time difference: " + diff);
    return diff < interval ? true : false;
};

const wait = async (ms: number) => {
    await new Promise(r => setTimeout(r,ms));
};

export {cooldown, wait};
