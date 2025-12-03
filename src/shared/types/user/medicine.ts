export type Medicine = {
    name: string,
    abbreviation: string,
    type: 'painkiller' | 'migraine-painkiller' | 'others' // TODO outsource into consts
}
