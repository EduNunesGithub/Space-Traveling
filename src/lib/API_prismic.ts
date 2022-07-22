import { clientPrismic } from "../services/prismicio";

export interface Post {
    data: {
        author: string | null;
        banner: {
            url: string;
        };
        body: {
            items: {
                paragraph: [];
            }[];
            primary: {
                heading: string;
            };
        }[];
        subtitle: string | null;
        title: string | null;
    };
    first_publication_date: string;
    uid: string;
};

export interface RequestAllPosts extends Post {};

export interface RequestPost extends Post {};

export interface RequestPostPagination {
    next_page: string;
    results: Post[];
};

const prismic = clientPrismic();

export const requestAllPosts: (type: string) => Promise<RequestAllPosts[]> | null = async (
    type
) => {
    const response = {
        data: null
    };

    try {
        response.data = await prismic.getAllByType(type);
    } catch {
        return null;
    }

    return response.data;
}

export const requestPostPagination: (type: string, pageSize: number) => Promise<RequestPostPagination> | null = async (
    type: string,
    pageSize: number
) => {
    const response = {
        data: null
    };

    try {
        response.data = await prismic.getByType(type, {
            pageSize: pageSize
        });
    } catch (error) {
        return null;
    };

    return response.data;
};

export const requestPost: (type: string, uid: string) => Promise<RequestPost> | null = async (
    type,
    uid
) => {
    const response = {
        data: null
    };

    try {
        response.data = await prismic.getByUID(type, uid);
    } catch (error) {
        return null;
    };

    return response.data;
};