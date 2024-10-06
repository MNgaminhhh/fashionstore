export type Nav = {
    title: string;
    url: string;
};

export type NavChild = {
    title: string;
    child: Nav[];
};
