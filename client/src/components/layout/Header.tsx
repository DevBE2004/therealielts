import RenderHeader from "./render-header";

type Props = {
  urlWeb: string;
};

export const revalidate = 300;

export default function Header({ urlWeb }: Props) {
  return <RenderHeader urlWeb={urlWeb} />;
}
