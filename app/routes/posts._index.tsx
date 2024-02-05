import { Link, useLoaderData } from "@remix-run/react";
import type { LoaderFunctionArgs } from "@vercel/remix";
import { json } from "@vercel/remix";
import { prisma } from "~/prisma.server";

export const loader = async (args: LoaderFunctionArgs) => {
  const posts = await prisma.posts.findMany({
    orderBy: {
      created_at: "desc",
    },
  });

  return json({
    posts,
  });
};

const Page = () => {
  const loadedData = useLoaderData<typeof loader>();

  return (
    <div>
      {loadedData.posts.map((post: any) => (
        <div key={post.id}>
          <Link to={`/posts/${post.id}`} className="text-xl">
            {post.title}
          </Link>
          <div className="text-sm text-gray-400">{post.created_at}</div>
        </div>
      ))}
    </div>
  );
};
export default Page;
