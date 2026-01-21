export type LabelChildren = {
  title: string;
  link: string;
};

export type FooterLabelForm = {
  label: {
    title: string;
    link: string;
    children: LabelChildren[];
  }[];
};

export type Footer = {
  col1: {
    logo: string;
    linkLogo?: string;
    title: string;
    content: string;
    label: string;
    image: string;
    linkImage?: string;
  };
  col2: {
    label: FooterLabelForm["label"];
  };
  col3: {
    label: FooterLabelForm["label"];
  };
  col4: {
    openFormConsultation: boolean;
    openFanpage: boolean;
    label: FooterLabelForm["label"];
  };
};
