import { NextResponse } from 'next/server';
import { getTaxReturns } from 'lib/actions/taxReturn.actions';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {
    const taxReturns = await getTaxReturns(userId);
    return NextResponse.json(taxReturns);
  } catch (error) {
    console.error('Error fetching tax returns:', error);
    return NextResponse.json({ error: 'Failed to fetch tax returns' }, { status: 500 });
  }
}
