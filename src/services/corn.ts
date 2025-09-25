export const purchaseCorn = async (userId: string) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/corn`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId }),
  });
  const data = await res.json();
  return data;
};
