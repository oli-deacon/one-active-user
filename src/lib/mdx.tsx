import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";

type MdxProps = {
  source: string;
};

const components = {
  a: (props: React.ComponentPropsWithoutRef<"a">) => {
    const href = props.href ?? "";
    if (href.startsWith("/")) {
      return <Link {...props} href={href} />;
    }

    return <a {...props} target="_blank" rel="noreferrer" />;
  },
};

export function MdxContent({ source }: MdxProps) {
  return <MDXRemote source={source} components={components} />;
}
