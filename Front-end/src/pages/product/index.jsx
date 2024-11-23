import { useLocation } from "react-router-dom"
import ViewDetail from "../../components/Product/ViewDetail"
import { useEffect, useState } from "react"
import { callDetailProduct } from "../../services/api"
const ProductPage = () => {

    const [dataProduct, setDataProduct] = useState('')
    let location = useLocation()
    let params = new URLSearchParams(location.search)
    const id = params?.get("id")

    useEffect(() => {
        fectProduct(id)
    }, [id])
    const fectProduct = async (id) => {
        const res = await callDetailProduct(id)

        if (res && res.data) {
            let raw = res.data
            raw.items = getImages(raw)
            setTimeout(() => {
                setDataProduct(raw)
            }, 300)
        }
    }
    const getImages = (raw) => {
        const images = []
        if (raw.thumbnail) {
            images.push({
                original: `${import.meta.env.VITE_BACKEND_URL}/images/product/${raw.thumbnail}`,
                thumbnail: `${import.meta.env.VITE_BACKEND_URL}/images/product/${raw.thumbnail}`,
                originalClass: "original-image",
                thumbnailClass: "thumbnail-image"
            })
        }
        if (raw.slider) {
            raw.slider?.map(item => {
                images.push({
                    original: `${import.meta.env.VITE_BACKEND_URL}/images/product/${item}`,
                    thumbnail: `${import.meta.env.VITE_BACKEND_URL}/images/product/${item}`,
                    originalClass: "original-image",
                    thumbnailClass: "thumbnail-image"
                })
            })
        }
        return images
    }
    return (
        <>
            <ViewDetail dataProduct={dataProduct}

            />
        </>
    )
}
export default ProductPage