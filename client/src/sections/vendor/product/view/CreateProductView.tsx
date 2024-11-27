import { cookies } from "next/headers";
import { get } from "lodash";
import ProductForm from "../components/ProductForm";
import Categories from "../../../../services/Categories";
import WrapperPage from "../../../WrapperPage";

export default async function CreateProductView() {
    const cookieStore = cookies();
    const token = cookieStore.get("access_cookie")?.value;
    try {
        const listCat = await Categories.getList(token, true);
        const infoCat = get(listCat, "data.categories", []);
        return (
            <WrapperPage title="Tạo Sản Phẩm">
                <ProductForm cat={infoCat} />
            </WrapperPage>
        );
    } catch (error) {
        return (
            <WrapperPage title="Tạo Sản Phẩm">
                <p>Không thể tải danh sách danh mục. Vui lòng thử lại sau.</p>
            </WrapperPage>
        );
    }
}
