import { createErrorResponse, createResponse } from '@/lib/db-helpers';
import { createClient } from '@/lib/supabase-server';

export async function GET() {
  try {
    const supabase = await createClient();

    // Fetch total orders
    const { count: ordersCount, error: ordersError } = await supabase
      .from('ecommerce_orders')
      .select('*', { count: 'exact', head: true });

    if (ordersError) throw ordersError;

    // Fetch total customers
    const { count: customersCount, error: customersError } = await supabase
      .from('ecommerce_customers')
      .select('*', { count: 'exact', head: true });

    if (customersError) throw customersError;

    // Fetch total revenue (sum of amount_total for paid orders)
    // Note: Supabase JS client doesn't support sum directly easily without RPC or fetching data.
    // We'll fetch all paid orders amount for now (assuming not huge dataset yet) or use a raw query if possible (not exposed here).
    // Better approach: create a view or RPC, but for now we'll fetch the amount column.
    const { data: revenueData, error: revenueError } = await supabase
      .from('ecommerce_orders')
      .select('amount_total')
      .eq('payment_status', 'paid');

    if (revenueError) throw revenueError;

    const totalRevenue = revenueData.reduce((sum, order) => sum + (parseFloat(order.amount_total) || 0), 0);

    // Fetch recent orders
    const { data: recentOrders, error: recentError } = await supabase
      .from('ecommerce_orders')
      .select('*, ecommerce_customers(name, email)')
      .order('created_at', { ascending: false })
      .limit(5);

    if (recentError) throw recentError;

    return createResponse({
      stats: {
        total_orders: ordersCount || 0,
        total_customers: customersCount || 0,
        total_revenue: totalRevenue,
      },
      recent_orders: recentOrders || [],
    });
  } catch (error) {
    console.error('Error fetching ecommerce stats:', error);
    return createErrorResponse('Internal server error', 500, error.message);
  }
}
