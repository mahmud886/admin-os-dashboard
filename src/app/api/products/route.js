import {
  getAuthenticatedUser,
  createResponse,
  createErrorResponse,
} from "@/lib/db-helpers";
import { productsService } from "@/lib/products-service";

export async function GET() {
  const { user } = await getAuthenticatedUser();
  if (!user) return createErrorResponse("Unauthorized", 401);

  const products = await productsService.getAll();
  return createResponse(products);
}

export async function POST(request) {
  const { user } = await getAuthenticatedUser();
  if (!user) return createErrorResponse("Unauthorized", 401);

  try {
    const data = await request.json();

    if (!data.name || data.price === undefined || data.price === "") {
      return createErrorResponse("Name and price are required", 400);
    }

    if (!data.slug) {
      data.slug = data.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
    }

    const product = await productsService.create(data);
    return createResponse(product, 201);
  } catch (error) {
    console.error("Failed to create product:", error);
    return createErrorResponse("Failed to create product", 500, error.message);
  }
}
