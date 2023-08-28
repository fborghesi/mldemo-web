export const range = (from: number, to: number, step: number): number[] => {
    const values = [];
    for(let i = from; i <= to; i += step)
        values.push(i);
    return values;
}
