import type { MetaFunction, LoaderFunctionArgs } from "@vercel/remix";
import { Link, useLoaderData, useSearchParams } from "@remix-run/react";
import { json } from "@vercel/remix";
import { prisma } from "~/prisma.server";
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Pagination,
} from "@nextui-org/react";

export const meta: MetaFunction = () => {
  return [
    { title: "Time Tracking App" },
    { name: "description", content: "时间追踪器; time tacking" },
  ];
};

const PAGE_SIZE = 1;
export const loader = async (args: LoaderFunctionArgs) => {
  const search = new URL(args.request.url).searchParams;
  const page = Number(search.get("page") || 1);

  const [posts, total] = await prisma.$transaction([
    prisma.posts.findMany({
      orderBy: {
        createdAt: "desc",
      },
      // 分页查询
      take: PAGE_SIZE,
      skip: (page - 1) * PAGE_SIZE,
    }),
    prisma.posts.count(),
  ]);

  return json({
    posts,
    pageCount: Math.ceil(total / PAGE_SIZE),
  });
};

const Page = () => {
  const loadedData = useLoaderData<typeof loader>();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page") || 1);

  return (
    <div>
      <div className="p-12 flex flex-col gap-4">
        {loadedData.posts.map((post: any) => (
          <Card key={post.id} className="">
            <CardHeader>
              <Link to={`/posts/${post.id}`} className="text-xl">
                {post.title}
              </Link>
            </CardHeader>
            <CardBody>{post.content}</CardBody>
            <CardFooter>
              <div className="text-sm text-gray-400">{post.createdAt}</div>
            </CardFooter>
          </Card>
        ))}
        <Pagination
          total={loadedData.pageCount}
          page={page}
          onChange={async (page) => {
            const newSearchParams = new URLSearchParams(searchParams);
            newSearchParams.set("page", String(page));
            setSearchParams(newSearchParams);
          }}
        />
      </div>
    </div>
  );
};
export default Page;
