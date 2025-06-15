export type TypeTag = {
    id: number,
    name: string
}

export type TypeJobTitle = {
    id: number,
    name: string
}

export type TypeJobseeker = {
    id: number,
    firstname: string,
    lastname: string,
    email: string,
    jobTitleId: number,
    tagIds: number[]
}
