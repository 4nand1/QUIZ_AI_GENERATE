import { redirect } from "next/navigation";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function LegacySummaryPage({ params }: PageProps) {
  const { id } = await params;

  if (!id || id === "undefined" || id === "null") {
    redirect("/");
  }

  redirect(`/${id}`);
}
