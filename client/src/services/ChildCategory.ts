import Base from "./Base";

interface Filters {
    name?: string;
    nameCode?: string;
    url?: string;
    status?: 0 | 1;
    parentName?: string;
}


class ChildCategory extends Base {
    constructor() {
        super({
            url: "/categories/child",
        });
    }

    async findAll(
        token?: string,
        withCredentials: boolean = true,
        limit: number = 10,
        page: number = 1,
        filters: Filters = {}
    ): Promise<any> {
        let url = `/categories/child/all?limit=${limit}&page=${page}`;

        if (filters.name) {
            url += `&name=${encodeURIComponent(filters.name)}`;
        }
        if (filters.nameCode) {
            url += `&nameCode=${encodeURIComponent(filters.nameCode)}`;
        }
        if (filters.url) {
            url += `&url=${encodeURIComponent(filters.url)}`;
        }
        if (filters.status !== undefined) {
            url += `&status=${filters.status}`;
        }
        if (filters.parentName) {
            url += `&parentName=${encodeURIComponent(filters.parentName)}`;
        }

        const rs = await this.execute({
            url,
            method: "get",
            headers: {
                "Content-Type": "application/json",
                Authorization: token ? `Bearer ${token}` : undefined,
            },
            withCredentials,
        });

        return rs.data;
    }


    async findOne(id: string, token?: string): Promise<any> {
        const rs = await this.execute({
            url: `/categories/child/${id}`,
            method: "get",
            headers: {
                "Content-Type": "application/json",
                Authorization: token ? `Bearer ${token}` : undefined,
            },
        });
        return rs.data;
    }

    async create(
        data: Partial<{
            categoryId: string;
            name: string;
            nameCode: string;
            url: string;
            component: string;
            status: number;
        }>,
        token?: string
    ): Promise<any> {
        const rs = await this.execute({
            url: `/categories/child`,
            method: "post",
            headers: {
                "Content-Type": "application/json",
                Authorization: token ? `Bearer ${token}` : undefined,
            },
            data,
        });
        return rs.data;
    }

    async update(
        id: string,
        data: Partial<{
            subCategoryId: string;
            name: string;
            nameCode: string;
            url: string;
            status: number;
        }>,
        token?: string
    ): Promise<any> {
        const rs = await this.execute({
            url: `/categories/child/${id}`,
            method: "put",
            headers: {
                "Content-Type": "application/json",
                Authorization: token ? `Bearer ${token}` : undefined,
            },
            data,
        });
        return rs.data;
    }

    async delete(token: string, withCredentials: boolean = true, id: string) {
        const rs = await this.execute({
            url: `/categories/child/${id}`,
            method: "delete",
            headers: {
                "Content-Type": "application/json",
                Authorization: token ? `Bearer ${token}` : undefined,
            },
            withCredentials,
        });

        return rs.data;
    }
}

export default new ChildCategory();
