export type FormData = {
    username: string;
    password: string;
};

export type responseType={
    name: string;
    company: string;
    category: string;
    info: string;
    promo: string;
    url: string;
    deadline: string
}
export type Data = {
    login: string;
};

export type product={
    id: number;
    product_name: string;
    price: number;
    category_name: string;
    quantity : number
}

export default interface Review {
    id: number;
    user_id: number;
    product_id: number;
    rating: number;
    comment: string;
    username: string;
}