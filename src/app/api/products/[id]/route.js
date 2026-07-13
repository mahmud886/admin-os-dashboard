import {
  getAuthenticatedUser,
  createResponse,
  createErrorResponse,
} from "@/lib/db-helpers";
import { productsService } from "@/lib/products-service";

export async function GET(request, { params }) {
  const { user } = await getAuthenticatedUser();
  if (!user) return createErrorResponse("Unauthorized", 401);

  const { id } = await params;
  const product = await productsService.getById(id);

  if (!product) return createErrorResponse("Product not found", 404);
  return createResponse(product);
}

export async function PUT(request, { params }) {
  const { user } = await getAuthenticatedUser();
  if (!user) return createErrorResponse("Unauthorized", 401);

  const { id } = await params;
  try {
    const data = await request.json();
    const updated = await productsService.update(id, data);
    if (!updated) return createErrorResponse("Product not found", 404);
    return createResponse(updated);
  } catch (error) {
    console.error("Failed to update product:", error);
    return createErrorResponse("Failed to update product", 500, error.message);
  }
}

export async function DELETE(request, { params }) {
  const { user } = await getAuthenticatedUser();
  if (!user) return createErrorResponse("Unauthorized", 401);

  const { id } = await params;
  const success = await productsService.delete(id);
  if (!success) return createErrorResponse("Product not found", 404);
  return createResponse({ message: "Product deleted successfully" });
}
