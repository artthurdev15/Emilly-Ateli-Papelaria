import { ProductForm } from "@/components/admin/ProductForm";

interface Props {
  params: { id: string };
}

export default function EditarProdutoPage({ params }: Props) {
  return <ProductForm productId={params.id} />;
}
